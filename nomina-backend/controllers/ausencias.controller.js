// controllers/ausencias.controller.js
const db = require('../models');
const Ausencia = db.Ausencia;
const Empleado = db.Empleado; // Importar modelos asociados

// Obtener todas las ausencias (AHORA INCLUYE DATOS DEL EMPLEADO)
const getAllAusencias = async (req, res) => {
    try {
        const ausencias = await Ausencia.findAll({
             // --- MODIFICACIÓN CLAVE AQUÍ ---
             include: [{ model: Empleado, as: 'empleado' }] // <-- Descomentar y usar la inclusión con el alias 'empleado'
             // --- FIN MODIFICACIÓN CLAVE ---
        });
        res.json(ausencias);
    } catch (error) {
        console.error("Error en getAllAusencias:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una ausencia por ID (También incluye el empleado aquí)
const getAusenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        const ausencia = await Ausencia.findByPk(id, {
             // --- MODIFICACIÓN CLAVE AQUÍ ---
             include: [{ model: Empleado, as: 'empleado' }] // <-- Incluir también aquí
             // --- FIN MODIFICACIÓN CLAVE ---
        });
        if (ausencia) {
            res.json(ausencia);
        } else {
            res.status(404).json({ error: 'Ausencia no encontrada' });
        }
    } catch (error) {
        console.error("Error en getAusenciaById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva ausencia (sin cambios)
const createAusencia = async (req, res) => { 
    try {
        const nuevaAusencia = await Ausencia.create(req.body);
        res.status(201).json(nuevaAusencia);
    } catch (error) {
        console.error("Error en createAusencia:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una ausencia por ID (sin cambios)
const updateAusencia = async (req, res) => { 
    try {
        const { id } = req.params;
        const [updated] = await Ausencia.update(req.body, {
            where: { id_ausencia: id }
        });
        if (updated) {
            const updatedAusencia = await Ausencia.findByPk(id, {
                 // Si necesitas el empleado después de actualizar, inclúyelo aquí también
                 // include: [{ model: Empleado, as: 'empleado' }]
            });
            res.json(updatedAusencia);
        } else {
            res.status(404).json({ error: 'Ausencia no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateAusencia:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una ausencia por ID (sin cambios)
const deleteAusencia = async (req, res) => { 
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await Ausencia.destroy({
            where: { id_ausencia: id }
        });
        if (deleted) {
            res.status(204).send("Ausencia eliminada");
        } else {
            res.status(404).json({ error: 'Ausencia no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteAusencia:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAusencias, // <-- Método modificado
    getAusenciaById, // <-- Método modificado
    createAusencia,
    updateAusencia,
    deleteAusencia
};