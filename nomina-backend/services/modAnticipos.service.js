// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\services\modAnticipos.service.js
const db = require('../models');
const AnticipoViatico = db.AnticipoViatico; // Correcto: Acceso directo sin 'mod'
const SolicitudViatico = db.SolicitudViatico; // Correcto: Acceso directo sin 'mod'

class AnticiposService {
    /**
     * Registra un nuevo anticipo para una solicitud de viáticos.
     * @param {number} solicitudId - ID de la solicitud de viáticos.
     * @param {number} monto - Monto del anticipo.
     * @param {string} metodoPago - Método de pago del anticipo.
     * @param {string} referencia - Referencia del pago (ej. número de cheque, transacción).
     * @param {number} registradorId - ID del usuario que registra el anticipo.
     * @returns {Promise<object>} El objeto AnticipoViatico creado.
     * @throws {Error} Si la solicitud no es encontrada, no está aprobada, ya tiene un anticipo,
     * o el monto excede el aprobado.
     */
    async registrarAnticipo(solicitudId, monto, metodoPago, referencia, registradorId) {
        const transaction = await db.sequelize.transaction();

        try {
            const solicitud = await SolicitudViatico.findByPk(solicitudId, { transaction });

            if (!solicitud) {
                const error = new Error('Solicitud no encontrada');
                error.statusCode = 404;
                throw error;
            }

            if (solicitud.estado !== 'Aprobada') {
                const error = new Error('Solo se pueden registrar anticipos para solicitudes aprobadas');
                error.statusCode = 400;
                throw error;
            }

            // Verificar si ya existe un anticipo para esta solicitud
            const anticipoExistente = await AnticipoViatico.findOne({
                where: { id_solicitud: solicitudId },
                transaction
            });

            if (anticipoExistente) {
                const error = new Error('Ya existe un anticipo registrado para esta solicitud');
                error.statusCode = 400;
                throw error;
            }

            // Verificar que el monto no exceda el aprobado
            if (monto > solicitud.monto_aprobado) {
                const error = new Error('El monto del anticipo no puede exceder el monto aprobado');
                error.statusCode = 400;
                throw error;
            }

            // Acceso directo a db.Empleado
            const empleado = await db.Empleado.findByPk(solicitud.id_empleado, { transaction });

            const anticipo = await AnticipoViatico.create({
                id_solicitud: solicitudId,
                monto,
                metodo_pago: metodoPago,
                referencia_pago: referencia,
                fecha_entrega: new Date(),
                entregado_por: registradorId,
                recibido_por: `${empleado.nombre} ${empleado.apellido}`,
                creado_por: registradorId
            }, { transaction });

            // Actualizar estado de la solicitud
            await solicitud.update({ estado: 'En proceso' }, { transaction });

            await transaction.commit();
            return anticipo;
        } catch (error) {
            await transaction.rollback();
            // Agregar código de estado al error para manejo consistente
            if (error.message.includes('no encontrada')) {
                error.statusCode = 404;
            } else if (error.message.includes('no puede exceder') ||
                       error.message.includes('Ya existe') ||
                       error.message.includes('solicitudes aprobadas')) {
                error.statusCode = 400;
            }
            throw error;
        }
    }

    /**
     * Lista anticipos de viáticos con filtros opcionales.
     * @param {object} filtros - Objeto con filtros (solicitudId, empleadoId, liquidado).
     * @returns {Promise<Array<object>>} Lista de AnticipoViatico.
     */
    async listarAnticipos({ solicitudId, empleadoId, liquidado }) {
        const where = {};
        const include = [{
            model: SolicitudViatico,
            // Asumo que AnticipoViatico tiene un belongsTo a SolicitudViatico con alias 'solicitud'
            as: 'solicitud',
            attributes: ['id_solicitud', 'id_empleado', 'destino', 'fecha_inicio_viaje', 'fecha_fin_viaje'],
            include: [{
                model: db.Empleado, // Acceso directo sin 'mod'
                // Asumo que SolicitudViatico tiene un belongsTo a Empleado con alias 'empleado'
                as: 'empleado',
                attributes: ['id_empleado', 'nombre', 'apellido']
            }]
        }];

        if (solicitudId) where.id_solicitud = solicitudId;
        if (empleadoId) include[0].where = { id_empleado: empleadoId };
        if (liquidado !== undefined) {
            // Asumo que SolicitudViatico tiene un hasOne/hasMany a LiquidacionViatico con alias 'liquidacion'
            include[0].include.push({
                model: db.LiquidacionViatico, // Acceso directo sin 'mod'
                as: 'liquidacion',
                required: liquidado, // true para incluir solo si tienen liquidación, false para incluir todas
                attributes: [] // No necesitamos atributos de LiquidacionViatico si solo filtramos
            });
        }

        return await AnticipoViatico.findAll({
            where,
            include,
            order: [['fecha_entrega', 'DESC']]
        });
    }

    /**
     * Obtiene un anticipo de viáticos por su ID.
     * @param {number} id - ID del anticipo.
     * @returns {Promise<object>} El objeto AnticipoViatico.
     * @throws {Error} Si el anticipo no es encontrado.
     */
    async obtenerAnticipo(id) {
        const anticipo = await AnticipoViatico.findByPk(id, {
            include: [{
                model: SolicitudViatico,
                // Asumo que AnticipoViatico tiene un belongsTo a SolicitudViatico con alias 'solicitud'
                as: 'solicitud',
                include: [
                    {
                        model: db.Empleado, // Acceso directo sin 'mod'
                        // Asumo que SolicitudViatico tiene un belongsTo a Empleado con alias 'empleado'
                        as: 'empleado',
                        attributes: ['id_empleado', 'nombre', 'apellido']
                    },
                    {
                        model: db.LiquidacionViatico, // Acceso directo sin 'mod'
                        // Asumo que SolicitudViatico tiene un hasOne/hasMany a LiquidacionViatico con alias 'liquidacion'
                        as: 'liquidacion'
                    }
                ]
            }]
        });

        if (!anticipo) {
            const error = new Error('Anticipo no encontrado');
            error.statusCode = 404;
            throw error;
        }

        return anticipo;
    }
}

module.exports = new AnticiposService();