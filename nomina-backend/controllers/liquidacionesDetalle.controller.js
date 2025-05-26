const db = require('../models');
const LiquidacionDetalle = db.LiquidacionDetalle;
const Liquidacion = db.Liquidacion;

// Create a new detalle
exports.createDetalle = async (req, res) => {
    try {
        const detalle = await LiquidacionDetalle.create(req.body);
        res.status(201).json(detalle);
    } catch (error) {
        console.error('Error en createDetalle:', error);
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ 
                message: error.errors.map(e => e.message)
            });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Get all detalles for a liquidacion
exports.getDetallesByLiquidacion = async (req, res) => {
    try {
        const detalles = await LiquidacionDetalle.findAll({
            where: { 
                id_liquidacion: req.params.id_liquidacion
            },
            include: [{
                model: Liquidacion,
                as: 'liquidacion'
            }]
        });
        res.json(detalles);
    } catch (error) {
        console.error('Error en getDetallesByLiquidacion:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a detalle
exports.deleteDetalle = async (req, res) => {
    try {
        const deleted = await LiquidacionDetalle.destroy({
            where: { id_detalle: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Detalle no encontrado' });
        }
        res.json({ message: 'Detalle eliminado' });
    } catch (error) {
        console.error('Error en deleteDetalle:', error);
        res.status(500).json({ message: error.message });
    }
}; 