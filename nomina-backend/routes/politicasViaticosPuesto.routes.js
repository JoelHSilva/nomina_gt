// routes/politicasViaticosPuesto.routes.js
const express = require('express');
const router = express.Router();
const politicasViaticosPuestoController = require('../controllers/politicasViaticosPuesto.controller');

router.get('/', politicasViaticosPuestoController.getAllPoliticasViaticosPuesto);
router.get('/:id', politicasViaticosPuestoController.getPoliticaViaticoPuestoById);
router.post('/', politicasViaticosPuestoController.createPoliticaViaticoPuesto);
router.put('/:id', politicasViaticosPuestoController.updatePoliticaViaticoPuesto);
router.delete('/:id', politicasViaticosPuestoController.deletePoliticaViaticoPuesto);

module.exports = router;