// controllers/usuarios.controller.js
const db = require('../models');
const Usuario = db.Usuario;
const LogSistema = db.LogSistema; // Importar modelos asociados si se usan en includes
const bcrypt = require('bcryptjs'); // Para hashear contraseñas

// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
    try {
        // Considera NO incluir información sensible como la contraseña hasheada
        const usuarios = await Usuario.findAll({
             attributes: { exclude: ['contrasena'] } // Excluir contraseña por seguridad
             // include: [{ model: LogSistema, as: 'logs' }] // Incluir logs si es necesario (puede ser muy verboso)
        });
        res.json(usuarios);
    } catch (error) {
        console.error("Error en getAllUsuarios:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
             attributes: { exclude: ['contrasena'] } // Excluir contraseña por seguridad
             // include: [{ model: LogSistema, as: 'logs' }] // Incluir logs si es necesario
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

// Crear un nuevo usuario
// Nota: La contraseña debe ser hasheada antes de guardarla.
const createUsuario = async (req, res) => {
    try {
        const { contrasena, ...rest } = req.body;
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el saltRounds

        const nuevoUsuario = await Usuario.create({
            ...rest,
            contrasena: hashedPassword
        });

        // Excluir la contraseña del objeto de respuesta
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

// Actualizar un usuario por ID
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { contrasena, ...rest } = req.body;
        let updateData = { ...rest };

        // Si se proporciona una nueva contraseña, hashearla
        if (contrasena) {
            updateData.contrasena = await bcrypt.hash(contrasena, 10);
        }

        const [updated] = await Usuario.update(updateData, {
            where: { id_usuario: id },
            individualHooks: true // Si tienes hooks beforeUpdate para hashear, habilítalos
        });

        if (updated) {
            const updatedUsuario = await Usuario.findByPk(id, {
                 attributes: { exclude: ['contrasena'] } // Excluir contraseña por seguridad
                 // include: [{ model: LogSistema, as: 'logs' }] // Incluir logs si es necesario
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

// Eliminar un usuario por ID
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en LogSistema (que referencia a Usuario).
        // Si es SET NULL (que pusimos), los logs del usuario eliminado tendrán id_usuario = NULL.
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

// Puedes añadir una función para login aquí si lo necesitas
/*
const login = async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;
        const usuario = await Usuario.findOne({ where: { nombre_usuario: nombre_usuario } });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Si las credenciales son correctas, puedes generar un token JWT aquí
        // y devolverlo en la respuesta.
        // jwt.sign({ id: usuario.id_usuario, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        //     if (err) throw err;
        //     res.json({ token });
        // });

        // Por ahora, solo devolvemos el usuario (sin contraseña)
        const usuarioSinContrasena = usuario.toJSON();
        delete usuarioSinContrasena.contrasena;
        res.json(usuarioSinContrasena); // O el token si implementas JWT

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: error.message });
    }
};
*/

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    // login // Exportar si implementas login
};