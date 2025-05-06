// services/nominas.service.js
const db = require('../models');
// Importar servicios dependientes
const CalculosService = require('./calculos.service');
const PrestamosService = require('./prestamos.service');

// Importar modelos que se usan directamente en el servicio
const PeriodoPago = db.PeriodoPago;
const Nomina = db.Nomina;
const DetalleNomina = db.DetalleNomina;
const Empleado = db.Empleado;
const Puesto = db.Puesto;
const HoraExtra = db.HoraExtra; // <-- Importar el modelo HoraExtra
// const ConceptoAplicado = db.ConceptoAplicado;
// const PagoPrestamo = db.PagoPrestamo;
// const LiquidacionViatico = db.LiquidacionViatico;
const Prestamo = db.Prestamo;

const { Op } = require('sequelize'); // Importar Op para condiciones de fecha y otros operadores


class NominasService {
    constructor() {
        this.models = db; // Acceso a todos los modelos via db
        this.calculosService = new CalculosService();
        this.prestamosService = new PrestamosService();
    }

    async generarNomina(idPeriodo, usuarioGeneracion = 'Sistema') {
        const t = await this.models.sequelize.transaction(); // Iniciar transacción
        try {
            // 1. Validar y obtener el Periodo de Pago
            const periodo = await this.models.PeriodoPago.findByPk(idPeriodo, { transaction: t });
            if (!periodo) {
                throw new Error('Periodo de Pago no encontrado');
            }

            // --- INICIO: PARSEO MANUAL DE FECHAS A OBJETO Date (Mantener por si el driver no hidrata) ---
            // Esto es necesario porque Sequelize o el driver no está convirtiendo DATEONLY a Date automáticamente.
            // Creamos nuevas variables con los objetos Date parseados.
            let fechaInicioDate = null;
            if (periodo.fecha_inicio) {
                const parsedDate = new Date(periodo.fecha_inicio);
                if (!isNaN(parsedDate.getTime())) {
                    fechaInicioDate = parsedDate;
                }
            }

            let fechaFinDate = null;
            if (periodo.fecha_fin) {
                const parsedDate = new Date(periodo.fecha_fin);
                if (!isNaN(parsedDate.getTime())) {
                    fechaFinDate = parsedDate;
                }
            }
            // --- FIN: PARSEO MANUAL DE FECHAS ---


            // 2. Verificar si ya existe una nómina para este periodo
            const existingNomina = await this.models.Nomina.findOne({ where: { id_periodo: idPeriodo } }, { transaction: t });
            if (existingNomina) {
                throw new Error(`Ya existe una nómina para el periodo "${periodo.nombre}". Su estado es "${existingNomina.estado}".`);
            }

            // 3. Crear el registro principal de la Nómina
            // --- VERIFICACIÓN SEGURA DE FECHAS PARA DESCRIPCIÓN (AHORA USANDO fechaInicioDate) ---
            // Usamos el objeto Date parseado para obtener el año.
            const anioParaDescripcion = (fechaInicioDate !== null)
                ? fechaInicioDate.getFullYear()
                : 2025; // Valor por defecto si el parseo falló o la fecha era nula

            const nuevaNomina = await this.models.Nomina.create({
                id_periodo: idPeriodo,
                descripcion: `Nómina ${periodo.nombre} - ${anioParaDescripcion}`, // Usamos la variable segura
                estado: 'Borrador',
                fecha_generacion: new Date(),
                usuario_generacion: usuarioGeneracion,
                activo: true,
                total_ingresos: 0, // Se actualizará después
                total_descuentos: 0, // Se actualizará después
                total_neto: 0, // Se actualizará después
            }, { transaction: t });

            // 4. Obtener empleados activos (y sus posibles relaciones para cálculos como Puesto -> Salario Base)
            const empleados = await this.models.Empleado.findAll({
                where: { activo: true },
                 // Puedes añadir lógica para filtrar empleados contratados dentro del rango del periodo
                 include: [
                     { model: this.models.Puesto, as: 'puesto' }
                 ]
            }, { transaction: t });

            const detallesNominaData = [];
            let totalIngresosNomina = 0;
            let totalDescuentosNomina = 0;
            let totalNetoNomina = 0;

            // --- VERIFICACIÓN SEGURA PARA AÑO DE CÁLCULOS (AHORA USANDO fechaFinDate) ---
            // Usamos el objeto Date parseado para obtener el año para los cálculos.
            const anioParaCalculo = (fechaFinDate !== null)
              ? fechaFinDate.getFullYear()
              : null; // Mantenemos null si no se pudo obtener un año válido, tus servicios de cálculo deben manejar esto

            if (anioParaCalculo === null) {
                console.warn(`Periodo ID ${idPeriodo} - FECHA DE FIN NO ES UNA FECHA VÁLIDA/NULA DESPUÉS DEL PARSEO MANUAL. No se realizarán cálculos de IGSS/ISR que dependen del año. Valor original: ${periodo.fecha_fin}`);
                // Decide si lanzar un error fatal aquí si un año de cálculo es esencial
                // throw new Error(`La fecha de fin del período "${periodo.nombre}" no es válida para realizar cálculos de IGSS/ISR.`);
            }
            // -----------------------------------------------------

            // Array para almacenar los objetos de Horas Extras que se incluyeron.
            // Los necesitamos completos para poder actualizarlos después con el id_detalle_nomina.
            const horasExtrasParaActualizar = [];


            // 5. Iterar sobre cada empleado para crear su detalle de nómina
            for (const empleado of empleados) {
                // --- Lógica de Cálculo para cada Empleado ---

                 // Obtener el salario mensual completo del empleado - Usado para cálculos base (IGSS, ISR, HE)
                const salarioBaseMensual = parseFloat(empleado.salario_actual || 0);

                // --- Calcular el Salario Base para el Período Actual (Mensual o Quincenal) ---
                let salarioBasePeriodo = salarioBaseMensual; // Por defecto es el salario mensual completo
                if (periodo.tipo === 'Quincenal') {
                    salarioBasePeriodo = parseFloat((salarioBaseMensual / 2).toFixed(2)); // Si es quincenal, es la mitad
                } else if (periodo.tipo !== 'Mensual') {
                    console.warn(`Tipo de periodo desconocido "${periodo.tipo}" para el periodo ID ${idPeriodo}. Asumiendo salario mensual completo.`);
                }

                // Determinar días del periodo (campo informativo)
                const diasPeriodoNominal = (periodo.tipo === 'Mensual') ? 30 : (periodo.tipo === 'Quincenal' ? 15 : null);
                const diasTrabajados = diasPeriodoNominal || 30; // Podría ser menos si la lógica de asistencia estuviera implementada


                // Cálculos de descuentos (IGSS, ISR) - Usan el SALARIO MENSUAL completo para EL CÁLCULO
                console.log(`DEBUG (${empleado.id_empleado}, Periodo ${periodo.id_periodo}): Calculando IGSS/ISR con Salario Mensual: ${salarioBaseMensual}, Año: ${anioParaCalculo}`); // <-- LOG 1

                const igssLaboralCalculadoMensual = (anioParaCalculo !== null) ? await this.calculosService.calcularIGSS(salarioBaseMensual, anioParaCalculo) : 0;
                const isrResultadoCalculadoMensual = (anioParaCalculo !== null) ? await this.calculosService.calcularISR(salarioBaseMensual, anioParaCalculo) : { isrMensual: 0, tablaAplicada: null };
                const isrCalculadoMensual = isrResultadoCalculadoMensual.isrMensual;

                console.log(`DEBUG (${empleado.id_empleado}, Periodo ${periodo.id_periodo}): Resultados Calculados Mensual - IGSS: ${igssLaboralCalculadoMensual}, ISR: ${isrCalculadoMensual}`); // <-- LOG 2


                // --- Ajuste para IGSS e ISR en caso de Nómina Quincenal ---
                 // Dividir el resultado de los cálculos por 2 si el período es Quincenal
                 let igssLaboralPeriodo = igssLaboralCalculadoMensual;
                 let isrPeriodo = isrCalculadoMensual;

                 if (periodo.tipo === 'Quincenal') {
                     igssLaboralPeriodo = parseFloat((igssLaboralCalculadoMensual / 2).toFixed(2));
                     isrPeriodo = parseFloat((isrCalculadoMensual / 2).toFixed(2));
                 }
                console.log(`DEBUG (${empleado.id_empleado}, Periodo ${periodo.id_periodo}): Resultados Aplicados Periodo (${periodo.tipo}) - IGSS: ${igssLaboralPeriodo}, ISR: ${isrPeriodo}`); // <-- LOG 3
                // ----------------------------------------------------


                // Bonificación incentivo mensual completa (ley de Guatemala)
                const bonificacionIncentivo = 250; // Nota: Si la bonificación también debe ser proporcional al periodo, ajustar aquí


                // --- INICIO: Lógica de Horas Extras ---
                 let totalHorasExtrasEmpleado = 0;
                 let montoTotalHorasExtrasEmpleado = 0;

                 // Obtener las Horas Extras APROBADAS y NO PAGADAS para este empleado en este período
                 const empleadoHorasExtras = await this.models.HoraExtra.findAll({
                     where: {
                         id_empleado: empleado.id_empleado,
                         fecha: {
                             [Op.between]: [periodo.fecha_inicio, periodo.fecha_fin]
                         },
                         estado: 'Aprobada',
                         id_detalle_nomina: null,
                         activo: true
                     }
                 }, { transaction: t });

                 if (empleadoHorasExtras.length > 0) {
                     totalHorasExtrasEmpleado = empleadoHorasExtras.reduce((sum, he) => sum + parseFloat(he.horas || 0), 0);

                     // Calcular el monto a pagar por horas extras - Usamos el SALARIO MENSUAL para el CÁLCULO
                     montoTotalHorasExtrasEmpleado = await this.calculosService.calcularHorasExtras(salarioBaseMensual, totalHorasExtrasEmpleado); // <-- Pasa salarioBaseMensual

                     // Recopilar los objetos completos de Horas Extras para actualizarlas luego
                     horasExtrasParaActualizar.push(...empleadoHorasExtras);
                 }
                 // --- FIN: Lógica de Horas Extras ---


                // --- Obtener otros Ingresos y Descuentos (Préstamos) ---
                const cuotasPrestamosPendientes = await this.models.Prestamo.findAll({
                    where: {
                        id_empleado: empleado.id_empleado,
                        estado: 'En Curso' // O estado que indique que aplica descuento por nómina
                    },
                }, { transaction: t });

                let totalDescuentoPrestamos = 0;
                // Array para recolectar datos de pagos de préstamo si se crean registros aquí
                const pagosPrestamoDataParaBulkCreate = [];

                for (const prestamo of cuotasPrestamosPendientes) {
                    const montoAPagar = Math.min(parseFloat(prestamo.cuota_mensual || 0), parseFloat(prestamo.saldo_pendiente || 0));
                    
                    // Opcional: Recolectar datos para crear registros en PagoPrestamo después del bulkCreate de detalles
                    /*
                    if (montoAPagar > 0) {
                         pagosPrestamoDataParaBulkCreate.push({
                             id_prestamo: prestamo.id_prestamo,
                             monto_pagado: montoAPagar,
                             fecha_pago: periodo.fecha_fin, // O la fecha de pago real
                             tipo_pago: 'Nómina',
                             id_empleado: empleado.id_empleado, // <-- Necesitamos el ID del empleado para mapear al DetalleNomina después
                             // id_detalle_nomina se añadirá después del bulkCreate de DetalleNomina
                             activo: true
                         });
                    }
                    */

                    totalDescuentoPrestamos += montoAPagar;
                }
                // ... Lógica para otros ingresos/descuentos (Ausencias, Viáticos, Conceptos Fijos/Variables)


                // 6. Calcular totales para el detalle de este empleado
                // Usamos el salario base DEL PERIODO y los descuentos ajustados al PERIODO
                const totalIngresosDetalle = salarioBasePeriodo + bonificacionIncentivo + montoTotalHorasExtrasEmpleado; // <-- Sumar salarioBasePeriodo
                const totalDescuentosDetalle = igssLaboralPeriodo + isrPeriodo + totalDescuentoPrestamos; // <-- Usar IGSS e ISR DEL PERIODO
                const liquidoRecibir = totalIngresosDetalle - totalDescuentosDetalle;

                // 7. Preparar datos para el registro DetalleNomina
                detallesNominaData.push({
                    id_nomina: nuevaNomina.id_nomina,
                    id_empleado: empleado.id_empleado,
                    salario_base: salarioBasePeriodo, // <-- Asignar salarioBasePeriodo
                    dias_trabajados: diasTrabajados,
                    bonificacion_incentivo: bonificacionIncentivo, // Podría ajustarse si la bonificación es proporcional
                    igss_laboral: igssLaboralPeriodo, // <-- Asignar IGSS DEL PERIODO
                    isr: isrPeriodo, // <-- Asignar ISR DEL PERIODO
                    horas_extra: totalHorasExtrasEmpleado,
                    monto_horas_extra: montoTotalHorasExtrasEmpleado,
                    otros_ingresos: 0, // Reemplazar con otros ingresos calculados
                    otros_descuentos: totalDescuentoPrestamos, // Reemplazar con otros descuentos calculados
                    total_ingresos: totalIngresosDetalle,
                    total_descuentos: totalDescuentosDetalle,
                    liquido_recibir: liquidoRecibir,
                    observaciones: '',
                    activo: true,
                });

                // 8. Acumular totales para el registro principal de la Nómina
                totalIngresosNomina += totalIngresosDetalle;
                totalDescuentosNomina += totalDescuentosDetalle;
                totalNetoNomina += liquidoRecibir;

            } // --- FIN DEL BUCLE DE EMPLEADOS ---


            // 10. Crear todos los registros DetalleNomina en masa
            const detallesCreados = await this.models.DetalleNomina.bulkCreate(detallesNominaData, { transaction: t });

            // 11. Mapear los IDs de los detalles creados a sus IDs de empleado
            const detalleIdPorEmpleadoIdMap = {};
            detallesCreados.forEach(detalle => {
                detalleIdPorEmpleadoIdMap[detalle.id_empleado] = detalle.id_detalle;
            });

            // 12. Crear registros de PagoPrestamo (Si tu lógica los crea durante la generación)
            // Si recolectaste datos para PagoPrestamo en el bucle, debes asignar id_detalle_nomina aquí antes de bulkCreate.
            /*
            if (pagosPrestamoDataParaBulkCreate.length > 0) {
                // Asignar el id_detalle_nomina a cada pago de préstamo usando el mapa
                const pagosPrestamoDataConDetalleId = pagosPrestamoDataParaBulkCreate.map(pagoData => ({
                    ...pagoData,
                    id_detalle_nomina: detalleIdPorEmpleadoIdMap[pagoData.id_empleado] // Asigna el ID del detalle del empleado
                }));
                await this.models.PagoPrestamo.bulkCreate(pagosPrestamoDataConDetalleId, { transaction: t });
            }
            */

            // --- INICIO: Actualizar Horas Extras para marcarlas como pagadas (Workaround para Sequelize < v6) ---
            if (horasExtrasParaActualizar.length > 0) {
                // Iterar sobre cada objeto de Hora Extra obtenido y actualizarlo individualmente
                for (const horaExtra of horasExtrasParaActualizar) {
                    const idDetalleNominaAsignado = detalleIdPorEmpleadoIdMap[horaExtra.id_empleado];

                    if (idDetalleNominaAsignado) {
                        // Usar el método update() de la instancia del modelo
                        await horaExtra.update({
                            id_detalle_nomina: idDetalleNominaAsignado,
                            estado: 'Pagada'
                        }, { transaction: t }); // ¡Importante! Usar la transacción
                    } else {
                        console.warn(`No se encontró id_detalle_nomina para el empleado ID ${horaExtra.id_empleado} asociado a HoraExtra ID ${horaExtra.id_hora_extra}. No se pudo actualizar la hora extra.`);
                        // Considerar qué hacer aquí: lanzar error, registrar, etc.
                    }
                }
            }
            // --- FIN: Actualizar Horas Extras ---


            // 13. Actualizar los totales en el registro principal de la Nómina
             // Los totales ya fueron acumulados en el bucle
            await nuevaNomina.update({
                total_ingresos: totalIngresosNomina,
                total_descuentos: totalDescuentosNomina,
                total_neto: totalNetoNomina
            }, { transaction: t });

            // 14. Commit la transacción
            await t.commit();
            console.log(`Nómina generada con éxito para periodo ${periodo.nombre}. ID Nómina: ${nuevaNomina.id_nomina}`);

            // 15. Opcional: Cargar la nómina completa con relaciones para la respuesta
            // Nota: Este findByPk está fuera de la transacción original, lo cual es correcto.
            const nominaCompleta = await this.models.Nomina.findByPk(nuevaNomina.id_nomina, {
                include: [
                    { model: this.models.DetalleNomina, as: 'detalles_nomina' },
                    { model: this.models.PeriodoPago, as: 'periodo_pago' } // Incluir periodo si sus datos se usan en la respuesta/frontend
                ]
            });
            return nominaCompleta;

        } catch (error) {
            // Rollback la transacción si algo falla
            await t.rollback();
            console.error("Error generando nómina:", error);
            throw error; // Relanza el error para que sea manejado por el controlador
        }
    }

    async verificarNomina(idNomina) {
        const nomina = await this.models.Nomina.findByPk(idNomina);
        if (!nomina) throw new Error('Nómina no encontrada');
        if (nomina.estado !== 'Borrador') {
            throw new Error(`Solo se pueden verificar nóminas en estado Borrador. Estado actual: ${nomina.estado}`);
        }

        // Aquí podrías añadir lógica para re-validar cálculos o datos antes de verificar
        // ...

        await nomina.update({ estado: 'Verificada' });
        return nomina;
    }

    async aprobarNomina(idNomina, usuarioAprobacion) {
        const nomina = await this.models.Nomina.findByPk(idNomina);
        if (!nomina) throw new Error('Nómina no encontrada');
        if (nomina.estado !== 'Verificada') {
            throw new Error(`Solo se pueden aprobar nóminas en estado Verificada. Estado actual: ${nomina.estado}`);
        }

        // Usa una transacción si la aprobación implica múltiples pasos (ej: aplicar pagos de préstamos)
         const t = await this.models.sequelize.transaction();
         try {
             // Lógica para aplicar pagos de préstamos, viáticos, etc. incluidos en esta nómina
             // Esto podría implicar actualizar saldos en otras tablas (Prestamos, LiquidacionViaticos)
             // O llamar a servicios específicos para cada tipo de aplicación.

             // Ejemplo: Obtener detalles de nómina con pagos de préstamo asociados para esta nómina
             const detallesConPagosPrestamo = await this.models.DetalleNomina.findAll({
                 where: { id_nomina: idNomina },
                 include: [{
                     model: this.models.PagoPrestamo,
                     as: 'pagos_prestamo_asociados',
                     include: [{ model: this.models.Prestamo, as: 'prestamo' }] // Incluir el préstamo padre
                 }]
             }, { transaction: t });

             for (const detalle of detallesConPagosPrestamo) {
                 for (const pagoPrestamo of detalle.pagos_prestamo_asociados) {
                      // Llama al servicio de préstamos para procesar el pago y actualizar el saldo
                      // Asegúrate de que procesarPagoPrestamo pueda recibir una transacción opcional
                      // await this.prestamosService.procesarPagoPrestamo(pagoPrestamo.id_prestamo, pagoPrestamo.monto_pagado, 'Nómina', detalle.id_detalle, t);
                      console.log(`Verificando aplicación de pago de préstamo ${pagoPrestamo.id_pago} para préstamo ${pagoPrestamo.id_prestamo}...`);
                 }
             }

             // Actualizar el estado de la nómina
             await nomina.update({
                 estado: 'Aprobada',
                 usuario_aprobacion: usuarioAprobacion,
                 fecha_aprobacion: new Date()
             }, { transaction: t });

             await t.commit();
             return nomina;

         } catch (error) {
             await t.rollback();
             console.error("Error aprobando nómina:", error);
             throw error;
         }
    }

     async pagarNomina(idNomina) {
         const nomina = await this.models.Nomina.findByPk(idNomina);
         if (!nomina) throw new Error('Nómina no encontrada');
         if (nomina.estado !== 'Aprobada') {
             throw new Error(`Solo se pueden marcar como pagadas nóminas en estado Aprobada. Estado actual: ${nomina.estado}`);
         }

         // Aquí podrías añadir lógica para integración con sistemas de pago, bancos, etc.
         // ...

         await nomina.update({ estado: 'Pagada' });
         return nomina;
     }

     // Otros métodos para la gestión de nóminas:
     // - anularNomina(idNomina)
     // - obtenerNominaPorPeriodo(idPeriodo)
     // - obtenerBoletaDePago(idDetalleNomina)
     // - recalcularTotalesNomina(idNomina) // Si necesitas re-calcular después de modificaciones
}

module.exports = NominasService;