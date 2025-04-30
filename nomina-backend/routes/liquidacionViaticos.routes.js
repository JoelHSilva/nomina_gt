// routes/liquidacionViaticos.routes.js
const express = require('express');
const router = express.Router();
const liquidacionViaticosController = require('../controllers/liquidacionViaticos.controller');

router.get('/', liquidacionViaticosController.getAllLiquidacionViaticos);
router.get('/:id', liquidacionViaticosController.getLiquidacionViaticoById);
router.post('/', liquidacionViaticosController.createLiquidacionViatico);
router.put('/:id', liquidacionViaticosController.updateLiquidacionViatico);
router.delete('/:id', liquidacionViaticosController.deleteLiquidacionViatico);

module.exports = router;