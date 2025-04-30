// controllers/logsSistema.controller.js
const db = require('../models');
const LogSistema = db.LogSistema;
const Usuario = db.Usuario; // Importar modelos asociados si se usan en includes

// Obtener todos los logs del sistema
const getAllLogsSistema = async (req, res) => {
    try {
        const logs = await LogSistema.findAll({
             // include: [{ model: Usuario, as: 'usuario' }] // Incluir relaciones si es necesario
        });
        res.json(logs);
    } catch (error) {
        console.error("Error en getAllLogsSistema:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un log del sistema por ID
const getLogSistemaById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await LogSistema.findByPk(id, {
             // include: [{ model: Usuario, as: 'usuario' }] // Incluir relaciones si es necesario
        });
        if (log) {
            res.json(log);
        } else {
            res.status(404).json({ error: 'Log de Sistema no encontrado' });
        }
    } catch (error) {
        console.error("Error en getLogSistemaById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo log del sistema (normalmente esto se haría internamente, no vía API externa)
// Incluido por completitud CRUD, pero considera si es una API pública.
const createLogSistema = async (req, res) => {
    try {
        const nuevoLog = await LogSistema.create(req.body);
        res.status(201).json(nuevoLog);
    } catch (error) {
        console.error("Error en createLogSistema:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un log del sistema por ID (normalmente no se actualizan los logs)
const updateLogSistema = async (req, res) => {
     res.status(405).json({ error: 'Actualización de Logs no permitida' }); // Método no permitido
    /*
    try {
        const { id } = req.params;
        const [updated] = await LogSistema.update(req.body, {
            where: { id_log: id }
        });
        if (updated) {
            const updatedLog = await LogSistema.findByPk(id, {
                 // include: [{ model: Usuario, as: 'usuario' }] // Incluir relaciones si es necesario
            });
            res.json(updatedLog);
        } else {
            res.status(404).json({ error: 'Log de Sistema no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateLogSistema:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
    */
};

// Eliminar un log del sistema por ID (normalmente no se eliminan los logs)
const deleteLogSistema = async (req, res) => {
    res.status(405).json({ error: 'Eliminación de Logs no permitida' }); // Método no permitido
    /*
    try {
        const { id } = req.params;
        const deleted = await LogSistema.destroy({
            where: { id_log: id }
        });
        if (deleted) {
            res.status(204).send("Log de Sistema eliminado");
        } else {
            res.status(404).json({ error: 'Log de Sistema no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteLogSistema:", error);
        res.status(500).json({ error: error.message });
    }
    */
};

module.exports = {
    getAllLogsSistema,
    getLogSistemaById,
    createLogSistema, // Considera si realmente quieres exponer este via API
    updateLogSistema, // No recomendado exponer via API
    deleteLogSistema // No recomendado exponer via API
};