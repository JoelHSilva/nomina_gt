// routes/departamentos.routes.js
const express = require('express');
const router = express.Router();
const departamentosController = require('../controllers/departamentos.controller');

router.get('/', departamentosController.getAllDepartamentos);
router.get('/:id', departamentosController.getDepartamentoById);
router.post('/', departamentosController.createDepartamento);
router.put('/:id', departamentosController.updateDepartamento);
router.delete('/:id', departamentosController.deleteDepartamento);

module.exports = router;