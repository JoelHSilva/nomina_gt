// routes/tarifasDestino.routes.js
const express = require('express');
const router = express.Router();
const tarifasDestinoController = require('../controllers/tarifasDestino.controller');

router.get('/', tarifasDestinoController.getAllTarifasDestino);
router.get('/:id', tarifasDestinoController.getTarifaDestinoById);
router.post('/', tarifasDestinoController.createTarifaDestino);
router.put('/:id', tarifasDestinoController.updateTarifaDestino);
router.delete('/:id', tarifasDestinoController.deleteTarifaDestino);

module.exports = router;