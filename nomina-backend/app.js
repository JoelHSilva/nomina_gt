// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./config/database'); // Importa la instancia de sequelize
const settings = require('./config/settings'); // Importa las configuraciones

// Importar todas las rutas
const anticiposViaticosRoutes = require('./routes/anticiposViaticos.routes');
const ausenciasRoutes = require('./routes/ausencias.routes');
const conceptosPagoRoutes = require('./routes/conceptosPago.routes');
const conceptosAplicadosRoutes = require('./routes/conceptosAplicados.routes');
const configuracionFiscalRoutes = require('./routes/configuracionFiscal.routes');
const departamentosRoutes = require('./routes/departamentos.routes');
const destinosViaticosRoutes = require('./routes/destinosViaticos.routes');
const detalleLiquidacionViaticosRoutes = require('./routes/detalleLiquidacionViaticos.routes');
const detalleNominaRoutes = require('./routes/detalleNomina.routes');
const detalleSolicitudViaticosRoutes = require('./routes/detalleSolicitudViaticos.routes');
const empleadosRoutes = require('./routes/empleados.routes');
const historialSalariosRoutes = require('./routes/historialSalarios.routes');
const horasExtrasRoutes = require('./routes/horasExtras.routes');
const liquidacionViaticosRoutes = require('./routes/liquidacionViaticos.routes');
const logsSistemaRoutes = require('./routes/logsSistema.routes');
const nominasRoutes = require('./routes/nominas.routes');
const pagosPrestamosRoutes = require('./routes/pagosPrestamos.routes');
const periodosPagoRoutes = require('./routes/periodosPago.routes');
const politicasViaticosPuestoRoutes = require('./routes/politicasViaticosPuesto.routes'); // Nombre ajustado según modelo
const prestamosRoutes = require('./routes/prestamos.routes');
const puestosRoutes = require('./routes/puestos.routes');
const solicitudesViaticosRoutes = require('./routes/solicitudesViaticos.routes');
const tarifasDestinoRoutes = require('./routes/tarifasDestino.routes');
const tiposViaticosRoutes = require('./routes/tiposViaticos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');

const app = express();

// Middlewares
app.use(cors()); // Permite solicitudes desde otros dominios
app.use(morgan('dev')); // Loguea las solicitudes HTTP en formato 'dev'
app.use(express.json()); // Parsea el body de las solicitudes con payload JSON
app.use(express.urlencoded({ extended: true })); // Parsea el body de las solicitudes con payload URL-encoded

// Configuración de rutas (montar cada router en su prefijo de API)
const apiPrefix = settings.api.prefix; // Obtiene el prefijo de API desde settings

app.use(`${apiPrefix}/anticipos-viaticos`, anticiposViaticosRoutes);
app.use(`${apiPrefix}/ausencias`, ausenciasRoutes);
app.use(`${apiPrefix}/conceptos-pago`, conceptosPagoRoutes); // Nombre ajustado
app.use(`${apiPrefix}/conceptos-aplicados`, conceptosAplicadosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/configuracion-fiscal`, configuracionFiscalRoutes); // Nombre ajustado
app.use(`${apiPrefix}/departamentos`, departamentosRoutes);
app.use(`${apiPrefix}/destinos-viaticos`, destinosViaticosRoutes);
app.use(`${apiPrefix}/detalle-liquidacion-viaticos`, detalleLiquidacionViaticosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/detalle-nomina`, detalleNominaRoutes); // Nombre ajustado
app.use(`${apiPrefix}/detalle-solicitud-viaticos`, detalleSolicitudViaticosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/empleados`, empleadosRoutes);
app.use(`${apiPrefix}/historial-salarios`, historialSalariosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/horas-extras`, horasExtrasRoutes);
app.use(`${apiPrefix}/liquidacion-viaticos`, liquidacionViaticosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/logs-sistema`, logsSistemaRoutes); // Nombre ajustado
app.use(`${apiPrefix}/nominas`, nominasRoutes);
app.use(`${apiPrefix}/pagos-prestamos`, pagosPrestamosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/periodos-pago`, periodosPagoRoutes); // Nombre ajustado
app.use(`${apiPrefix}/politicas-viaticos-puesto`, politicasViaticosPuestoRoutes); // Nombre ajustado
app.use(`${apiPrefix}/prestamos`, prestamosRoutes);
app.use(`${apiPrefix}/puestos`, puestosRoutes);
app.use(`${apiPrefix}/solicitudes-viaticos`, solicitudesViaticosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/tarifas-destino`, tarifasDestinoRoutes); // Nombre ajustado
app.use(`${apiPrefix}/tipos-viaticos`, tiposViaticosRoutes); // Nombre ajustado
app.use(`${apiPrefix}/usuarios`, usuariosRoutes);
app.use(`${apiPrefix}/vacaciones`, vacacionesRoutes);


// Manejador de errores centralizado (middleware al final)
app.use((err, req, res, next) => {
    console.error("Error no manejado:", err.stack); // Loguea el stack del error en el servidor
    // Envía una respuesta de error genérica al cliente
    res.status(500).json({
        error: 'Ocurrió un error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined // Solo envía detalles del error en desarrollo
    });
});


// Probar conexión a la base de datos (opcional aquí, ya se hace en server.js antes de sync)
// sequelize.authenticate()
//   .then(() => console.log('Conexión a la base de datos establecida'))
//   .catch(err => console.error('Error de conexión a la base de datos:', err));


module.exports = app;