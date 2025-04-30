// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.getAllUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario); // Requiere body con datos de usuario (incluyendo contraseña)
router.put('/:id', usuariosController.updateUsuario); // Requiere body con datos a actualizar (contraseña opcional)
router.delete('/:id', usuariosController.deleteUsuario);

// router.post('/login', usuariosController.login); // Ruta para login si implementas la función

module.exports = router;