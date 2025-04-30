// routes/vacaciones.routes.js
const express = require('express');
const router = express.Router();
const vacacionesController = require('../controllers/vacaciones.controller');

router.get('/', vacacionesController.getAllVacaciones);
router.get('/:id', vacacionesController.getVacacionById);
router.post('/', vacacionesController.createVacacion);
router.put('/:id', vacacionesController.updateVacacion);
router.delete('/:id', vacacionesController.deleteVacacion);

module.exports = router;