// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\services\modViaticos.service.js

const db = require('../models');

console.log('DEBUG (modViaticos.service.js - Modelos en db):', Object.keys(db));

class ViaticosService {
    constructor(db) {
        console.log('DEBUG (ViaticosService - Constructor): db object recibido en constructor:', Object.keys(db));
        
        // ¡ACTUALIZA ESTOS NOMBRES CON LA SALIDA EXACTA DEL CONSOLE.LOG DEL PASO 1 EN LA RESPUESTA ANTERIOR!
        this.SolicitudViatico = db.SolicitudViatico;
        this.DetalleSolicitudViatico = db.DetalleSolicitudViatico; 
        this.TipoViatico = db.TipoViatico; 
        this.PoliticaViatico = db.PoliticaViatico; 
        this.Empleado = db.Empleado; 
        this.sequelize = db.sequelize;
        this.AnticipoViatico = db.AnticipoViatico; 
        this.LiquidacionViatico = db.LiquidacionViatico; 
        this.DetalleLiquidacionViatico = db.DetalleLiquidacionViatico; 
        this.Puesto = db.Puesto; 
        this.Usuario = db.Usuario; // Asegúrate de que el modelo Usuario esté cargado

        // DEBUG: Confirmación de que los modelos se cargaron correctamente
        console.log('DEBUG (ViaticosService - Constructor): this.SolicitudViatico:', this.SolicitudViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.DetalleSolicitudViatico:', this.DetalleSolicitudViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.TipoViatico:', this.TipoViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.PoliticaViatico:', this.PoliticaViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.Empleado:', this.Empleado ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.AnticipoViatico:', this.AnticipoViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.LiquidacionViatico:', this.LiquidacionViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.DetalleLiquidacionViatico:', this.DetalleLiquidacionViatico ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.Puesto:', this.Puesto ? 'OK' : 'UNDEFINED');
        console.log('DEBUG (ViaticosService - Constructor): this.Usuario:', this.Usuario ? 'OK' : 'UNDEFINED');
    }

    async calcularMontosPermitidos(idPuesto, detalles) {
        console.log('DEBUG (calcularMontosPermitidos): Invocando calcularMontosPermitidos');
        const montosAprobados = {};
        let totalSolicitado = 0;
        let totalAprobado = 0;

        console.log('DEBUG (calcularMontosPermitidos): Llamando a this.PoliticaViatico.findAll');
        try {
            const politicas = await this.PoliticaViatico.findAll({
                where: { id_puesto: idPuesto },
                include: [{
                    model: this.TipoViatico, // Asumo que la relación en PoliticaViatico es con TipoViatico
                    as: 'tipo_viatico' // **CRÍTICO:** Asegúrate de que este alias sea el definido en PoliticaViatico.associate
                }]
            });
            console.log('DEBUG (calcularMontosPermitidos): Politicas encontradas:', politicas.length);
            
            if (!politicas || politicas.length === 0) { 
                throw new Error('No se pudieron cargar las políticas de viáticos o no existen para este puesto.');
            }
            
            for (const detalle of detalles) {
                const politica = politicas.find(p => p.id_tipo_viatico === detalle.id_tipo_viatico);

                if (!politica) {
                    console.warn(`WARNING (calcularMontosPermitidos): No existe política de viáticos configurada para el tipo de viático ${detalle.id_tipo_viatico}`);
                    throw new Error(`No existe política de viáticos configurada para el tipo de viático ${detalle.id_tipo_viatico}`);
                }

                const montoMaximo = politica.monto_maximo_diario; 
                const montoAprobadoDetalle = Math.min(parseFloat(detalle.monto), parseFloat(montoMaximo)); 

                montosAprobados[detalle.id_tipo_viatico] = montoAprobadoDetalle;
                totalSolicitado += parseFloat(detalle.monto); 
                totalAprobado += parseFloat(montoAprobadoDetalle); 
            }

            console.log('DEBUG (calcularMontosPermitidos): Montos calculados. Total solicitado:', totalSolicitado, 'Total aprobado:', totalAprobado);
            return {
                montosAprobados,
                totalSolicitado,
                totalAprobado
            };

        } catch (error) {
            console.error('ERROR (calcularMontosPermitidos): Error al obtener políticas:', error.message, error.stack);
            throw error;
        }
    }

    async crearSolicitud(solicitudData, usuarioId) {
        console.log('DEBUG (crearSolicitud): Iniciando creación de solicitud para empleadoId:', solicitudData.id_empleado);
        const transaction = await this.sequelize.transaction();

        try {
            if (new Date(solicitudData.fecha_fin_viaje) < new Date(solicitudData.fecha_inicio_viaje)) {
                throw new Error('La fecha de fin debe ser posterior a la de inicio');
            }

            console.log('DEBUG (crearSolicitud): Buscando empleado por PK:', solicitudData.id_empleado);
            const empleado = await this.Empleado.findByPk(solicitudData.id_empleado, {
                include: [{ model: this.Puesto, as: 'puesto' }] 
            });

            if (!empleado) {
                console.warn('WARNING (crearSolicitud): Empleado no encontrado:', solicitudData.id_empleado);
                throw new Error('Empleado no encontrado');
            }
            console.log('DEBUG (crearSolicitud): Empleado encontrado. Puesto ID:', empleado.puesto.id_puesto); 

            const montosPermitidos = await this.calcularMontosPermitidos(
                empleado.puesto.id_puesto, 
                solicitudData.detalles
            );
            console.log('DEBUG (crearSolicitud): Montos permitidos calculados:', montosPermitidos);

            console.log('DEBUG (crearSolicitud): Creando nueva solicitud en DB.');
            const solicitud = await this.SolicitudViatico.create({
                id_empleado: solicitudData.id_empleado,
                fecha_inicio_viaje: solicitudData.fecha_inicio_viaje,
                fecha_fin_viaje: solicitudData.fecha_fin_viaje,
                destino: solicitudData.destino,
                motivo: solicitudData.motivo,
                monto_solicitado: montosPermitidos.totalSolicitado,
                monto_aprobado: null, 
                estado: 'Solicitada',
                fecha_creacion: new Date()
            }, { transaction });
            console.log('DEBUG (crearSolicitud): Solicitud creada con ID:', solicitud.id_solicitud);

            console.log('DEBUG (crearSolicitud): Creando detalles de la solicitud.');
            const detallesCrear = solicitudData.detalles.map(detalle => ({
                id_solicitud: solicitud.id_solicitud,
                id_tipo_viatico: detalle.id_tipo_viatico,
                descripcion: detalle.descripcion,
                monto: detalle.monto,
                fecha_creacion: new Date() 
            }));

            const detalles = await this.DetalleSolicitudViatico.bulkCreate(detallesCrear, { transaction });
            console.log('DEBUG (crearSolicitud): Detalles creados. Cantidad:', detalles.length);

            await transaction.commit();
            console.log('DEBUG (crearSolicitud): Transacción confirmada.');

            return {
                ...solicitud.toJSON(),
                detalles
            };
        } catch (error) {
            await transaction.rollback();
            console.error('ERROR (crearSolicitud): Transacción revertida. Error:', error.message, error.stack);
            throw error;
        }
    }

    async listarSolicitudes({ estado, empleadoId }) {
        console.log('DEBUG (listarSolicitudes): Invocando listarSolicitudes con filtros:', { estado, empleadoId });
        const where = {};
        if (estado) where.estado = estado;
        if (empleadoId) where.id_empleado = empleadoId; 

        console.log('DEBUG (listarSolicitudes): Valor de this.SolicitudViatico ANTES de findAll:', this.SolicitudViatico ? typeof this.SolicitudViatico : 'undefined');
        if (this.SolicitudViatico === undefined) {
             console.error('DEBUG (listarSolicitudes): ¡CRÍTICO! this.SolicitudViatico ES UNDEFINED AQUÍ.');
        }

        try {
            const solicitudes = await this.SolicitudViatico.findAll({
                where,
                include: [
                    {
                        model: this.Empleado,
                        as: 'empleado', 
                        attributes: ['id_empleado', 'nombre', 'apellido', 'codigo_empleado']
                    },
                    {
                        model: this.Usuario, 
                        as: 'Aprobador', 
                        attributes: ['id_usuario', 'nombre_usuario'] 
                    },
                    {
                        model: this.DetalleSolicitudViatico,
                        as: 'detalles_solicitud', // <-- ¡CORREGIDO!
                        include: [{
                            model: this.TipoViatico,
                            as: 'tipo_viatico', 
                            attributes: ['id_tipo_viatico', 'nombre']
                        }]
                    },
                    {
                        model: this.AnticipoViatico,
                        as: 'anticipo', 
                        attributes: ['id_anticipo', 'monto', 'fecha_entrega', 'metodo_pago']
                    },
                    {
                        model: this.LiquidacionViatico,
                        as: 'liquidacion', 
                        attributes: ['id_liquidacion', 'monto_total_gastado', 'saldo_favor_empresa', 'saldo_favor_empleado', 'estado'],
                        include: [{
                            model: this.DetalleLiquidacionViatico, 
                            as: 'detalles_liquidacion', // Este alias es para LiquidacionViatico a DetalleLiquidacionViatico, asumo que es correcto aquí.
                            include: [{
                                model: this.TipoViatico,
                                as: 'tipo_viatico', 
                                attributes: ['id_tipo_viatico', 'nombre']
                            }]
                        }]
                    }
                ],
                order: [['fecha_solicitud', 'DESC']]
            });
            console.log('DEBUG (listarSolicitudes): Solicitudes encontradas:', solicitudes.length);
            return solicitudes;
        } catch (error) {
            console.error('ERROR (listarSolicitudes): Error al realizar findAll:', error.message, error.stack);
            throw error;
        }
    }

    async obtenerSolicitud(id) {
        console.log('DEBUG (obtenerSolicitud): Buscando solicitud con ID:', id);
        try {
            const solicitud = await this.SolicitudViatico.findByPk(id, {
                include: [
                    {
                        model: this.Empleado,
                        as: 'empleado', 
                        attributes: ['id_empleado', 'nombre', 'apellido', 'codigo_empleado']
                    },
                     {
                        model: this.Usuario, 
                        as: 'Aprobador', 
                        attributes: ['id_usuario', 'nombre_usuario'] 
                    },
                    {
                        model: this.DetalleSolicitudViatico, 
                        as: 'detalles_solicitud', // <-- ¡CORREGIDO!
                        include: [{
                            model: this.TipoViatico,
                            as: 'tipo_viatico', 
                            attributes: ['id_tipo_viatico', 'nombre']
                        }]
                    },
                    {
                        model: this.AnticipoViatico,
                        as: 'anticipo', 
                    },
                    {
                        model: this.LiquidacionViatico,
                        as: 'liquidacion', 
                        include: [{
                            model: this.DetalleLiquidacionViatico, 
                            as: 'detalles', // Este alias es para LiquidacionViatico a DetalleLiquidacionViatico, asumo que es correcto aquí.
                            include: [{
                                model: this.TipoViatico,
                                as: 'tipo_viatico', 
                                attributes: ['id_tipo_viatico', 'nombre']
                            }]
                        }]
                    }
                ]
            });

            if (!solicitud) {
                console.warn('WARNING (obtenerSolicitud): Solicitud no encontrada con ID:', id);
                throw new Error('Solicitud no encontrada');
            }
            console.log('DEBUG (obtenerSolicitud): Solicitud encontrada:', solicitud.id_solicitud);
            return solicitud;
        } catch (error) {
            console.error('ERROR (obtenerSolicitud): Error al obtener solicitud:', error.message, error.stack);
            throw error;
        }
    }

    async aprobarSolicitud(id, aprobado, montoAprobado, observaciones, aprobadorId) {
        console.log('DEBUG (aprobarSolicitud): Aprobando/rechazando solicitud ID:', id, 'Aprobado:', aprobado);
        const transaction = await this.sequelize.transaction();

        try {
            console.log('DEBUG (aprobarSolicitud): Buscando solicitud por PK para aprobación:', id);
            const solicitud = await this.SolicitudViatico.findByPk(id, { transaction });

            if (!solicitud) {
                console.warn('WARNING (aprobarSolicitud): Solicitud no encontrada para aprobación con ID:', id);
                throw new Error('Solicitud no encontrada');
            }

            if (solicitud.estado !== 'Solicitada') {
                console.warn('WARNING (aprobarSolicitud): La solicitud ya fue procesada. Estado actual:', solicitud.estado);
                throw new Error('La solicitud ya fue procesada');
            }

            const nuevoEstado = aprobado ? 'Aprobada' : 'Rechazada';
            console.log('DEBUG (aprobarSolicitud): Actualizando estado a:', nuevoEstado);

            await solicitud.update({
                estado: nuevoEstado,
                monto_aprobado: aprobado ? montoAprobado : null, 
                aprobado_por: aprobadorId,
                fecha_aprobacion: new Date(),
                observaciones
            }, { transaction });

            await transaction.commit();
            console.log('DEBUG (aprobarSolicitud): Solicitud actualizada. Transacción confirmada.');
            return solicitud;
        } catch (error) {
            await transaction.rollback();
            console.error('ERROR (aprobarSolicitud): Transacción revertida. Error:', error.message, error.stack);
            throw error;
        }
    }
}

console.log('DEBUG (modViaticos.service.js - Global): Creando y exportando instancia de ViaticosService.');
module.exports = new ViaticosService(db);