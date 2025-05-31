// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\models\index.js

'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const process = require('process'); // Asegúrate de importar process
// Importa la instancia de sequelize y la clase Sequelize de tu archivo de configuración de base de datos
const { sequelize, Sequelize } = require('../config/database'); 

const models = {}; // Usamos 'models' para ser consistentes con tu código

// Carga todos los modelos y los adjunta al objeto 'models'
fs
  .readdirSync(__dirname)
  .filter(file => {
    // Asegura que solo se incluyan archivos .js que no sean el index.js ni archivos de prueba
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // Importa cada archivo de modelo y define el modelo en Sequelize
    // PASANDO BOTH sequelize Y Sequelize.DataTypes
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model; // Almacena el modelo en models usando su 'name' (ej. 'Usuario', 'SolicitudViatico')
    console.log(`DEBUG (index.js - Carga): Modelo cargado: ${model.name}`); // Debug
  });

// Debugging: Verificar qué modelos están en el objeto 'models' antes de asociar
console.log('DEBUG (index.js - Antes de Asociar): Modelos disponibles:', Object.keys(models)); // Debug

// Ejecuta las funciones 'associate' para cada modelo
// Esto debe hacerse DESPUÉS de que todos los modelos hayan sido definidos y cargados en 'models'
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    console.log(`DEBUG (index.js - Asociando): Ejecutando asociación para ${modelName}`); // Debug
    models[modelName].associate(models); // Pasa el objeto 'models' completo (que contiene todos los modelos) a 'associate'
  }
});

models.sequelize = sequelize; // Exporta la instancia de sequelize
models.Sequelize = Sequelize; // Exporta la clase Sequelize (la librería)

module.exports = models;

// --- INICIO: DEBUGGING DE ASOCIACIONES (AÑADIR ESTO AL FINAL DEL ARCHIVO) ---
// Este bloque verifica el estado de la asociación después de que todo el proceso ha terminado
if (models.SolicitudViatico && models.Usuario) {
    const isAssociated = models.SolicitudViatico.associations.hasOwnProperty('Aprobador');
    console.log(`DEBUG (index.js - POST-ASSOCIATE): SolicitudViatico está asociada con Aprobador (Usuario): ${isAssociated}`);
    
    if (isAssociated) {
        console.log(`DEBUG (index.js - POST-ASSOCIATE): Tipo de asociación 'Aprobador': ${models.SolicitudViatico.associations['Aprobador'].associationType}`);
        console.log(`DEBUG (index.js - POST-ASSOCIATE): Modelo destino de 'Aprobador': ${models.SolicitudViatico.associations['Aprobador'].target.name}`);
    }
} else {
    console.error('ERROR (index.js - POST-ASSOCIATE): SolicitudViatico o Usuario no están disponibles para verificar asociaciones.');
}
// --- FIN: DEBUGGING DE ASOCIACIONES ---