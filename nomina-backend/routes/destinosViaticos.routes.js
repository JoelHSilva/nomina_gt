// routes/destinosViaticos.routes.js
const express = require('express');
const router = express.Router();
const destinosViaticosController = require('../controllers/destinosViaticos.controller');

router.get('/', destinosViaticosController.getAllDestinosViaticos);
router.get('/:id', destinosViaticosController.getDestinoViaticoById);
router.post('/', destinosViaticosController.createDestinoViatico);
router.put('/:id', destinosViaticosController.updateDestinoViatico);
router.delete('/:id', destinosViaticosController.deleteDestinoViatico);

module.exports = router;