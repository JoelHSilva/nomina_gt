// routes/detalleLiquidacionViaticos.routes.js
const express = require('express');
const router = express.Router();
const detalleLiquidacionViaticosController = require('../controllers/detalleLiquidacionViaticos.controller');

router.get('/', detalleLiquidacionViaticosController.getAllDetalleLiquidacionViaticos);
router.get('/:id', detalleLiquidacionViaticosController.getDetalleLiquidacionViaticoById);
router.post('/', detalleLiquidacionViaticosController.createDetalleLiquidacionViatico);
router.put('/:id', detalleLiquidacionViaticosController.updateDetalleLiquidacionViatico);
router.delete('/:id', detalleLiquidacionViaticosController.deleteDetalleLiquidacionViatico);

module.exports = router;