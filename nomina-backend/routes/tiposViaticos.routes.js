// routes/tiposViaticos.routes.js
const express = require('express');
const router = express.Router();
const tiposViaticosController = require('../controllers/tiposViaticos.controller');

router.get('/', tiposViaticosController.getAllTiposViaticos);
router.get('/:id', tiposViaticosController.getTipoViaticoById);
router.post('/', tiposViaticosController.createTipoViatico);
router.put('/:id', tiposViaticosController.updateTipoViatico);
router.delete('/:id', tiposViaticosController.deleteTipoViatico);

module.exports = router;