const { testConnection } = require('./config/database');
const settings = require('./config/settings');

console.log('Iniciando prueba de configuración...');
console.log(`Aplicación: ${settings.appName} v${settings.appVersion}`);
console.log(`Entorno: ${settings.env}`);
console.log(`Puerto: ${settings.port}`);

// Probar conexión a la base de datos
testConnection();