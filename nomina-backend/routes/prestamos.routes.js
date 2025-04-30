// routes/prestamos.routes.js
const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamos.controller');

router.get('/', prestamosController.getAllPrestamos);
router.get('/:id', prestamosController.getPrestamoById);
router.post('/', prestamosController.createPrestamo);
router.put('/:id', prestamosController.updatePrestamo);
router.delete('/:id', prestamosController.deletePrestamo);
router.post('/:id/payments', prestamosController.processLoanPayment);
// ... otras rutas nuevas para préstamos si las implementas

module.exports = router;