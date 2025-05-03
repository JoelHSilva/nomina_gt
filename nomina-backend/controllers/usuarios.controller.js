// controllers/usuarios.controller.js
const db = require('../models');
const Usuario = db.Usuario;
const LogSistema = db.LogSistema;

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['contrasena'] }
        });
        res.json(usuarios);
    } catch (error) {
        console.error("Error en getAllUsuarios:", error);
        res.status(500).json({ error: error.message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['contrasena'] }
        });
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error en getUsuarioById:", error);
        res.status(500).json({ error: error.message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { contrasena, ...rest } = req.body;

        // No se cifra la contraseña, se guarda tal cual se recibe
        const nuevoUsuario = await Usuario.create({
            ...rest,
            contrasena: contrasena
        });

        const usuarioSinContrasena = nuevoUsuario.toJSON();
        delete usuarioSinContrasena.contrasena;

        res.status(201).json(usuarioSinContrasena);
    } catch (error) {
        console.error("Error en createUsuario:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { contrasena, ...rest } = req.body;
        let updateData = { ...rest };

        // No se cifra la contraseña, se actualiza tal cual se recibe
        if (contrasena) {
            updateData.contrasena = contrasena;
        }

        const [updated] = await Usuario.update(updateData, {
            where: { id_usuario: id },
            individualHooks: true
        });

        if (updated) {
            const updatedUsuario = await Usuario.findByPk(id, {
                attributes: { exclude: ['contrasena'] }
            });
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateUsuario:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Usuario.destroy({
            where: { id_usuario: id }
        });
        if (deleted) {
            res.status(204).send("Usuario eliminado");
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteUsuario:", error);
        res.status(500).json({ error: error.message });
    }
};

// Login de usuario (sin cifrado de contraseñas)
const login = async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;
        const usuario = await Usuario.findOne({ where: { nombre_usuario } });

        if (!usuario) {
            console.log("Usuario no encontrado");
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        console.log("Contraseña enviada:", contrasena);
        console.log("Contraseña almacenada:", usuario.contrasena);

        // Compara las contraseñas directamente
        if (contrasena !== usuario.contrasena) {
            console.log("Contraseña incorrecta");
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuarioSinContrasena = usuario.toJSON();
        delete usuarioSinContrasena.contrasena;
        res.json(usuarioSinContrasena);

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    login,
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
};