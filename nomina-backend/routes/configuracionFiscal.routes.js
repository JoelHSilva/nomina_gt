// routes/configuracionFiscal.routes.js
const express = require('express');
const router = express.Router();
const configuracionFiscalController = require('../controllers/configuracionFiscal.controller');

router.get('/', configuracionFiscalController.getAllConfiguracionFiscal);
router.get('/:id', configuracionFiscalController.getConfiguracionFiscalById);
router.post('/', configuracionFiscalController.createConfiguracionFiscal);
router.put('/:id', configuracionFiscalController.updateConfiguracionFiscal);
router.delete('/:id', configuracionFiscalController.deleteConfiguracionFiscal);

module.exports = router;