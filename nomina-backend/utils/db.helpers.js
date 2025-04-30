const { sequelize } = require('../config/database');

module.exports = {
  async transaction(callback) {
    const t = await sequelize.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async bulkUpsert(model, data, options = {}) {
    const t = options.transaction || await sequelize.transaction();
    try {
      const result = await Promise.all(
        data.map(item => model.upsert(item, { transaction: t }))
      );
      if (!options.transaction) await t.commit();
      return result;
    } catch (error) {
      if (!options.transaction) await t.rollback();
      throw error;
    }
  },

  parseWhere(querystring) {
    if (!querystring) return {};
    const where = {};
    const operators = {
      'eq': Sequelize.Op.eq,
      'ne': Sequelize.Op.ne,
      'gt': Sequelize.Op.gt,
      // Agregar más operadores según necesidad
    };

    for (const [key, value] of Object.entries(querystring)) {
      if (key.includes(':')) {
        const [field, op] = key.split(':');
        where[field] = { [operators[op]]: value };
      } else {
        where[key] = value;
      }
    }

    return where;
  }
};