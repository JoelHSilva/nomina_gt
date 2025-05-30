const express = require('express');
const router = express.Router();
const liquidacionesDetalleController = require('../controllers/liquidacionesDetalle.controller');

// Create a new detalle
router.post('/', liquidacionesDetalleController.createDetalle);

// Get all detalles for a liquidacion
router.get('/liquidacion/:id_liquidacion', liquidacionesDetalleController.getDetallesByLiquidacion);

// Delete a detalle
router.delete('/:id', liquidacionesDetalleController.deleteDetalle);

module.exports = router; 