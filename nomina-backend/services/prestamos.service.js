const db = require('../models');

class PrestamosService {
  constructor() {
    this.models = db;
  }

  async crearPrestamo(datosPrestamo) {
    // Validar que se recibe un estado válido
    const estadosValidos = ['Aprobado', 'En Curso', 'Pagado', 'Cancelado'];
    if (!datosPrestamo.estado || !estadosValidos.includes(datosPrestamo.estado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    const t = await this.models.sequelize.transaction();
    try {
      const { id_empleado, monto_total, cantidad_cuotas, estado } = datosPrestamo;

      // Validación más completa del empleado
      const empleado = await this.models.Empleado.findByPk(id_empleado, { 
        transaction: t,
        attributes: ['id_empleado', 'activo'] // Solo traemos lo necesario
      });
      
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      
      if (!empleado.activo) {
        throw new Error('No se pueden asignar préstamos a empleados inactivos');
      }

      if (cantidad_cuotas <= 0 || !Number.isInteger(cantidad_cuotas)) {
        throw new Error('La cantidad de cuotas debe ser un entero mayor a cero');
      }

      if (monto_total <= 0) {
        throw new Error('El monto total debe ser mayor a cero');
      }

      const cuotaMensual = parseFloat((monto_total / cantidad_cuotas).toFixed(2));

      const nuevoPrestamo = await this.models.Prestamo.create({
        ...datosPrestamo,
        saldo_pendiente: monto_total,
        cuota_mensual: cuotaMensual,
        cuotas_pagadas: 0,
        estado: estado,
        activo: true
      }, { transaction: t });

      await t.commit();
      return nuevoPrestamo;

    } catch (error) {
      await t.rollback();
      console.error("Error creando préstamo:", error);
      throw error; // Re-lanzamos el error para manejarlo en el controlador
    }
  }

  async procesarPagoPrestamo(idPrestamo, montoPago, tipoPago = 'Manual', idDetalleNomina = null, transaction = null) {
    const options = transaction ? { transaction } : {};
    const t = transaction || await this.models.sequelize.transaction();

    try {
      // Validación del monto
      if (montoPago <= 0) {
        throw new Error('El monto del pago debe ser mayor a cero');
      }

      const prestamo = await this.models.Prestamo.findByPk(idPrestamo, {
        ...options,
        lock: true // Bloqueo para evitar condiciones de carrera
      });

      if (!prestamo) {
        throw new Error('Préstamo no encontrado');
      }

      if (!prestamo.activo) {
        throw new Error('No se pueden procesar pagos para préstamos inactivos');
      }

      if (prestamo.saldo_pendiente <= 0) {
        throw new Error('Este préstamo ya está pagado');
      }

      // Validar que el pago no exceda el saldo pendiente
      if (montoPago > prestamo.saldo_pendiente) {
        throw new Error(`El monto del pago (${montoPago}) excede el saldo pendiente (${prestamo.saldo_pendiente})`);
      }

      const pago = await this.models.PagoPrestamo.create({
        id_prestamo: idPrestamo,
        monto_pagado: montoPago,
        fecha_pago: new Date(),
        tipo_pago: tipoPago,
        id_detalle_nomina: idDetalleNomina,
        activo: true
      }, { transaction: t });

      const nuevoSaldo = parseFloat((prestamo.saldo_pendiente - montoPago).toFixed(2));
      
      // Calcular estado actualizado
      let nuevoEstado = prestamo.estado;
      if (nuevoSaldo <= 0) {
        nuevoEstado = 'Pagado';
      } else if (prestamo.estado === 'Aprobado') {
        nuevoEstado = 'En Curso';
      }

      await prestamo.update({
        saldo_pendiente: nuevoSaldo,
        cuotas_pagadas: prestamo.cuotas_pagadas + 1,
        estado: nuevoEstado
      }, { transaction: t });

      if (!transaction) await t.commit();

      return { 
        pago,
        prestamo: {
          id_prestamo: prestamo.id_prestamo,
          saldo_pendiente: nuevoSaldo,
          estado: nuevoEstado,
          cuotas_pagadas: prestamo.cuotas_pagadas + 1
        }
      };

    } catch (error) {
      if (!transaction) await t.rollback();
      console.error("Error procesando pago de préstamo:", error);
      throw error;
    }
  }

  async obtenerPrestamosPendientesEmpleado(idEmpleado, fechaFinPeriodo) {
    try {
      return await this.models.Prestamo.findAll({
        where: {
          id_empleado: idEmpleado,
          estado: ['Aprobado', 'En Curso'],
          fecha_inicio: {
            [this.models.Sequelize.Op.lte]: fechaFinPeriodo
          },
          saldo_pendiente: {
            [this.models.Sequelize.Op.gt]: 0
          },
          activo: true
        },
        attributes: [
          'id_prestamo',
          'monto_total',
          'saldo_pendiente',
          'cuota_mensual',
          'cantidad_cuotas',
          'cuotas_pagadas',
          'fecha_inicio'
        ],
        order: [['fecha_inicio', 'ASC']]
      });
    } catch (error) {
      console.error("Error obteniendo préstamos pendientes:", error);
      throw error;
    }
  }

  // Nuevo método para obtener un préstamo por ID
  async obtenerPrestamoPorId(idPrestamo) {
    try {
      return await this.models.Prestamo.findByPk(idPrestamo, {
        include: [
          {
            model: this.models.Empleado,
            as: 'empleado',
            attributes: ['id_empleado', 'nombre', 'apellido']
          }
        ]
      });
    } catch (error) {
      console.error("Error obteniendo préstamo:", error);
      throw error;
    }
  }
}

module.exports = PrestamosService;