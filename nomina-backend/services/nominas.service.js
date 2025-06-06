// services/nominas.service.js
const db = require('../models');
// Importar servicios dependientes
const CalculosService = require('./calculos.service');
const PrestamosService = require('./prestamos.service'); // Asegúrate de que este servicio exista si lo vas a usar más adelante
const AusenciasService = require('./ausencias.service');

// Importar modelos que se usan directamente en el servicio
const PeriodoPago = db.PeriodoPago;
const Nomina = db.Nomina;
const DetalleNomina = db.DetalleNomina;
const Empleado = db.Empleado;
const Puesto = db.Puesto;
const HoraExtra = db.HoraExtra;
const PagoPrestamo = db.PagoPrestamo; // Asegúrate de importar PagoPrestamo
const Prestamo = db.Prestamo; // Asegúrate de importar Prestamo
const ConceptoPago = db.ConceptoPago; // Añadir modelo ConceptoPago
const ConceptoAplicado = db.ConceptoAplicado; // Añadir modelo ConceptoAplicado
// const LiquidacionViatico = db.LiquidacionViatico;


const { Op } = require('sequelize');


class NominasService {
    constructor() {
        this.models = db;
        this.calculosService = new CalculosService();
        this.prestamosService = new PrestamosService(); // Inicializa la instancia
        this.ausenciasService = new AusenciasService();
    }

    async generarNomina(idPeriodo, usuarioGeneracion = 'Sistema') {
        const t = await this.models.sequelize.transaction();
        try {
            // 1. Validar y obtener el Periodo de Pago
            const periodo = await this.models.PeriodoPago.findByPk(idPeriodo, { transaction: t });
            if (!periodo) {
                throw new Error('Periodo de Pago no encontrado');
            }

            // --- INICIO: PARSEO MANUAL DE FECHAS A OBJETO Date ---
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
            // --- VERIFICACIÓN SEGURA DE FECHAS PARA DESCRIPCIÓN ---
            const anioParaDescripcion = (fechaInicioDate !== null)
                ? fechaInicioDate.getFullYear()
                : new Date().getFullYear(); // Usar año actual si la fecha inicio no es válida

            const nuevaNomina = await this.models.Nomina.create({
                id_periodo: idPeriodo,
                descripcion: `Nómina ${periodo.nombre} - ${anioParaDescripcion}`,
                estado: 'Borrador',
                fecha_generacion: new Date(),
                usuario_generacion: usuarioGeneracion,
                activo: true,
                total_ingresos: 0,
                total_descuentos: 0,
                total_neto: 0,
            }, { transaction: t });

            // 4. Obtener empleados activos (y sus posibles relaciones)
            const empleados = await this.models.Empleado.findAll({
                where: { activo: true },
                 include: [
                     { model: this.models.Puesto, as: 'puesto' }
                 ]
            }, { transaction: t });

            const detallesNominaData = []; // Array para recolectar datos de detalles antes de crear
            let totalIngresosNomina = 0;
            let totalDescuentosNomina = 0;
            let totalNetoNomina = 0;

            // --- VERIFICACIÓN SEGURA PARA AÑO DE CÁLCULOS ---
            const anioParaCalculo = (fechaFinDate !== null)
              ? fechaFinDate.getFullYear()
              : null;

            if (anioParaCalculo === null) {
                console.warn(`Periodo ID ${idPeriodo} - FECHA DE FIN NO ES VÁLIDA O NULA. Cálculos de IGSS/ISR que dependen del año podrían ser 0.`);
            }
            // -----------------------------------------------------

            // Arrays para almacenar los objetos que necesitan actualización o creación posterior
            const horasExtrasParaActualizar = [];
            const pagosPrestamoDataParaCrear = []; // Array para datos de PagoPrestamo

            // 5. Iterar sobre cada empleado para recolectar datos y cálculos
            const detallesConceptosAplicados = []; // Mover la declaración aquí
            for (const empleado of empleados) {
                // --- Lógica de Cálculo para cada Empleado ---

                // Obtener el salario mensual completo del empleado
                const salarioBaseMensual = parseFloat(empleado.salario_actual || 0);

                // Calcular días trabajados considerando ausencias
                const { diasTrabajados, diasAusencia, diasTotales, detalleAusencias } = 
                    await this.ausenciasService.calcularDiasTrabajadosConAusencias(
                        empleado.id_empleado,
                        periodo.fecha_inicio,
                        periodo.fecha_fin
                    );

                // Calcular el Salario Base para el Período Actual considerando ausencias
                let salarioBasePeriodo = salarioBaseMensual;
                if (periodo.tipo === 'Quincenal') {
                    // Para quincenal, calculamos proporcionalmente según días trabajados
                    const diasQuincena = 15; // Días hábiles en una quincena
                    const factorProporcional = diasTrabajados / diasQuincena;
                    salarioBasePeriodo = parseFloat((salarioBaseMensual * factorProporcional / 2).toFixed(2));
                } else if (periodo.tipo === 'Mensual') {
                    // Para mensual, calculamos proporcionalmente según días trabajados
                    const diasMes = 30; // Días hábiles en un mes
                    const factorProporcional = diasTrabajados / diasMes;
                    salarioBasePeriodo = parseFloat((salarioBaseMensual * factorProporcional).toFixed(2));
                } else {
                    console.warn(`Tipo de periodo desconocido "${periodo.tipo}" para el periodo ID ${idPeriodo}. Asumiendo salario mensual completo.`);
                }

                // --- INICIO: Lógica de Conceptos de Pago ---
                // Obtener conceptos de pago activos que aplican a este empleado
                const conceptosPagoActivos = await ConceptoPago.findAll({
                    where: {
                        activo: true,
                        obligatorio: true // Solo conceptos obligatorios por ahora
                    }
                });

                let otrosIngresos = 0;
                let otrosDescuentos = 0;
                let baseIGSS = salarioBaseMensual;
                let baseISR = salarioBaseMensual;
                const conceptosParaEsteEmpleado = []; // Array temporal para este empleado

                // Procesar cada concepto de pago
                for (const concepto of conceptosPagoActivos) {
                    let montoConcepto = 0;

                    // Calcular monto según tipo de concepto
                    if (concepto.es_fijo) {
                        montoConcepto = parseFloat(concepto.monto_fijo || 0);
                    } else if (concepto.porcentaje) {
                        // Si es porcentaje, aplicar sobre el salario base del período
                        montoConcepto = parseFloat((salarioBasePeriodo * concepto.porcentaje / 100).toFixed(2));
                    }

                    // Acumular según tipo de concepto
                    if (concepto.tipo === 'Ingreso') {
                        otrosIngresos += montoConcepto;
                        if (concepto.afecta_igss) baseIGSS += montoConcepto;
                        if (concepto.afecta_isr) baseISR += montoConcepto;
                    } else if (concepto.tipo === 'Descuento') {
                        otrosDescuentos += montoConcepto;
                    }

                    // Guardar el concepto aplicado para este detalle
                    conceptosParaEsteEmpleado.push({
                        id_concepto: concepto.id_concepto,
                        monto: montoConcepto,
                        observacion: `Aplicado automáticamente por ser concepto obligatorio`,
                        activo: true
                    });
                }
                detallesConceptosAplicados.push(conceptosParaEsteEmpleado);
                // --- FIN: Lógica de Conceptos de Pago ---


                // Cálculos de descuentos (IGSS, ISR) - Usan el SALARIO MENSUAL completo para EL CÁLCULO
                const igssLaboralCalculadoMensual = (anioParaCalculo !== null) ? 
                    await this.calculosService.calcularIGSS(baseIGSS, anioParaCalculo) : 0;
                const isrResultadoCalculadoMensual = (anioParaCalculo !== null) ? 
                    await this.calculosService.calcularISR(baseISR, anioParaCalculo) : { isrMensual: 0, tablaAplicada: null };
                const isrCalculadoMensual = isrResultadoCalculadoMensual.isrMensual;

                // Ajuste para IGSS e ISR según el tipo de período y días trabajados
                 let igssLaboralPeriodo = igssLaboralCalculadoMensual;
                 let isrPeriodo = isrCalculadoMensual;

                 if (periodo.tipo === 'Quincenal') {
                     const factorProporcional = diasTrabajados / 15; // 15 días hábiles en quincena
                     igssLaboralPeriodo = parseFloat((igssLaboralCalculadoMensual * factorProporcional / 2).toFixed(2));
                     isrPeriodo = parseFloat((isrCalculadoMensual * factorProporcional / 2).toFixed(2));
                 } else if (periodo.tipo === 'Mensual') {
                     const factorProporcional = diasTrabajados / 30; // 30 días hábiles en mes
                     igssLaboralPeriodo = parseFloat((igssLaboralCalculadoMensual * factorProporcional).toFixed(2));
                     isrPeriodo = parseFloat((isrCalculadoMensual * factorProporcional).toFixed(2));
                 }

                // Bonificación incentivo mensual completa
                const bonificacionIncentivo = 250;


                // --- INICIO: Lógica de Horas Extras (Recolección) ---
                 let totalHorasExtrasEmpleado = 0;
                 let montoTotalHorasExtrasEmpleado = 0;

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
                     montoTotalHorasExtrasEmpleado = await this.calculosService.calcularHorasExtras(salarioBaseMensual, totalHorasExtrasEmpleado);
                     horasExtrasParaActualizar.push(...empleadoHorasExtras); // Recolectar instancias completas
                 }
                 // --- FIN: Lógica de Horas Extras (Recolección) ---


                // --- INICIO: Lógica de Préstamos (Recolección de datos para pago) ---
                const cuotasPrestamosPendientes = await this.models.Prestamo.findAll({
                    where: {
                        id_empleado: empleado.id_empleado,
                        estado: 'En Curso'
                    },
                }, { transaction: t });

                let totalDescuentoPrestamos = 0;
                // Recolectar datos para crear registros en PagoPrestamo después de crear DetalleNomina
                for (const prestamo of cuotasPrestamosPendientes) {
                    const montoAPagar = Math.min(parseFloat(prestamo.cuota_mensual || 0), parseFloat(prestamo.saldo_pendiente || 0));

                    if (montoAPagar > 0) {
                         // Guardamos el ID del préstamo, el monto pagado y el ID del empleado
                         // id_detalle_nomina se añadirá después de crear los detalles de nómina
                        pagosPrestamoDataParaCrear.push({
                            id_prestamo: prestamo.id_prestamo,
                            monto_pagado: montoAPagar,
                            fecha_pago: periodo.fecha_fin, // O la fecha de pago real
                            tipo_pago: 'Nómina',
                            id_empleado: empleado.id_empleado,
                            activo: true
                        });
                    }
                    totalDescuentoPrestamos += montoAPagar;
                }
                // --- FIN: Lógica de Préstamos (Recolección) ---


                // 6. Calcular totales para el detalle de este empleado
                const totalIngresosDetalle = salarioBasePeriodo + 
                    bonificacionIncentivo + 
                    montoTotalHorasExtrasEmpleado + 
                    otrosIngresos; // Incluir otros ingresos

                const totalDescuentosDetalle = igssLaboralPeriodo + 
                    isrPeriodo + 
                    totalDescuentoPrestamos + 
                    otrosDescuentos; // Incluir otros descuentos

                const liquidoRecibir = totalIngresosDetalle - totalDescuentosDetalle;

                // Dentro del bucle de empleados, justo antes de calcular los totales
                console.log(`DEBUG: Cálculo de totales para empleado ${empleado.id_empleado}:`);
                console.log(`- Salario Base del Período: ${salarioBasePeriodo}`);
                console.log(`- Bonificación Incentivo: ${bonificacionIncentivo}`);
                console.log(`- Monto Horas Extra: ${montoTotalHorasExtrasEmpleado}`);
                console.log(`- Otros Ingresos: ${otrosIngresos}`);
                console.log(`Total Ingresos: ${totalIngresosDetalle}`);

                console.log(`- IGSS Laboral: ${igssLaboralPeriodo}`);
                console.log(`- ISR: ${isrPeriodo}`);
                console.log(`- Descuento Préstamos: ${totalDescuentoPrestamos}`);
                console.log(`- Otros Descuentos: ${otrosDescuentos}`);
                console.log(`Total Descuentos: ${totalDescuentosDetalle}`);

                console.log(`Líquido a Recibir: ${liquidoRecibir}`);

                if (liquidoRecibir < 0) {
                    console.warn(`¡ADVERTENCIA! Líquido a recibir negativo para empleado ${empleado.id_empleado}`);
                    console.warn(`Detalle de la situación:`);
                    console.warn(`- Ingresos totales: ${totalIngresosDetalle}`);
                    console.warn(`- Descuentos totales: ${totalDescuentosDetalle}`);
                    console.warn(`- Diferencia: ${liquidoRecibir}`);
                    
                    // Análisis de proporciones
                    if (totalIngresosDetalle > 0) {
                        const porcentajeDescuentos = (totalDescuentosDetalle / totalIngresosDetalle) * 100;
                        console.warn(`- Los descuentos representan el ${porcentajeDescuentos.toFixed(2)}% de los ingresos`);
                    }
                    
                    // Análisis por componente
                    if (totalDescuentoPrestamos > 0) {
                        const porcentajePrestamos = (totalDescuentoPrestamos / totalDescuentosDetalle) * 100;
                        console.warn(`- Los préstamos representan el ${porcentajePrestamos.toFixed(2)}% de los descuentos`);
                    }
                }

                // 7. Preparar datos para el registro DetalleNomina
                detallesNominaData.push({
                    id_nomina: nuevaNomina.id_nomina,
                    id_empleado: empleado.id_empleado,
                    salario_base: salarioBasePeriodo,
                    dias_trabajados: diasTrabajados,
                    dias_ausencia: diasAusencia,
                    dias_totales_periodo: diasTotales,
                    bonificacion_incentivo: bonificacionIncentivo,
                    igss_laboral: igssLaboralPeriodo,
                    isr: isrPeriodo,
                    horas_extra: totalHorasExtrasEmpleado,
                    monto_horas_extra: montoTotalHorasExtrasEmpleado,
                    otros_ingresos: otrosIngresos, // Ahora es dinámico
                    otros_descuentos: totalDescuentoPrestamos + otrosDescuentos, // Incluye préstamos y otros descuentos
                    total_ingresos: totalIngresosDetalle,
                    total_descuentos: totalDescuentosDetalle,
                    liquido_recibir: liquidoRecibir,
                    observaciones: detalleAusencias.length > 0 ? 
                        `Ausencias aplicadas: ${detalleAusencias.map(a => 
                            `${a.tipo} (${a.dias} días)${a.afecta_salario ? ' - Afecta salario' : ''}`
                        ).join(', ')}` : '',
                    activo: true,
                    detalle_ausencias: JSON.stringify(detalleAusencias)
                });

                // 8. Acumular totales para el registro principal de la Nómina
                totalIngresosNomina += totalIngresosDetalle;
                totalDescuentosNomina += totalDescuentosDetalle;
                totalNetoNomina += liquidoRecibir;

            } // --- FIN DEL BUCLE DE EMPLEADOS ---


            // --- INICIO: Creación de Detalles de Nómina (Workaround para bulkCreate) ---
            // Iterar sobre los datos recolectados y crear cada detalle uno por uno
            const detallesCreados = []; // Para guardar las instancias creadas
            const detalleIdPorEmpleadoIdMap = {}; // Para mapear id_empleado a id_detalle
            for (const detalleData of detallesNominaData) {
                const detalleCreado = await this.models.DetalleNomina.create(detalleData, { transaction: t });
                detallesCreados.push(detalleCreado);
                detalleIdPorEmpleadoIdMap[detalleCreado.id_empleado] = detalleCreado.id_detalle;
            }
            console.log(`DEBUG: Creados ${detallesCreados.length} detalles de nómina individualmente.`);
            // --- FIN: Creación de Detalles de Nómina ---


            // --- INICIO: Aplicar Pagos de Préstamo (Creación y Actualización - Workaround para bulkCreate) ---
            if (pagosPrestamoDataParaCrear.length > 0) {
                console.log(`DEBUG: Procesando ${pagosPrestamoDataParaCrear.length} pagos de préstamo.`);

                // 12a. Asignar el id_detalle_nomina a cada pago de préstamo usando el mapa
                const pagosPrestamoDataConDetalleId = pagosPrestamoDataParaCrear.map(pagoData => ({
                    ...pagoData,
                    id_detalle_nomina: detalleIdPorEmpleadoIdMap[pagoData.id_empleado] // Asigna el ID del detalle del empleado
                }));

                // 12b. Crear los registros de PagoPrestamo uno por uno (Workaround para bulkCreate)
                const pagosPrestamoCreados = []; // Para guardar las instancias creadas si es necesario
                for (const pagoData of pagosPrestamoDataConDetalleId) {
                    const pagoCreado = await this.models.PagoPrestamo.create(pagoData, { transaction: t });
                    pagosPrestamoCreados.push(pagoCreado);
                }
                console.log(`DEBUG: Creados ${pagosPrestamoCreados.length} registros de PagoPrestamo individualmente.`);

                // 12c. Actualizar los saldos de los préstamos
                // Agrupar los pagos creados por id_prestamo para sumar el total pagado a cada préstamo
                const prestamosParaActualizar = {};
                // Usamos los datos originales que ya incluyen id_prestamo y monto_pagado
                pagosPrestamoDataConDetalleId.forEach(pago => {
                    if (!prestamosParaActualizar[pago.id_prestamo]) {
                        prestamosParaActualizar[pago.id_prestamo] = {
                            id_prestamo: pago.id_prestamo,
                            totalPagadoEnNomina: 0
                        };
                    }
                    prestamosParaActualizar[pago.id_prestamo].totalPagadoEnNomina += pago.monto_pagado;
                });

                // Obtener las instancias de Préstamo a actualizar (dentro de la transacción)
                const idsPrestamosAfectados = Object.keys(prestamosParaActualizar);
                if(idsPrestamosAfectados.length > 0) {
                    console.log(`DEBUG: Actualizando ${idsPrestamosAfectados.length} préstamos.`);
                     const prestamos = await this.models.Prestamo.findAll({
                         where: {
                             id_prestamo: { [Op.in]: idsPrestamosAfectados }
                         },
                         transaction: t // Usar la misma transacción
                     });

                     // Actualizar cada instancia de Préstamo uno por uno
                     for (const prestamo of prestamos) {
                         const montoTotalPagado = prestamosParaActualizar[prestamo.id_prestamo].totalPagadoEnNomina;
                         // Calcular el nuevo saldo
                         const nuevoSaldo = parseFloat((prestamo.saldo_pendiente - montoTotalPagado).toFixed(2));

                         // Actualizar saldo y estado si es necesario
                         const estadoActualizado = nuevoSaldo <= 0 ? 'Pagado' : 'En Curso';
                         const fechaCancelacion = nuevoSaldo <= 0 ? new Date() : null;

                         await prestamo.update({
                             saldo_pendiente: nuevoSaldo,
                             estado: estadoActualizado,
                             fecha_cancelacion: fechaCancelacion
                         }, { transaction: t }); // ¡Importante! Usar la transacción

                         console.log(`DEBUG: Préstamo ID ${prestamo.id_prestamo} actualizado. Saldo anterior: ${parseFloat(prestamo.saldo_pendiente).toFixed(2)}, Pagado: ${montoTotalPagado}, Nuevo Saldo: ${nuevoSaldo}, Nuevo Estado: ${estadoActualizado}`);
                     }
                } else {
                    console.log("DEBUG: No hay préstamos afectados para actualizar.");
                }
            } else {
                 console.log("DEBUG: No hay datos de pagos de préstamo para crear o actualizar.");
            }
            // --- FIN: Aplicar Pagos de Préstamo ---


            // --- INICIO: Actualizar Horas Extras para marcarlas como pagadas (Workaround para Sequelize < v6) ---
            // Este bloque ya usaba .update() individual, lo cual es correcto.
            if (horasExtrasParaActualizar.length > 0) {
                console.log(`DEBUG: Actualizando ${horasExtrasParaActualizar.length} horas extras.`);
                for (const horaExtra of horasExtrasParaActualizar) {
                    const idDetalleNominaAsignado = detalleIdPorEmpleadoIdMap[horaExtra.id_empleado];

                    if (idDetalleNominaAsignado) {
                        await horaExtra.update({
                            id_detalle_nomina: idDetalleNominaAsignado,
                            estado: 'Pagada'
                        }, { transaction: t });
                    } else {
                        console.warn(`No se encontró id_detalle_nomina para el empleado ID ${horaExtra.id_empleado} asociado a HoraExtra ID ${horaExtra.id_hora_extra}. No se pudo actualizar la hora extra.`);
                    }
                }
            } else {
                console.log("DEBUG: No hay horas extras para actualizar.");
            }
            // --- FIN: Actualizar Horas Extras ---


            // 13. Actualizar los totales en el registro principal de la Nómina
            await nuevaNomina.update({
                total_ingresos: totalIngresosNomina,
                total_descuentos: totalDescuentosNomina,
                total_neto: totalNetoNomina
            }, { transaction: t });

            // 14. Commit la transacción
            await t.commit();
            console.log(`Nómina generada con éxito para periodo ${periodo.nombre}. ID Nómina: ${nuevaNomina.id_nomina}`);

            // 15. Opcional: Cargar la nómina completa con relaciones para la respuesta
            const nominaCompleta = await this.models.Nomina.findByPk(nuevaNomina.id_nomina, {
                include: [
                    { model: this.models.DetalleNomina, as: 'detalles_nomina' },
                    { model: this.models.PeriodoPago, as: 'periodo_pago' }
                ]
            });

            // 11. Crear los conceptos aplicados para cada detalle
            for (let i = 0; i < detallesCreados.length; i++) {
                const detalle = detallesCreados[i];
                const conceptosParaEsteDetalle = detallesConceptosAplicados[i] || [];
                
                if (conceptosParaEsteDetalle.length > 0) {
                    const conceptosAplicadosData = conceptosParaEsteDetalle.map(concepto => ({
                        ...concepto,
                        id_detalle: detalle.id_detalle
                    }));
                    
                    await ConceptoAplicado.bulkCreate(conceptosAplicadosData, { transaction: t });
                }
            }

            // 12. Actualizar las horas extras para marcarlas como pagadas
            if (horasExtrasParaActualizar.length > 0) {
                for (const horaExtra of horasExtrasParaActualizar) {
                    const idDetalleNominaAsignado = detallesCreados.find(
                        detalle => detalle.id_empleado === horaExtra.id_empleado
                    )?.id_detalle;

                    if (idDetalleNominaAsignado) {
                        await horaExtra.update({
                            id_detalle_nomina: idDetalleNominaAsignado,
                            estado: 'Pagada'
                        }, { transaction: t });
                    } else {
                        console.warn(`No se encontró id_detalle_nomina para el empleado ID ${horaExtra.id_empleado}`);
                    }
                }
            }

            return nominaCompleta;

        } catch (error) {
            await t.rollback();
            console.error("Error generando nómina:", error);
            throw error;
        }
    }

    async verificarNomina(idNomina) {
        const nomina = await this.models.Nomina.findByPk(idNomina);
        if (!nomina) throw new Error('Nómina no encontrada');
        if (nomina.estado !== 'Borrador') {
            throw new Error(`Solo se pueden verificar nóminas en estado Borrador. Estado actual: ${nomina.estado}`);
        }
        await nomina.update({ estado: 'Verificada' });
        return nomina;
    }

    // La lógica de aprobación ahora es crucial para aplicar los pagos de préstamos y horas extras
    async aprobarNomina(idNomina, usuarioAprobacion) {
        const nomina = await this.models.Nomina.findByPk(idNomina, {
            // Incluir detalles y pagos de préstamo asociados si la lógica de aplicación estuviera aquí
            // include: [{ model: this.models.DetalleNomina, as: 'detalles_nomina', include: [{ model: this.models.PagoPrestamo, as: 'pagos_prestamo_asociados' }] }]
        });
        if (!nomina) throw new Error('Nómina no encontrada');
        if (nomina.estado !== 'Verificada') {
            throw new Error(`Solo se pueden aprobar nóminas en estado Verificada. Estado actual: ${nomina.estado}`);
        }

        // NOTA IMPORTANTE: La lógica para actualizar préstamos y horas extras *YA SE MOVIÓ A generarNomina*.
        // La aprobación tradicionalmente es donde se "aplican" estos cambios al sistema,
        // pero dado que tuvimos que usar .create() y .update() individuales en generarNomina por la transacción,
        // *esos cambios ya se persistieron en la DB al finalizar generarNomina*.
        // Aquí solo estarías cambiando el estado de la nómina principal.
        // Si tu flujo REQUIERE que la aplicación de saldos y estados OCURRA al APROBAR,
        // necesitarías MOVER toda la lógica de "Aplicar Pagos de Préstamo" y "Actualizar Horas Extras"
        // de generarNomina a este método aprobarNomina. Esto implicaría:
        // 1. En generarNomina: Recolectar los datos de pagos de préstamo y horas extras pero NO crearlos/actualizarlos todavía.
        // 2. En aprobarNomina: Obtener la nómina, obtener los detalles de nómina, obtener los pagos de préstamo y horas extras asociados a esos detalles.
        // 3. En aprobarNomina: Ejecutar la lógica de creación/actualización de PagoPrestamo, actualización de Prestamo, y actualización de HoraExtra *dentro de la transacción de aprobarNomina*.

        // Mantenemos el código simple por ahora asumiendo que la persistencia ya ocurrió en generarNomina.
        // Solo actualizamos el estado de la nómina principal.
        const t = await this.models.sequelize.transaction();
        try {
             await nomina.update({
                 estado: 'Aprobada',
                 usuario_aprobacion: usuarioAprobacion,
                 fecha_aprobacion: new Date()
             }, { transaction: t });

             await t.commit();
             console.log(`Nómina ID ${idNomina} aprobada.`);
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
         await nomina.update({ estado: 'Pagada' });
           console.log(`Nómina ID ${idNomina} marcada como pagada.`);
         return nomina;
     }

    // Otros métodos...
}

module.exports = NominasService;