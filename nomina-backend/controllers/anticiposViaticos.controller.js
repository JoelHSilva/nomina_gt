// controllers/anticiposViaticos.controller.js
const db = require('../models');
const AnticipoViatico = db.AnticipoViatico;
const SolicitudViatico = db.SolicitudViatico; // Importar modelos asociados si se usan en includes

// Obtener todos los anticipos de viaticos
const getAllAnticiposViaticos = async (req, res) => {
    try {
        const anticipos = await AnticipoViatico.findAll({
            // include: [{ model: SolicitudViatico, as: 'solicitud_viatico' }] // Incluir relaciones si es necesario
        });
        res.json(anticipos);
    } catch (error) {
        console.error("Error en getAllAnticiposViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un anticipo de viatico por ID
const getAnticipoViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const anticipo = await AnticipoViatico.findByPk(id, {
            // include: [{ model: SolicitudViatico, as: 'solicitud_viatico' }] // Incluir relaciones si es necesario
        });
        if (anticipo) {
            res.json(anticipo);
        } else {
            res.status(404).json({ error: 'Anticipo de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en getAnticipoViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo anticipo de viatico
const createAnticipoViatico = async (req, res) => {
    try {
        const nuevoAnticipo = await AnticipoViatico.create(req.body);
        res.status(201).json(nuevoAnticipo);
    } catch (error) {
        console.error("Error en createAnticipoViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un anticipo de viatico por ID
const updateAnticipoViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await AnticipoViatico.update(req.body, {
            where: { id_anticipo: id }
        });
        if (updated) {
            const updatedAnticipo = await AnticipoViatico.findByPk(id, {
                 // include: [{ model: SolicitudViatico, as: 'solicitud_viatico' }] // Incluir relaciones si es necesario
            });
            res.json(updatedAnticipo);
        } else {
            res.status(404).json({ error: 'Anticipo de Viatico no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateAnticipoViatico:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un anticipo de viatico por ID
const deleteAnticipoViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await AnticipoViatico.destroy({
            where: { id_anticipo: id }
        });
        if (deleted) {
            res.status(204).send("Anticipo de Viatico eliminado"); // 204 No Content es común para eliminación exitosa sin cuerpo de respuesta
        } else {
            res.status(404).json({ error: 'Anticipo de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteAnticipoViatico:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAnticiposViaticos,
    getAnticipoViaticoById,
    createAnticipoViatico,
    updateAnticipoViatico,
    deleteAnticipoViatico
};