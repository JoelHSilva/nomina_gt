// routes/solicitudesViaticos.routes.js
const express = require('express');
const router = express.Router();
const solicitudesViaticosController = require('../controllers/solicitudesViaticos.controller');

router.get('/', solicitudesViaticosController.getAllSolicitudesViaticos);
router.get('/:id', solicitudesViaticosController.getSolicitudViaticoById);
router.post('/', solicitudesViaticosController.createSolicitudViatico);
router.put('/:id', solicitudesViaticosController.updateSolicitudViatico);
router.delete('/:id', solicitudesViaticosController.deleteSolicitudViatico);
router.put('/:id/aprobar', solicitudesViaticosController.aprobarSolicitud);
router.post('/:id/anticipos', solicitudesViaticosController.registrarAnticipo);
router.post('/:id/liquidar', solicitudesViaticosController.liquidarViaticos);

module.exports = router;