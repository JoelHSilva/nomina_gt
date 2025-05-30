// server.js
const app = require('./app'); // Importa la aplicación Express configurada
const { sequelize } = require('./config/database'); // Importa la instancia de sequelize
const settings = require('./config/settings'); // Importa las configuraciones

// Sincronizar modelos con la base de datos
// Usar force: false para no eliminar datos existentes
// Usar alter: false para no modificar la estructura de las tablas
sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');

    // Iniciar servidor
    // Usa el puerto y URL base de settings
    app.listen(settings.port, () => {
      console.log(`Servidor de nómina corriendo en ${settings.baseUrl}`);
    });
  })
  .catch(err => {
    // Maneja errores durante la sincronización (ej: problemas con FKs, columnas, etc.)
    console.error('Error al sincronizar modelos:', err);
    // Termina el proceso si la sincronización falla, ya que la app no podría funcionar sin BD.
    process.exit(1);
  });

// Manejar cierre adecuado del servidor y la conexión a la BD
// Escucha la señal SIGINT (enviada típicamente con Ctrl+C)
process.on('SIGINT', () => {
  console.log('Apagando servidor...');
  // Cierra la conexión de Sequelize de forma segura
  sequelize.close()
    .then(() => {
      console.log('Conexión a la base de datos cerrada');
      process.exit(0); // Termina el proceso con éxito
    })
    .catch(err => {
      console.error('Error al cerrar la conexión de la base de datos:', err);
      process.exit(1); // Termina con error
    });
});