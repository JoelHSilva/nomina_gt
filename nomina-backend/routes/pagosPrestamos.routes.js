// routes/pagosPrestamos.routes.js
const express = require('express');
const router = express.Router();
const pagosPrestamosController = require('../controllers/pagosPrestamos.controller');

router.get('/', pagosPrestamosController.getAllPagosPrestamos);
router.get('/:id', pagosPrestamosController.getPagoPrestamoById);
router.post('/', pagosPrestamosController.createPagoPrestamo);
// router.put('/:id', pagosPrestamosController.updatePagoPrestamo); // Considera si habilitas
// router.delete('/:id', pagosPrestamosController.deletePagoPrestamo); // Considera si habilitas

module.exports = router;