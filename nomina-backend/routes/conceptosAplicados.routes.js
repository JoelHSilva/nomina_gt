// routes/conceptosAplicados.routes.js
const express = require('express');
const router = express.Router();
const conceptosAplicadosController = require('../controllers/conceptosAplicados.controller');

router.get('/', conceptosAplicadosController.getAllConceptosAplicados);
router.get('/:id', conceptosAplicadosController.getConceptoAplicadoById);
router.post('/', conceptosAplicadosController.createConceptoAplicado);
router.put('/:id', conceptosAplicadosController.updateConceptoAplicado);
router.delete('/:id', conceptosAplicadosController.deleteConceptoAplicado);

module.exports = router;