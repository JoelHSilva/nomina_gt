// routes/ausencias.routes.js
const express = require('express');
const router = express.Router();
const ausenciasController = require('../controllers/ausencias.controller');

router.get('/', ausenciasController.getAllAusencias);
router.get('/:id', ausenciasController.getAusenciaById);
router.post('/', ausenciasController.createAusencia);
router.put('/:id', ausenciasController.updateAusencia);
router.delete('/:id', ausenciasController.deleteAusencia);

module.exports = router;