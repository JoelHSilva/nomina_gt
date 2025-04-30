// routes/horasExtras.routes.js
const express = require('express');
const router = express.Router();
const horasExtrasController = require('../controllers/horasExtras.controller');

router.get('/', horasExtrasController.getAllHorasExtras);
router.get('/:id', horasExtrasController.getHoraExtraById);
router.post('/', horasExtrasController.createHoraExtra);
router.put('/:id', horasExtrasController.updateHoraExtra);
router.delete('/:id', horasExtrasController.deleteHoraExtra);

module.exports = router;