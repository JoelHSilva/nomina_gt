// routes/liquidaciones.routes.js
const express = require('express');
const router = express.Router();
const liquidacionesController = require('../controllers/liquidaciones.controller');

// Basic CRUD routes
router.get('/', liquidacionesController.getLiquidaciones);
router.get('/:id', liquidacionesController.getLiquidacionById);
router.post('/', liquidacionesController.createLiquidacion);
router.put('/:id/status', liquidacionesController.updateLiquidacionStatus);

module.exports = router; 