// models/index.js
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize'); // <-- Asegúrate de importar la librería Sequelize aquí

const models = {};

// Importar todos los modelos automáticamente
fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        // REQUIERE el archivo del modelo y EJECUTA la función que exporta
        // PASANDO BOTH sequelize Y Sequelize.DataTypes
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        models[model.name] = model;
    });

// Configurar las asociaciones
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize; // Exporta la librería Sequelize también

module.exports = models;