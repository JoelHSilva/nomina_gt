const { Sequelize } = require('sequelize');

// Configuración de la conexión a la base de datos MySQL
const sequelize = new Sequelize({
  database: 'nomina',
  username: 'root', // Cambiar según tu configuración
  password: '1234', // Cambiar según tu configuración
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  define: {
    timestamps: true, // Habilita createdAt y updatedAt automáticos
    underscored: true, // Usa snake_case en los nombres de columnas
    freezeTableName: true // Evita la pluralización automática de nombres de tablas
  },
  logging: false, // Desactiva los logs de SQL en producción
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

// Exportar tanto la instancia como la librería
module.exports = {
  sequelize,
  Sequelize
};