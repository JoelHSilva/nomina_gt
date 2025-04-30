// controllers/tarifasDestino.controller.js
const db = require('../models');
const TarifaDestino = db.TarifaDestino;
const DestinoViatico = db.DestinoViatico; // Importar modelos asociados si se usan en includes
const TipoViatico = db.TipoViatico;

// Obtener todas las tarifas de destino
const getAllTarifasDestino = async (req, res) => {
    try {
        const tarifas = await TarifaDestino.findAll({
             // include: [
             //     { model: DestinoViatico, as: 'destino' },
             //     { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        res.json(tarifas);
    } catch (error) {
        console.error("Error en getAllTarifasDestino:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una tarifa de destino por ID
const getTarifaDestinoById = async (req, res) => {
    try {
        const { id } = req.params;
        const tarifa = await TarifaDestino.findByPk(id, {
             // include: [
             //     { model: DestinoViatico, as: 'destino' },
             //     { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        if (tarifa) {
            res.json(tarifa);
        } else {
            res.status(404).json({ error: 'Tarifa de Destino no encontrada' });
        }
    } catch (error) {
        console.error("Error en getTarifaDestinoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva tarifa de destino
const createTarifaDestino = async (req, res) => {
    try {
        const nuevaTarifa = await TarifaDestino.create(req.body);
        res.status(201).json(nuevaTarifa);
    } catch (error) {
        console.error("Error en createTarifaDestino:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una tarifa de destino por ID
const updateTarifaDestino = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await TarifaDestino.update(req.body, {
            where: { id_tarifa: id }
        });
        if (updated) {
            const updatedTarifa = await TarifaDestino.findByPk(id, {
                 // include: [
                 //     { model: DestinoViatico, as: 'destino' },
                 //     { model: TipoViatico, as: 'tipo_viatico' }
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedTarifa);
        } else {
            res.status(404).json({ error: 'Tarifa de Destino no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateTarifaDestino:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una tarifa de destino por ID
const deleteTarifaDestino = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await TarifaDestino.destroy({
            where: { id_tarifa: id }
        });
        if (deleted) {
            res.status(204).send("Tarifa de Destino eliminada");
        } else {
            res.status(404).json({ error: 'Tarifa de Destino no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteTarifaDestino:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTarifasDestino,
    getTarifaDestinoById,
    createTarifaDestino,
    updateTarifaDestino,
    deleteTarifaDestino
};