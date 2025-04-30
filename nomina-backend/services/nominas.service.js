// services/nominas.service.js
const db = require('../models');
// Importar servicios dependientes
const CalculosService = require('./calculos.service');
const PrestamosService = require('./prestamos.service');
// Importar modelos si se usan directamente en el servicio (aparte de db.Modelo)
// const PeriodoPago = db.PeriodoPago;
// const Nomina = db.Nomina;
// const DetalleNomina = db.DetalleNomina;
// const Empleado = db.Empleado;
// const Puesto = db.Puesto; // Si se incluye en empleados
// const ConceptoAplicado = db.ConceptoAplicado; // Si se usa en cálculos
// const PagoPrestamo = db.PagoPrestamo; // Si se usa en aprobación
// const HoraExtra = db.HoraExtra; // Si se usa en cálculos de ingresos
// const LiquidacionViatico = db.LiquidacionViatico; // Si se usa en cálculos de ingresos
// const Prestamo = db.Prestamo; // Si se usa para descuentos de préstamos


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

            // 2. Verificar si ya existe una nómina para este periodo
            const existingNomina = await this.models.Nomina.findOne({ where: { id_periodo: idPeriodo } }, { transaction: t });
            if (existingNomina) {
                throw new Error(`Ya existe una nómina para el periodo "${periodo.nombre}". Su estado es "${existingNomina.estado}".`);
            }

            // 3. Crear el registro principal de la Nómina
            // --- VERIFICACIÓN SEGURA DE FECHAS PARA DESCRIPCIÓN ---
            const anioInicio = (periodo.fecha_inicio && periodo.fecha_inicio instanceof Date && !isNaN(periodo.fecha_inicio))
                ? periodo.fecha_inicio.getFullYear()
                : 'Año Desconocido'; // Valor por defecto si no es una fecha válida

            const nuevaNomina = await this.models.Nomina.create({
                id_periodo: idPeriodo,
                descripcion: `Nómina ${periodo.nombre} - ${anioInicio}`, // Usamos la variable segura
                estado: 'Borrador',
                fecha_generacion: new Date(),
                usuario_generacion: usuarioGeneracion,
                activo: true,
                total_ingresos: 0,
                total_descuentos: 0,
                total_neto: 0,
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

            // --- VERIFICACIÓN SEGURA PARA AÑO DE CÁLCULOS ---
            // Aseguramos que el año sea válido antes de pasarlo a los servicios de cálculo
            const anioFin = (periodo.fecha_fin && periodo.fecha_fin instanceof Date && !isNaN(periodo.fecha_fin))
              ? periodo.fecha_fin.getFullYear()
              : null; // Usamos null si la fecha fin no es válida, tus servicios de cálculo deben manejar esto

            if (anioFin === null) {
                console.warn(`Periodo ID ${idPeriodo} tiene fecha_fin inválida para cálculos. fecha_fin: ${periodo.fecha_fin}`);
                // Considera lanzar un error si un año de cálculo es esencial
                // throw new Error(`La fecha de fin del período ${periodo.nombre} es inválida para realizar cálculos.`);
            }


            // 5. Iterar sobre cada empleado para crear su detalle de nómina
            for (const empleado of empleados) {
                // --- Lógica de Cálculo para cada Empleado ---
                const salarioBase = parseFloat(empleado.salario_actual || 0); // Usar salario actual del empleado, parsear a número

                // Determinar días del periodo
                const diasPeriodo = (periodo.tipo === 'Mensual') ? 30 : (periodo.tipo === 'Quincenal' ? 15 : null);
                if (diasPeriodo === null) {
                    console.warn(`Tipo de periodo desconocido "${periodo.tipo}" para cálculo de días trabajados para empleado ID ${empleado.id_empleado}. Usando 30 por defecto.`);
                }
                const diasTrabajados = diasPeriodo || 30; // Podría ser menos si el empleado no trabajó el periodo completo


                // Cálculos básicos - Usar el año de fin verificado
                const igssLaboral = (anioFin !== null) ? await this.calculosService.calcularIGSS(salarioBase, anioFin) : 0; // Manejar año nulo
                const isrResultado = (anioFin !== null) ? await this.calculosService.calcularISR(salarioBase, anioFin) : { isrMensual: 0, tablaAplicada: null }; // Manejar año nulo
                const isrMensual = isrResultado.isrMensual;

                const bonificacionIncentivo = 250; // Asumimos bonificación fija mensual

                // --- Obtener otros Ingresos y Descuentos ---
                // (La lógica de préstamos aquí es un ejemplo básico, expande según tus necesidades)
                const cuotasPrestamosPendientes = await this.models.Prestamo.findAll({
                    where: {
                        id_empleado: empleado.id_empleado,
                        estado: 'En Curso'
                    },
                    // Considera filtrar por fechas del periodo o revisar si ya hay pagos registrados en PagoPrestamo para este periodo/cuota
                }, { transaction: t });

                let totalDescuentoPrestamos = 0;
                // Si generas PagoPrestamo aquí, almacena los datos y créalos en masa después del bulkCreate de detalles
                // const pagosPrestamoDataParaBulkCreate = [];

                for (const prestamo of cuotasPrestamosPendientes) {
                    // Lógica para determinar el monto a descontar (cuota_mensual vs saldo_pendiente)
                    const montoAPagar = Math.min(parseFloat(prestamo.cuota_mensual || 0), parseFloat(prestamo.saldo_pendiente || 0));
                    totalDescuentoPrestamos += montoAPagar;

                    // Si vas a crear registros en la tabla PagoPrestamo durante la generación de nómina:
                    /*
                    pagosPrestamoDataParaBulkCreate.push({
                        id_prestamo: prestamo.id_prestamo,
                        monto_pagado: montoAPagar,
                        fecha_pago: periodo.fecha_fin, // O periodo.fecha_pago si existe
                        tipo_pago: 'Nómina',
                        // id_detalle_nomina se asignará después del bulkCreate de detalles
                        activo: true
                    });
                    */
                }
                // ... Lógica para otros ingresos/descuentos (Horas Extras, Ausencias, Viáticos, Conceptos Fijos/Variables)


                // 6. Calcular totales para el detalle de este empleado
                const totalIngresosDetalle = salarioBase + bonificacionIncentivo; // + Horas Extras + Otros Ingresos
                const totalDescuentosDetalle = igssLaboral + isrMensual + totalDescuentoPrestamos; // + Ausencias + Otros Descuentos
                const liquidoRecibir = totalIngresosDetalle - totalDescuentosDetalle;

                // 7. Preparar datos para el registro DetalleNomina
                detallesNominaData.push({
                    id_nomina: nuevaNomina.id_nomina,
                    id_empleado: empleado.id_empleado,
                    salario_base: salarioBase,
                    dias_trabajados: diasTrabajados,
                    bonificacion_incentivo: bonificacionIncentivo,
                    igss_laboral: igssLaboral,
                    isr: isrMensual,
                    horas_extra: 0, // Reemplazar con el total calculado
                    monto_horas_extra: 0, // Reemplazar con el monto calculado
                    otros_ingresos: 0, // Reemplazar con el total calculado
                    otros_descuentos: totalDescuentoPrestamos, // Reemplazar con el total calculado
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
            }

            // 9. Crear todos los registros DetalleNomina en masa
            // Retorna los registros creados con sus IDs asignados
            const detallesCreados = await this.models.DetalleNomina.bulkCreate(detallesNominaData, { transaction: t });

            // 10. Crear registros de PagoPrestamo si la lógica de descuento de préstamo los genera aquí
            // Si recolectaste datos para PagoPrestamo en el bucle, créalos ahora.
            // Necesitarás mapear los detallesCreados a los empleados originales para asignar id_detalle_nomina.
            /*
             if (pagosPrestamoDataParaBulkCreate.length > 0) {
                 // Lógica para asignar id_detalle_nomina a pagosPrestamoDataParaBulkCreate
                 // ...
                 await this.models.PagoPrestamo.bulkCreate(pagosPrestamoDataConDetalleId, { transaction: t });
             }
             */


            // 11. Actualizar los totales en el registro principal de la Nómina
            await nuevaNomina.update({
                total_ingresos: totalIngresosNomina,
                total_descuentos: totalDescuentosNomina,
                total_neto: totalNetoNomina
            }, { transaction: t });

            // 12. Commit la transacción
            await t.commit();
            console.log(`Nómina generada con éxito para periodo ${periodo.nombre}. ID Nómina: ${nuevaNomina.id_nomina}`);

            // 13. Opcional: Cargar la nómina completa con relaciones para la respuesta
            // Nota: Este findByPk está fuera de la transacción original, lo cual es correcto.
            const nominaCompleta = await this.models.Nomina.findByPk(nuevaNomina.id_nomina, {
                include: [{ model: this.models.DetalleNomina, as: 'detalles_nomina' }]
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