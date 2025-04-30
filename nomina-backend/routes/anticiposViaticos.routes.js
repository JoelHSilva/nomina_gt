// routes/anticiposViaticos.routes.js
const express = require('express');
const router = express.Router();
const anticiposViaticosController = require('../controllers/anticiposViaticos.controller');

router.get('/', anticiposViaticosController.getAllAnticiposViaticos);
router.get('/:id', anticiposViaticosController.getAnticipoViaticoById);
router.post('/', anticiposViaticosController.createAnticipoViatico);
router.put('/:id', anticiposViaticosController.updateAnticipoViatico);
router.delete('/:id', anticiposViaticosController.deleteAnticipoViatico);

module.exports = router;