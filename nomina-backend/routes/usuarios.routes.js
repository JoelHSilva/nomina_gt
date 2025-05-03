const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// Primero rutas específicas
router.post('/login', usuariosController.login);

// Luego rutas con parámetros
router.get('/', usuariosController.getAllUsuarios);
router.post('/', usuariosController.createUsuario);
router.get('/:id', usuariosController.getUsuarioById);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);


module.exports = router;
