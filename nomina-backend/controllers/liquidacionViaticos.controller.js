// controllers/liquidacionViaticos.controller.js
const db = require('../models');
const LiquidacionViatico = db.LiquidacionViatico;
const SolicitudViatico = db.SolicitudViatico; // Importar modelos asociados si se usan en includes
const DetalleNomina = db.DetalleNomina;
const DetalleLiquidacionViatico = db.DetalleLiquidacionViatico; // Para hasMany

// Obtener todas las liquidaciones de viaticos
const getAllLiquidacionViaticos = async (req, res) => {
    try {
        const liquidaciones = await LiquidacionViatico.findAll({
             // include: [
             //     { model: SolicitudViatico, as: 'solicitud_viatico' },
             //     { model: DetalleNomina, as: 'detalle_nomina_inclusion' }, // Si se incluyó en nómina
             //     { model: DetalleLiquidacionViatico, as: 'detalles_liquidacion' },
             // ] // Incluir relaciones si es necesario
        });
        res.json(liquidaciones);
    } catch (error) {
        console.error("Error en getAllLiquidacionViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una liquidación de viatico por ID
const getLiquidacionViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const liquidacion = await LiquidacionViatico.findByPk(id, {
             // include: [
             //     { model: SolicitudViatico, as: 'solicitud_viatico' },
             //     { model: DetalleNomina, as: 'detalle_nomina_inclusion' }, // Si se incluyó en nómina
             //     { model: DetalleLiquidacionViatico, as: 'detalles_liquidacion' },
             // ] // Incluir relaciones si es necesario
        });
        if (liquidacion) {
            res.json(liquidacion);
        } else {
            res.status(404).json({ error: 'Liquidación de Viatico no encontrada' });
        }
    } catch (error) {
        console.error("Error en getLiquidacionViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva liquidación de viatico
const createLiquidacionViatico = async (req, res) => {
    try {
        const nuevaLiquidacion = await LiquidacionViatico.create(req.body);
        res.status(201).json(nuevaLiquidacion);
    } catch (error) {
        console.error("Error en createLiquidacionViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una liquidación de viatico por ID
const updateLiquidacionViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await LiquidacionViatico.update(req.body, {
            where: { id_liquidacion: id }
        });
        if (updated) {
            const updatedLiquidacion = await LiquidacionViatico.findByPk(id, {
                 // include: [
                 //     { model: SolicitudViatico, as: 'solicitud_viatico' },
                 //     { model: DetalleNomina, as: 'detalle_nomina_inclusion' }, // Si se incluyó en nómina
                 //     { model: DetalleLiquidacionViatico, as: 'detalles_liquidacion' },
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedLiquidacion);
        } else {
            res.status(404).json({ error: 'Liquidación de Viatico no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateLiquidacionViatico:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una liquidación de viatico por ID
const deleteLiquidacionViatico = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este (DetalleLiquidacionViatico).
        const deleted = await LiquidacionViatico.destroy({
            where: { id_liquidacion: id }
        });
        if (deleted) {
            res.status(204).send("Liquidación de Viatico eliminada");
        } else {
            res.status(404).json({ error: 'Liquidación de Viatico no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteLiquidacionViatico:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllLiquidacionViaticos,
    getLiquidacionViaticoById,
    createLiquidacionViatico,
    updateLiquidacionViatico,
    deleteLiquidacionViatico
};