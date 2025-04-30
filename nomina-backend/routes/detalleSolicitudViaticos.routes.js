// routes/detalleSolicitudViaticos.routes.js
const express = require('express');
const router = express.Router();
const detalleSolicitudViaticosController = require('../controllers/detalleSolicitudViaticos.controller');

router.get('/', detalleSolicitudViaticosController.getAllDetalleSolicitudViaticos);
router.get('/:id', detalleSolicitudViaticosController.getDetalleSolicitudViaticoById);
router.post('/', detalleSolicitudViaticosController.createDetalleSolicitudViatico);
router.put('/:id', detalleSolicitudViaticosController.updateDetalleSolicitudViatico);
router.delete('/:id', detalleSolicitudViaticosController.deleteDetalleSolicitudViatico);

module.exports = router;