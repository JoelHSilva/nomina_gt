// controllers/destinosViaticos.controller.js
const db = require('../models');
const DestinoViatico = db.DestinoViatico;
const TarifaDestino = db.TarifaDestino; // Importar modelos asociados si se usan en includes

// Obtener todos los destinos de viaticos
const getAllDestinosViaticos = async (req, res) => {
    try {
        const destinos = await DestinoViatico.findAll({
             // include: [{ model: TarifaDestino, as: 'tarifas_destino' }] // Incluir relaciones si es necesario
        });
        res.json(destinos);
    } catch (error) {
        console.error("Error en getAllDestinosViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un destino de viatico por ID
const getDestinoViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const destino = await DestinoViatico.findByPk(id, {
             // include: [{ model: TarifaDestino, as: 'tarifas_destino' }] // Incluir relaciones si es necesario
        });
        if (destino) {
            res.json(destino);
        } else {
            res.status(404).json({ error: 'Destino de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDestinoViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo destino de viatico
const createDestinoViatico = async (req, res) => {
    try {
        const nuevoDestino = await DestinoViatico.create(req.body);
        res.status(201).json(nuevoDestino);
    } catch (error) {
        console.error("Error en createDestinoViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un destino de viatico por ID
const updateDestinoViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await DestinoViatico.update(req.body, {
            where: { id_destino: id }
        });
        if (updated) {
            const updatedDestino = await DestinoViatico.findByPk(id, {
                 // include: [{ model: TarifaDestino, as: 'tarifas_destino' }] // Incluir relaciones si es necesario
            });
            res.json(updatedDestino);
        } else {
            res.status(404).json({ error: 'Destino de Viatico no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateDestinoViatico:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un destino de viatico por ID
const deleteDestinoViatico = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en el modelo TarifaDestino.
        const deleted = await DestinoViatico.destroy({
            where: { id_destino: id }
        });
        if (deleted) {
            res.status(204).send("Destino de Viatico eliminado");
        } else {
            res.status(404).json({ error: 'Destino de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteDestinoViatico:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDestinosViaticos,
    getDestinoViaticoById,
    createDestinoViatico,
    updateDestinoViatico,
    deleteDestinoViatico
};