// controllers/historialSalarios.controller.js
const db = require('../models');
const HistorialSalario = db.HistorialSalario;
const Empleado = db.Empleado; // Importar modelos asociados si se usan en includes

// Obtener todo el historial de salarios
const getAllHistorialSalarios = async (req, res) => {
    try {
        const historial = await HistorialSalario.findAll({
             // include: [{ model: Empleado, as: 'empleado' }] // Incluir relaciones si es necesario
        });
        res.json(historial);
    } catch (error) {
        console.error("Error en getAllHistorialSalarios:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un registro de historial de salario por ID
const getHistorialSalarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await HistorialSalario.findByPk(id, {
             // include: [{ model: Empleado, as: 'empleado' }] // Incluir relaciones si es necesario
        });
        if (registro) {
            res.json(registro);
        } else {
            res.status(404).json({ error: 'Registro de Historial Salario no encontrado' });
        }
    } catch (error) {
        console.error("Error en getHistorialSalarioById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo registro de historial de salario
const createHistorialSalario = async (req, res) => {
    try {
        const nuevoRegistro = await HistorialSalario.create(req.body);
        res.status(201).json(nuevoRegistro);
    } catch (error) {
        console.error("Error en createHistorialSalario:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un registro de historial de salario por ID
const updateHistorialSalario = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await HistorialSalario.update(req.body, {
            where: { id_historial: id }
        });
        if (updated) {
            const updatedRegistro = await HistorialSalario.findByPk(id, {
                 // include: [{ model: Empleado, as: 'empleado' }] // Incluir relaciones si es necesario
            });
            res.json(updatedRegistro);
        } else {
            res.status(404).json({ error: 'Registro de Historial Salario no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateHistorialSalario:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un registro de historial de salario por ID
const deleteHistorialSalario = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await HistorialSalario.destroy({
            where: { id_historial: id }
        });
        if (deleted) {
            res.status(204).send("Registro de Historial Salario eliminado");
        } else {
            res.status(404).json({ error: 'Registro de Historial Salario no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteHistorialSalario:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllHistorialSalarios,
    getHistorialSalarioById,
    createHistorialSalario,
    updateHistorialSalario,
    deleteHistorialSalario
};