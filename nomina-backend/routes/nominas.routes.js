// routes/nominas.routes.js
const express = require('express');
const router = express.Router();
const nominasController = require('../controllers/nominas.controller');

router.get('/', nominasController.getAllNominas);
router.get('/:id', nominasController.getNominaById);
router.post('/', nominasController.createNomina);
router.put('/:id', nominasController.updateNomina);
router.delete('/:id', nominasController.deleteNomina);
router.put('/:id/verificar', nominasController.verificarNomina);
router.put('/:id/aprobar', nominasController.aprobarNomina);
router.put('/:id/pagar', nominasController.pagarNomina);

module.exports = router;