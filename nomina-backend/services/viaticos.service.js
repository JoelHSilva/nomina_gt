// services/viaticos.service.js
const db = require('../models');

class ViaticosService {
  constructor() {
    this.models = db;
  }

  async crearSolicitud(datosSolicitud) {
    // Usa una transacción para crear la solicitud y sus detalles de forma atómica
    const t = await this.models.sequelize.transaction();
    try {
        const { id_empleado, detalles, ...restDatosSolicitud } = datosSolicitud; // Separa los detalles

        const empleado = await this.models.Empleado.findByPk(id_empleado, { transaction: t });
        if (!empleado) {
             await t.rollback();
             throw new Error('Empleado no encontrado');
        }

        if (!detalles || detalles.length === 0) {
             await t.rollback();
             throw new Error('Una solicitud de viáticos debe tener al menos un detalle.');
        }

        // Calcular el monto total solicitado a partir de los detalles
        const montoTotal = detalles.reduce((sum, detalle) => sum + (detalle.monto || 0), 0); // Suma solo si monto existe

        // Crear la solicitud principal
        const solicitud = await this.models.SolicitudViatico.create({
          ...restDatosSolicitud, // Resto de datos de la solicitud
          id_empleado: id_empleado,
          monto_solicitado: parseFloat(montoTotal.toFixed(2)), // Guarda el total calculado
          estado: 'Solicitada', // Estado inicial
          fecha_solicitud: new Date() // Usa la fecha actual como fecha de solicitud si no viene en datosSolicitud
        }, { transaction: t });

        // Preparar los datos para la creación masiva de detalles
        const detallesCrear = detalles.map(detalle => ({
          ...detalle, // Incluye los datos del detalle individual
          id_solicitud: solicitud.id_solicitud, // Asigna el ID de la solicitud creada
          activo: true // Asume activo por defecto
        }));

        // Crear todos los detalles de solicitud en masa
        await this.models.DetalleSolicitudViatico.bulkCreate(detallesCrear, { transaction: t });

        // Commit la transacción si todo sale bien
        await t.commit();

        // Opcional: Cargar la solicitud completa con detalles para devolverla
        const solicitudCompleta = await this.models.SolicitudViatico.findByPk(solicitud.id_solicitud, {
             include: [{ model: this.models.DetalleSolicitudViatico, as: 'detalles_solicitud' }]
         });

        return solicitudCompleta; // Devuelve la solicitud creada con sus detalles

    } catch (error) {
        // Rollback la transacción si algo falla
        await t.rollback();
        console.error("Error creando solicitud de viáticos:", error);
         // Manejo específico de errores de Sequelize si es necesario
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
             throw new Error(`Error de validación o clave foránea al crear solicitud: ${error.errors ? error.errors.map(e => e.message).join(', ') : error.message}`);
         }
        throw error; // Relanza el error
    }
  }

  async aprobarSolicitud(idSolicitud, datosAprobacion) {
    // No necesita transacción si solo actualiza un registro
    const solicitud = await this.models.SolicitudViatico.findByPk(idSolicitud);
    if (!solicitud) {
         throw new Error('Solicitud de Viático no encontrada');
    }

    if (solicitud.estado !== 'Solicitada') {
         throw new Error(`Solo se pueden aprobar solicitudes en estado Solicitada. Estado actual: ${solicitud.estado}`);
    }

    const { monto_aprobado, aprobado_por } = datosAprobacion;

    // Validar datos de aprobación si es necesario
    if (!aprobado_por) {
         throw new Error('Se requiere especificar quién aprueba la solicitud');
    }

    return await solicitud.update({
      estado: 'Aprobada',
      monto_aprobado: parseFloat((monto_aprobado || solicitud.monto_solicitado).toFixed(2)), // Usa monto_aprobado si viene, si no, usa el solicitado
      aprobado_por: aprobado_por,
      fecha_aprobacion: new Date() // Fecha de aprobación actual
    });
  }

  async registrarAnticipo(idSolicitud, datosAnticipo) {
    // No necesita transacción si solo crea un registro
    const solicitud = await this.models.SolicitudViatico.findByPk(idSolicitud);
    if (!solicitud) {
         throw new Error('Solicitud de Viático no encontrada');
    }

    // Puedes añadir validación para estado aquí si el anticipo solo se registra después de aprobar
    // if (solicitud.estado !== 'Aprobada') {
    //   throw new Error('La solicitud debe estar aprobada para registrar un anticipo');
    // }

    const { monto, metodo_pago, entregado_por, recibido_por, referencia_pago, observaciones } = datosAnticipo;

    // Validar datos del anticipo si es necesario
    if (!monto || monto <= 0 || !metodo_pago || !entregado_por || !recibido_por) {
         throw new Error('Datos de anticipo incompletos o inválidos');
    }


    return await this.models.AnticipoViatico.create({
      id_solicitud: idSolicitud,
      monto: parseFloat(monto.toFixed(2)),
      fecha_entrega: new Date(), // Fecha de entrega actual
      metodo_pago: metodo_pago,
      referencia_pago: referencia_pago,
      entregado_por: entregado_por,
      recibido_por: recibido_por,
      observaciones: observaciones,
      activo: true // Asume activo por defecto
    });
  }

  async liquidarViaticos(idSolicitud, datosLiquidacion) {
    // Usa una transacción para crear la liquidación y sus detalles de forma atómica
    const t = await this.models.sequelize.transaction();
    try {
        const { detalles, ...restDatosLiquidacion } = datosLiquidacion; // Separa los detalles

        const solicitud = await this.models.SolicitudViatico.findByPk(idSolicitud, {
             // Incluir anticipos asociados para calcular el monto total de anticipo
             include: [{ model: this.models.AnticipoViatico, as: 'anticipos' }]
         }, { transaction: t });

        if (!solicitud) {
             await t.rollback();
             throw new Error('Solicitud de Viático no encontrada');
        }

         // Puedes añadir validación para estado aquí si la liquidación solo se permite después de aprobar
         // if (solicitud.estado !== 'Aprobada' && solicitud.estado !== 'Liquidada') {
         //    throw new Error(`Solo se pueden liquidar solicitudes en estado Aprobada o Liquidada. Estado actual: ${solicitud.estado}`);
         // }

        if (!detalles || detalles.length === 0) {
             await t.rollback();
             throw new Error('Una liquidación de viáticos debe tener al menos un detalle de gasto.');
        }


        const montoAnticipo = solicitud.anticipos.reduce((sum, a) => sum + (a.monto || 0), 0); // Suma los montos de los anticipos asociados
        const montoTotalGastado = detalles.reduce((sum, d) => sum + (d.monto || 0), 0); // Suma los montos de los detalles de gasto proporcionados

        // Calcular saldos
        const saldoFavorEmpresa = parseFloat(Math.max(0, montoAnticipo - montoTotalGastado).toFixed(2));
        const saldoFavorEmpleado = parseFloat(Math.max(0, montoTotalGastado - montoAnticipo).toFixed(2));

        // Crear el registro principal de Liquidación de Viáticos
        const liquidacion = await this.models.LiquidacionViatico.create({
          ...restDatosLiquidacion, // Resto de datos de la liquidación
          id_solicitud: idSolicitud,
          fecha_liquidacion: new Date(), // Fecha de liquidación actual
          monto_total_gastado: parseFloat(montoTotalGastado.toFixed(2)),
          monto_anticipo: parseFloat(montoAnticipo.toFixed(2)), // Guarda el total de anticipos
          saldo_favor_empresa: saldoFavorEmpresa,
          saldo_favor_empleado: saldoFavorEmpleado,
          estado: restDatosLiquidacion.estado || 'Pendiente', // Permite especificar estado o usa Pendiente
          activo: true // Asume activo por defecto
        }, { transaction: t });

        // Preparar los datos para la creación masiva de detalles de liquidación
        const detallesCrear = detalles.map(detalle => ({
          ...detalle, // Incluye los datos del detalle individual
          id_liquidacion: liquidacion.id_liquidacion, // Asigna el ID de la liquidación creada
           activo: true // Asume activo por defecto
        }));

        // Crear todos los detalles de liquidación en masa
        await this.models.DetalleLiquidacionViatico.bulkCreate(detallesCrear, { transaction: t });

        // Actualizar el estado de la solicitud principal (opcional, tu código original lo hacía)
         await solicitud.update({ estado: 'Liquidada' }, { transaction: t });


        // Commit la transacción si todo sale bien
        await t.commit();

        // Opcional: Cargar la liquidación completa con detalles para devolverla
        const liquidacionCompleta = await this.models.LiquidacionViatico.findByPk(liquidacion.id_liquidacion, {
             include: [{ model: this.models.DetalleLiquidacionViatico, as: 'detalles_liquidacion' }]
         });

        return liquidacionCompleta; // Devuelve la liquidación creada con sus detalles

    } catch (error) {
         // Rollback la transacción si algo falla
         await t.rollback();
         console.error("Error liquidando viáticos:", error);
         // Manejo específico de errores de Sequelize si es necesario
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
              throw new Error(`Error de validación o clave foránea al liquidar viáticos: ${error.errors ? error.errors.map(e => e.message).join(', ') : error.message}`);
          }
         throw error; // Relanza el error
    }
  }

    // Otros métodos para la gestión de viáticos:
    // - obtenerAnticiposPorSolicitud(idSolicitud)
    // - obtenerLiquidacionPorSolicitud(idSolicitud)
    // - marcarLiquidacionComoIncluidaEnNomina(idLiquidacion, idDetalleNomina)
    // - anularSolicitud(idSolicitud)
    // - anularLiquidacion(idLiquidacion)
}

module.exports = ViaticosService;