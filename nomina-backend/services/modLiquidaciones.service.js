// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\services\modLiquidaciones.service.js
const db = require('../models');
// Correcto: Acceso directo sin 'mod' para todos los modelos
const LiquidacionViatico = db.LiquidacionViatico;
const DetalleLiquidacion = db.DetalleLiquidacion;
const AnticipoViatico = db.AnticipoViatico;
const SolicitudViatico = db.SolicitudViatico;
const DetalleNomina = db.DetalleNomina;
const PeriodoPago = db.PeriodoPago; // Correcto: Acceso directo sin 'mod'

class LiquidacionesService {
    /**
     * Crea una nueva liquidación de viáticos.
     * @param {number} solicitudId - ID de la solicitud a liquidar.
     * @param {number} anticipoId - ID del anticipo asociado.
     * @param {Array<object>} gastos - Array de objetos con los detalles de los gastos.
     * @param {number} empleadoId - ID del empleado que realiza la liquidación.
     * @returns {Promise<object>} El objeto LiquidacionViatico creado.
     * @throws {Error} Si la solicitud/anticipo no se encuentra, no corresponden,
     * ya existe una liquidación o no hay período de nómina abierto.
     */
    async crearLiquidacion(solicitudId, anticipoId, gastos, empleadoId) {
        const transaction = await db.sequelize.transaction();

        try {
            // Verificar solicitud y anticipo
            const solicitud = await SolicitudViatico.findByPk(solicitudId, { transaction });
            const anticipo = await AnticipoViatico.findByPk(anticipoId, { transaction });

            if (!solicitud || !anticipo) {
                const error = new Error('Solicitud o anticipo no encontrado');
                error.statusCode = 404;
                throw error;
            }

            if (anticipo.id_solicitud !== solicitud.id_solicitud) {
                const error = new Error('El anticipo no corresponde a la solicitud');
                error.statusCode = 400;
                throw error;
            }

            // Verificar que no exista ya una liquidación para esta solicitud
            const liquidacionExistente = await LiquidacionViatico.findOne({
                where: { id_solicitud: solicitudId },
                transaction
            });

            if (liquidacionExistente) {
                const error = new Error('Ya existe una liquidación para esta solicitud');
                error.statusCode = 400;
                throw error;
            }

            // Calcular total gastado
            const totalGastado = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);

            // Calcular saldos
            const diferencia = totalGastado - anticipo.monto;
            const saldoFavorEmpresa = diferencia < 0 ? Math.abs(diferencia) : 0;
            const saldoFavorEmpleado = diferencia > 0 ? diferencia : 0;

            // Crear liquidación
            const liquidacion = await LiquidacionViatico.create({
                id_solicitud: solicitudId,
                id_anticipo: anticipoId,
                fecha_liquidacion: new Date(),
                monto_total_gastado: totalGastado,
                monto_anticipo: anticipo.monto,
                saldo_favor_empresa: saldoFavorEmpresa,
                saldo_favor_empleado: saldoFavorEmpleado,
                estado: 'Pendiente',
                creado_por: empleadoId
            }, { transaction });

            // Crear detalles de liquidación
            await DetalleLiquidacion.bulkCreate(
                gastos.map(gasto => ({
                    id_liquidacion: liquidacion.id_liquidacion,
                    id_tipo_viatico: gasto.id_tipo_viatico,
                    fecha_gasto: gasto.fecha_gasto,
                    descripcion: gasto.descripcion,
                    monto: gasto.monto,
                    numero_factura: gasto.numero_factura,
                    nombre_proveedor: gasto.nombre_proveedor,
                    nit_proveedor: gasto.nit_proveedor,
                    tiene_factura: gasto.tiene_factura,
                    imagen_comprobante: gasto.imagen_comprobante
                })),
                { transaction }
            );

            // Actualizar estado de la solicitud
            await solicitud.update({ estado: 'Liquidada' }, { transaction });

            await transaction.commit();
            return liquidacion;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Aprueba o rechaza una liquidación de viáticos.
     * @param {number} id - ID de la liquidación.
     * @param {boolean} aprobado - true para aprobar, false para rechazar.
     * @param {string} observaciones - Observaciones sobre la aprobación/rechazo.
     * @param {number} aprobadorId - ID del usuario que aprueba o rechaza.
     * @returns {Promise<object>} El objeto LiquidacionViatico actualizado.
     * @throws {Error} Si la liquidación no es encontrada o ya fue procesada.
     */
    async aprobarLiquidacion(id, aprobado, observaciones, aprobadorId) {
        const transaction = await db.sequelize.transaction();

        try {
            const liquidacion = await LiquidacionViatico.findByPk(id, {
                include: [
                    {
                        model: SolicitudViatico,
                        // Asumo que LiquidacionViatico tiene un belongsTo a SolicitudViatico con alias 'solicitud'
                        as: 'solicitud'
                    }
                ],
                transaction
            });

            if (!liquidacion) {
                const error = new Error('Liquidación no encontrada');
                error.statusCode = 404;
                throw error;
            }

            if (liquidacion.estado !== 'Pendiente') {
                const error = new Error('La liquidación ya fue procesada');
                error.statusCode = 400;
                throw error;
            }

            const nuevoEstado = aprobado ? 'Aprobada' : 'Rechazada';

            await liquidacion.update({
                estado: nuevoEstado,
                aprobado_por: aprobadorId,
                fecha_aprobacion: new Date(),
                observaciones
            }, { transaction });

            // Si fue aprobada y hay saldo a favor del empleado, vincular a nómina
            if (aprobado && liquidacion.saldo_favor_empleado > 0) {
                await this.vincularANomina(liquidacion, transaction);
            }

            await transaction.commit();
            return liquidacion;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Vincula un saldo a favor del empleado de una liquidación a la nómina.
     * @param {object} liquidacion - Objeto de la liquidación de viáticos.
     * @param {object} transaction - Transacción de Sequelize.
     * @throws {Error} Si no hay un período de nómina abierto.
     */
    async vincularANomina(liquidacion, transaction) {
        // Obtener el período de nómina actual
        const periodoActual = await PeriodoPago.findOne({ // Acceso directo sin 'mod'
            where: {
                estado: 'Abierto'
            },
            transaction
        });

        if (!periodoActual) {
            const error = new Error('No hay un período de nómina abierto');
            error.statusCode = 400;
            throw error;
        }

        // Obtener o crear detalle de nómina para el empleado
        const [detalleNomina] = await DetalleNomina.findOrCreate({ // Acceso directo sin 'mod'
            where: {
                id_periodo: periodoActual.id_periodo,
                // Si SolicitudViatico está incluido con alias 'solicitud' en liquidacion,
                // entonces liquidacion.solicitud.id_empleado
                id_empleado: liquidacion.solicitud.id_empleado // Asumo que solicitud está cargada
            },
            defaults: {
                id_nomina: null, // Se asignará cuando se genere la nómina
                salario_base: 0,
                dias_trabajados: 0,
                horas_extra: 0,
                monto_horas_extra: 0,
                bonificacion_incentivo: 0,
                otros_ingresos: 0,
                total_ingresos: 0,
                igss_laboral: 0,
                isr: 0,
                otros_descuentos: 0,
                total_descuentos: 0,
                liquido_recibir: 0
            },
            transaction
        });

        // Actualizar otros ingresos
        await detalleNomina.increment('otros_ingresos', {
            by: liquidacion.saldo_favor_empleado,
            transaction
        });

        // Actualizar total ingresos y líquido a recibir (usando literales de Sequelize para cálculos basados en campos)
        await detalleNomina.update({
            total_ingresos: db.sequelize.literal(`otros_ingresos + salario_base + monto_horas_extra + bonificacion_incentivo`),
            liquido_recibir: db.sequelize.literal(`total_ingresos - total_descuentos`)
        }, { transaction });

        // Vincular liquidación con nómina (asumo que LiquidacionViatico tiene un campo id_detalle_nomina)
        await liquidacion.update({
            id_detalle_nomina: detalleNomina.id_detalle, // Asumo que el PK de DetalleNomina es 'id_detalle'
            incluido_en_nomina: true
        }, { transaction });
    }

    /**
     * Obtiene una liquidación de viáticos por su ID.
     * @param {number} id - ID de la liquidación.
     * @returns {Promise<object>} El objeto LiquidacionViatico.
     * @throws {Error} Si la liquidación no es encontrada.
     */
    async obtenerLiquidacion(id) {
        const liquidacion = await LiquidacionViatico.findByPk(id, {
            include: [
                {
                    model: SolicitudViatico,
                    // Asumo que LiquidacionViatico tiene un belongsTo a SolicitudViatico con alias 'solicitud'
                    as: 'solicitud',
                    include: [
                        {
                            model: db.Empleado, // Acceso directo sin 'mod'
                            // Asumo que SolicitudViatico tiene un belongsTo a Empleado con alias 'empleado'
                            as: 'empleado'
                        }
                    ]
                },
                {
                    model: AnticipoViatico,
                    // Asumo que LiquidacionViatico tiene un belongsTo a AnticipoViatico con alias 'anticipo'
                    as: 'anticipo'
                },
                {
                    model: DetalleLiquidacion,
                    // Asumo que LiquidacionViatico tiene un hasMany a DetalleLiquidacion con alias 'detalles'
                    as: 'detalles',
                    include: [
                        {
                            model: db.TipoViatico, // Acceso directo sin 'mod'
                            // Asumo que DetalleLiquidacion tiene un belongsTo a TipoViatico con alias 'tipoViatico'
                            as: 'tipoViatico'
                        }
                    ]
                },
                {
                    model: DetalleNomina,
                    // Asumo que LiquidacionViatico tiene un belongsTo a DetalleNomina con alias 'detalleNomina'
                    as: 'detalleNomina'
                }
            ]
        });

        if (!liquidacion) {
            const error = new Error('Liquidación no encontrada');
            error.statusCode = 404;
            throw error;
        }

        return liquidacion;
    }

    /**
     * Lista liquidaciones de viáticos con filtros opcionales.
     * @param {object} filtros - Objeto con filtros (solicitudId, empleadoId, estado).
     * @returns {Promise<Array<object>>} Lista de LiquidacionViatico.
     */
    async listarLiquidaciones({ solicitudId, empleadoId, estado }) {
        const where = {};
        const include = [{
            model: SolicitudViatico,
            // Asumo que LiquidacionViatico tiene un belongsTo a SolicitudViatico con alias 'solicitud'
            as: 'solicitud',
            attributes: ['id_solicitud', 'id_empleado', 'destino'],
            include: [{
                model: db.Empleado, // Acceso directo sin 'mod'
                // Asumo que SolicitudViatico tiene un belongsTo a Empleado con alias 'empleado'
                as: 'empleado',
                attributes: ['id_empleado', 'nombre', 'apellido']
            }]
        }];

        if (solicitudId) where.id_solicitud = solicitudId;
        if (estado) where.estado = estado;
        // Si se filtra por empleadoId, el filtro debe aplicarse en la inclusión de SolicitudViatico
        if (empleadoId) include[0].where = { id_empleado: empleadoId };

        return await LiquidacionViatico.findAll({
            where,
            include,
            order: [['fecha_liquidacion', 'DESC']]
        });
    }
}

module.exports = new LiquidacionesService();