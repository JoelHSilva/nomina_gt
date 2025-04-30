// routes/logsSistema.routes.js
const express = require('express');
const router = express.Router();
const logsSistemaController = require('../controllers/logsSistema.controller');

router.get('/', logsSistemaController.getAllLogsSistema);
router.get('/:id', logsSistemaController.getLogSistemaById);
// router.post('/', logsSistemaController.createLogSistema); // Considera si habilitas
// router.put('/:id', logsSistemaController.updateLogSistema); // No recomendado
// router.delete('/:id', logsSistemaController.deleteLogSistema); // No recomendado

module.exports = router;