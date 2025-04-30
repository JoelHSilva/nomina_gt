// routes/conceptosPago.routes.js
const express = require('express');
const router = express.Router();
const conceptosPagoController = require('../controllers/conceptosPago.controller');

router.get('/', conceptosPagoController.getAllConceptosPago);
router.get('/:id', conceptosPagoController.getConceptoPagoById);
router.post('/', conceptosPagoController.createConceptoPago);
router.put('/:id', conceptosPagoController.updateConceptoPago);
router.delete('/:id', conceptosPagoController.deleteConceptoPago);

module.exports = router;