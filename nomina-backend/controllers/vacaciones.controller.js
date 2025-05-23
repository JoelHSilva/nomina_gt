// controllers/vacaciones.controller.js
const db = require('../models');
const Vacacion = db.Vacacion;
const Empleado = db.Empleado; // Importar modelos asociados si se usan en includes

// Obtener todas las vacaciones (AHORA INCLUYE DATOS DEL EMPLEADO)
const getAllVacaciones = async (req, res) => {
    try {
        const vacaciones = await Vacacion.findAll({
             // --- MODIFICACIÓN CLAVE AQUÍ ---
             include: [{ model: Empleado, as: 'empleado' }] // <-- Descomentar y usar la inclusión
             // --- FIN MODIFICACIÓN CLAVE ---
        });
        res.json(vacaciones);
    } catch (error) {
        console.error("Error en getAllVacaciones:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una vacacion por ID (También incluye el empleado aquí)
const getVacacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const vacacion = await Vacacion.findByPk(id, {
             // --- MODIFICACIÓN CLAVE AQUÍ ---
             include: [{ model: Empleado, as: 'empleado' }] // <-- Incluir también aquí
             // --- FIN MODIFICACIÓN CLAVE ---
        });
        if (vacacion) {
            res.json(vacacion);
        } else {
            res.status(404).json({ error: 'Vacacion no encontrada' });
        }
    } catch (error) {
        console.error("Error en getVacacionById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva vacacion (sin cambios)
const createVacacion = async (req, res) => { /* ... */ 
    try {
        const nuevaVacacion = await Vacacion.create(req.body);
        res.status(201).json(nuevaVacacion);
    } catch (error) {
        console.error("Error en createVacacion:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una vacacion por ID (sin cambios)
const updateVacacion = async (req, res) => { /* ... */ 
    try {
        const { id } = req.params;
        const [updated] = await Vacacion.update(req.body, {
            where: { id_vacaciones: id }
        });
        if (updated) {
            const updatedVacacion = await Vacacion.findByPk(id, {
                 // include: [{ model: Empleado, as: 'empleado' }] // Incluir relaciones si es necesario
            });
            res.json(updatedVacacion);
        } else {
            res.status(404).json({ error: 'Vacacion no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateVacacion:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una vacacion por ID (sin cambios)
const deleteVacacion = async (req, res) => { /* ... */ 
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await Vacacion.destroy({
            where: { id_vacaciones: id }
        });
        if (deleted) {
            res.status(204).send("Vacacion eliminada");
        } else {
            res.status(404).json({ error: 'Vacacion no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteVacacion:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllVacaciones, // <-- Método modificado
    getVacacionById, // <-- Método modificado
    createVacacion,
    updateVacacion,
    deleteVacacion
};