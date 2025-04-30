// controllers/detalleLiquidacionViaticos.controller.js
const db = require('../models');
const DetalleLiquidacionViatico = db.DetalleLiquidacionViatico;
const LiquidacionViatico = db.LiquidacionViatico; // Importar modelos asociados si se usan en includes
const TipoViatico = db.TipoViatico;

// Obtener todos los detalles de liquidacion de viaticos
const getAllDetalleLiquidacionViaticos = async (req, res) => {
    try {
        const detalles = await DetalleLiquidacionViatico.findAll({
             // include: [
             //    { model: LiquidacionViatico, as: 'liquidacion_viatico' },
             //    { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        res.json(detalles);
    } catch (error) {
        console.error("Error en getAllDetalleLiquidacionViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un detalle de liquidacion de viatico por ID
const getDetalleLiquidacionViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleLiquidacionViatico.findByPk(id, {
             // include: [
             //    { model: LiquidacionViatico, as: 'liquidacion_viatico' },
             //    { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        if (detalle) {
            res.json(detalle);
        } else {
            res.status(404).json({ error: 'Detalle de Liquidacion de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDetalleLiquidacionViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo detalle de liquidacion de viatico
const createDetalleLiquidacionViatico = async (req, res) => {
    try {
        const nuevoDetalle = await DetalleLiquidacionViatico.create(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        console.error("Error en createDetalleLiquidacionViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un detalle de liquidacion de viatico por ID
const updateDetalleLiquidacionViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await DetalleLiquidacionViatico.update(req.body, {
            where: { id_detalle: id }
        });
        if (updated) {
            const updatedDetalle = await DetalleLiquidacionViatico.findByPk(id, {
                 // include: [
                 //    { model: LiquidacionViatico, as: 'liquidacion_viatico' },
                 //    { model: TipoViatico, as: 'tipo_viatico' }
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedDetalle);
        } else {
            res.status(404).json({ error: 'Detalle de Liquidacion de Viatico no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateDetalleLiquidacionViatico:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un detalle de liquidacion de viatico por ID
const deleteDetalleLiquidacionViatico = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await DetalleLiquidacionViatico.destroy({
            where: { id_detalle: id }
        });
        if (deleted) {
            res.status(204).send("Detalle de Liquidacion de Viatico eliminado");
        } else {
            res.status(404).json({ error: 'Detalle de Liquidacion de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteDetalleLiquidacionViatico:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDetalleLiquidacionViaticos,
    getDetalleLiquidacionViaticoById,
    createDetalleLiquidacionViatico,
    updateDetalleLiquidacionViatico,
    deleteDetalleLiquidacionViatico
};