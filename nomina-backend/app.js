const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./config/database');
const settings = require('./config/settings');

// Importar rutas
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
const politicasViaticosPuestoRoutes = require('./routes/politicasViaticosPuesto.routes');
const prestamosRoutes = require('./routes/prestamos.routes');
const puestosRoutes = require('./routes/puestos.routes');
const solicitudesViaticosRoutes = require('./routes/solicitudesViaticos.routes');
const tarifasDestinoRoutes = require('./routes/tarifasDestino.routes');
const tiposViaticosRoutes = require('./routes/tiposViaticos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');
const liquidacionesRoutes = require('./routes/liquidaciones.routes');
const liquidacionesDetalleRoutes = require('./routes/liquidacionesDetalle.routes');
const modViaticosRoutes = require('./routes/modViaticos.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prefijo global de API
const apiPrefix = settings.api.prefix;

// Montar rutas con prefijo
app.use(`${apiPrefix}/anticipos-viaticos`, anticiposViaticosRoutes);
app.use(`${apiPrefix}/ausencias`, ausenciasRoutes);
app.use(`${apiPrefix}/conceptos-pago`, conceptosPagoRoutes);
app.use(`${apiPrefix}/conceptos-aplicados`, conceptosAplicadosRoutes);
app.use(`${apiPrefix}/configuracion-fiscal`, configuracionFiscalRoutes);
app.use(`${apiPrefix}/departamentos`, departamentosRoutes);
app.use(`${apiPrefix}/destinos-viaticos`, destinosViaticosRoutes);
app.use(`${apiPrefix}/detalle-liquidacion-viaticos`, detalleLiquidacionViaticosRoutes);
app.use(`${apiPrefix}/detalle-nomina`, detalleNominaRoutes);
app.use(`${apiPrefix}/detalle-solicitud-viaticos`, detalleSolicitudViaticosRoutes);
app.use(`${apiPrefix}/empleados`, empleadosRoutes);
app.use(`${apiPrefix}/historial-salarios`, historialSalariosRoutes);
app.use(`${apiPrefix}/horas-extras`, horasExtrasRoutes);
app.use(`${apiPrefix}/liquidacion-viaticos`, liquidacionViaticosRoutes);
app.use(`${apiPrefix}/logs-sistema`, logsSistemaRoutes);
app.use(`${apiPrefix}/nominas`, nominasRoutes);
app.use(`${apiPrefix}/pagos-prestamos`, pagosPrestamosRoutes);
app.use(`${apiPrefix}/periodos-pago`, periodosPagoRoutes);
app.use(`${apiPrefix}/politicas-viaticos-puesto`, politicasViaticosPuestoRoutes);
app.use(`${apiPrefix}/prestamos`, prestamosRoutes);
app.use(`${apiPrefix}/puestos`, puestosRoutes);
app.use(`${apiPrefix}/solicitudes-viaticos`, solicitudesViaticosRoutes);
app.use(`${apiPrefix}/tarifas-destino`, tarifasDestinoRoutes);
app.use(`${apiPrefix}/tipos-viaticos`, tiposViaticosRoutes);
app.use(`${apiPrefix}/usuarios`, usuariosRoutes);
app.use(`${apiPrefix}/vacaciones`, vacacionesRoutes);
app.use(`${apiPrefix}/liquidaciones`, liquidacionesRoutes);
app.use(`${apiPrefix}/liquidaciones-detalle`, liquidacionesDetalleRoutes);
app.use(`${apiPrefix}/viaticos`, modViaticosRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
    console.error("Error no manejado:", err.stack);
    res.status(500).json({
        error: 'Ocurrió un error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;