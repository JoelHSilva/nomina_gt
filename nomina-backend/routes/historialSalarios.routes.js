// routes/historialSalarios.routes.js
const express = require('express');
const router = express.Router();
const historialSalariosController = require('../controllers/historialSalarios.controller');

router.get('/', historialSalariosController.getAllHistorialSalarios);
router.get('/:id', historialSalariosController.getHistorialSalarioById);
router.post('/', historialSalariosController.createHistorialSalario);
router.put('/:id', historialSalariosController.updateHistorialSalario);
router.delete('/:id', historialSalariosController.deleteHistorialSalario);

module.exports = router;