const { Empleado } = require('../models');

module.exports = {
  validarDPI(dpi) {
    if (!/^\d{13}$/.test(dpi)) {
      throw new Error('El DPI debe tener 13 dígitos');
    }
    return true;
  },

  validarNIT(nit) {
    if (!/^\d{8}-\d$/.test(nit)) {
      throw new Error('El NIT debe tener formato 12345678-9');
    }
    return true;
  },

  async validarCodigoEmpleadoUnico(codigo, idExcluir = null) {
    const where = { codigo_empleado: codigo };
    if (idExcluir) where.id_empleado = { [sequelize.Op.ne]: idExcluir };

    const existente = await Empleado.findOne({ where });
    if (existente) {
      throw new Error('El código de empleado ya está en uso');
    }
    return true;
  },

  validarSalario(salario) {
    if (salario < 0) {
      throw new Error('El salario no puede ser negativo');
    }
    return true;
  },

  validarFechas(fechaInicio, fechaFin) {
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha fin');
    }
    return true;
  }
};