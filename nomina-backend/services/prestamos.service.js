const db = require('../models');

class PrestamosService {
  constructor() {
    this.models = db;
  }

  async crearPrestamo(datosPrestamo) {
    // Validar estado recibido
    const estadosValidos = ['Aprobado', 'En Curso', 'Pagado', 'Cancelado'];
    if (!datosPrestamo.estado || !estadosValidos.includes(datosPrestamo.estado)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    const t = await this.models.sequelize.transaction();
    try {
      const { id_empleado, monto_total, cantidad_cuotas, estado } = datosPrestamo;

      // Validaciones básicas
      const empleado = await this.models.Empleado.findByPk(id_empleado, { transaction: t });
      if (!empleado) {
        await t.rollback();
        throw new Error('Empleado no encontrado');
      }

      if (cantidad_cuotas <= 0) {
        await t.rollback();
        throw new Error('La cantidad de cuotas debe ser mayor a cero');
      }

      if (monto_total <= 0) {
        await t.rollback();
        throw new Error('El monto total debe ser mayor a cero');
      }

      const cuotaMensual = parseFloat((monto_total / cantidad_cuotas).toFixed(2));

      // Crear préstamo con el estado recibido (sin sobrescribir)
      const nuevoPrestamo = await this.models.Prestamo.create({
        ...datosPrestamo,
        saldo_pendiente: monto_total,
        cuota_mensual: cuotaMensual,
        cuotas_pagadas: 0,
        estado: estado, // <-- Usar el estado recibido
        activo: true
      }, { transaction: t });

      await t.commit();
      return nuevoPrestamo;

    } catch (error) {
      await t.rollback();
      console.error("Error creando préstamo:", error);
      throw error;
    }
  }

  // ... (resto de métodos permanecen igual)
}

module.exports = PrestamosService;