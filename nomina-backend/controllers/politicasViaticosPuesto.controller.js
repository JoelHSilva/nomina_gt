// controllers/politicasViaticosPuesto.controller.js
const db = require('../models');
const PoliticaViaticoPuesto = db.PoliticaViaticoPuesto;
const Puesto = db.Puesto; // Importar modelos asociados si se usan en includes
const TipoViatico = db.TipoViatico;

// Obtener todas las politicas de viaticos por puesto
const getAllPoliticasViaticosPuesto = async (req, res) => {
    try {
        const politicas = await PoliticaViaticoPuesto.findAll({
             // include: [
             //    { model: Puesto, as: 'puesto' },
             //    { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        res.json(politicas);
    } catch (error) {
        console.error("Error en getAllPoliticasViaticosPuesto:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una politica de viatico por puesto por ID
const getPoliticaViaticoPuestoById = async (req, res) => {
    try {
        const { id } = req.params;
        const politica = await PoliticaViaticoPuesto.findByPk(id, {
             // include: [
             //    { model: Puesto, as: 'puesto' },
             //    { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        if (politica) {
            res.json(politica);
        } else {
            res.status(404).json({ error: 'Politica de Viatico por Puesto no encontrada' });
        }
    } catch (error) {
        console.error("Error en getPoliticaViaticoPuestoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva politica de viatico por puesto
const createPoliticaViaticoPuesto = async (req, res) => {
    try {
        const nuevaPolitica = await PoliticaViaticoPuesto.create(req.body);
        res.status(201).json(nuevaPolitica);
    } catch (error) {
        console.error("Error en createPoliticaViaticoPuesto:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una politica de viatico por puesto por ID
const updatePoliticaViaticoPuesto = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await PoliticaViaticoPuesto.update(req.body, {
            where: { id_politica: id }
        });
        if (updated) {
            const updatedPolitica = await PoliticaViaticoPuesto.findByPk(id, {
                 // include: [
                 //    { model: Puesto, as: 'puesto' },
                 //    { model: TipoViatico, as: 'tipo_viatico' }
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedPolitica);
        } else {
            res.status(404).json({ error: 'Politica de Viatico por Puesto no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updatePoliticaViaticoPuesto:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una politica de viatico por puesto por ID
const deletePoliticaViaticoPuesto = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await PoliticaViaticoPuesto.destroy({
            where: { id_politica: id }
        });
        if (deleted) {
            res.status(204).send("Politica de Viatico por Puesto eliminada");
        } else {
            res.status(404).json({ error: 'Politica de Viatico por Puesto no encontrada' });
        }
    } catch (error) {
        console.error("Error en deletePoliticaViaticoPuesto:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPoliticasViaticosPuesto,
    getPoliticaViaticoPuestoById,
    createPoliticaViaticoPuesto,
    updatePoliticaViaticoPuesto,
    deletePoliticaViaticoPuesto
};