// routes/empleados.routes.js
const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleados.controller');

router.get('/', empleadosController.getAllEmpleados);
router.get('/:id', empleadosController.getEmpleadoById);
router.post('/', empleadosController.createEmpleado);
router.put('/:id', empleadosController.updateEmpleado);
router.delete('/:id', empleadosController.deleteEmpleado);
router.put('/:id/toggle-status', empleadosController.toggleEmpleadoStatus); // Ruta para cambiar estado

module.exports = router;