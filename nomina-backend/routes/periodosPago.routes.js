// routes/periodosPago.routes.js
const express = require('express');
const router = express.Router();
const periodosPagoController = require('../controllers/periodosPago.controller');

router.get('/', periodosPagoController.getAllPeriodosPago);
router.get('/:id', periodosPagoController.getPeriodoPagoById);
router.post('/', periodosPagoController.createPeriodoPago);
router.put('/:id', periodosPagoController.updatePeriodoPago);
router.delete('/:id', periodosPagoController.deletePeriodoPago);

module.exports = router;