const express = require('express');
const router = express.Router();
const {
    crearSolicitud,
    listarSolicitudes,
    obtenerSolicitud,
    aprobarSolicitud
} = require('../controllers/modViaticos.controller');
const {
    registrarAnticipo,
    listarAnticipos,
    obtenerAnticipo
} = require('../controllers/modAnticipos.controller');
const {
    crearLiquidacion,
    aprobarLiquidacion,
    obtenerLiquidacion,
    listarLiquidaciones
} = require('../controllers/modLiquidaciones.controller');
const {
    validarSolicitudViatico,
    validarAprobacionSolicitud,
    validarAnticipo,
    validarLiquidacion,
    validarAprobacionLiquidacion
} = require('../validators/modViaticos.validator');
const {
    getAllTiposViaticos,
    getTipoViaticoById,
    createTipoViatico,
    updateTipoViatico,
    deleteTipoViatico
} = require('../controllers/tiposViaticos.controller');
// --------------------------------------------
// Rutas para Solicitudes de Viáticos
// --------------------------------------------
router.post('/solicitudes', 
    validarSolicitudViatico,
    crearSolicitud
);

router.get('/solicitudes', 
    listarSolicitudes
);

router.get('/solicitudes/:id', 
    obtenerSolicitud
);

router.put('/solicitudes/:id/aprobar', 
    validarAprobacionSolicitud,
    aprobarSolicitud
);

// --------------------------------------------
// Rutas para Anticipos de Viáticos
// --------------------------------------------
router.post('/anticipos', 
    validarAnticipo,
    registrarAnticipo
);

router.get('/anticipos', 
    listarAnticipos
);

router.get('/anticipos/:id', 
    obtenerAnticipo
);

// --------------------------------------------
// Rutas para Liquidación de Viáticos
// --------------------------------------------
router.post('/liquidaciones', 
    validarLiquidacion,
    crearLiquidacion
);

router.put('/liquidaciones/:id/aprobar', 
    validarAprobacionLiquidacion,
    aprobarLiquidacion
);

router.get('/liquidaciones/:id', 
    obtenerLiquidacion
);

router.get('/liquidaciones', 
    listarLiquidaciones
);
router.get('/tipos-viaticos',
    getAllTiposViaticos // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!**
);
router.get('/tipos-viaticos',
    getTipoViaticoById // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!**
);
router.get('/tipos-viaticos',
    createTipoViatico // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!**
);
router.get('/tipos-viaticos',
    updateTipoViatico // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!**
);
router.get('/tipos-viaticos',
    deleteTipoViatico // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!**
);
module.exports = router;