// controllers/departamentos.controller.js
const db = require('../models');
const Departamento = db.Departamento;
const Puesto = db.Puesto; // Importar modelos asociados si se usan en includes

// Obtener todos los departamentos
const getAllDepartamentos = async (req, res) => {
    try {
        const departamentos = await Departamento.findAll({
             // include: [{ model: Puesto, as: 'puestos' }] // Incluir relaciones si es necesario
        });
        res.json(departamentos);
    } catch (error) {
        console.error("Error en getAllDepartamentos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un departamento por ID
const getDepartamentoById = async (req, res) => {
    try {
        const { id } = req.params;
        const departamento = await Departamento.findByPk(id, {
             // include: [{ model: Puesto, as: 'puestos' }] // Incluir relaciones si es necesario
        });
        if (departamento) {
            res.json(departamento);
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDepartamentoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo departamento
const createDepartamento = async (req, res) => {
    try {
        const nuevoDepartamento = await Departamento.create(req.body);
        res.status(201).json(nuevoDepartamento);
    } catch (error) {
        console.error("Error en createDepartamento:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un departamento por ID
const updateDepartamento = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Departamento.update(req.body, {
            where: { id_departamento: id }
        });
        if (updated) {
            const updatedDepartamento = await Departamento.findByPk(id, {
                 // include: [{ model: Puesto, as: 'puestos' }] // Incluir relaciones si es necesario
            });
            res.json(updatedDepartamento);
        } else {
            res.status(404).json({ error: 'Departamento no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateDepartamento:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un departamento por ID
const deleteDepartamento = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en el modelo Puesto (que referencia a Departamento).
        // Si es RESTRICT (el default), no podrás eliminar un departamento que tenga puestos asociados.
        const deleted = await Departamento.destroy({
            where: { id_departamento: id }
        });
        if (deleted) {
            res.status(204).send("Departamento eliminado");
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteDepartamento:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDepartamentos,
    getDepartamentoById,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento
};