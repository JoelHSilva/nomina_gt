// controllers/periodosPago.controller.js
const db = require('../models');
const PeriodoPago = db.PeriodoPago;
const Nomina = db.Nomina; // Importar modelos asociados si se usan en includes

// Obtener todos los periodos de pago
const getAllPeriodosPago = async (req, res) => {
    try {
        const periodos = await PeriodoPago.findAll({
             // include: [{ model: Nomina, as: 'nominas' }] // Incluir relaciones si es necesario
        });
        res.json(periodos);
    } catch (error) {
        console.error("Error en getAllPeriodosPago:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un periodo de pago por ID
const getPeriodoPagoById = async (req, res) => {
    try {
        const { id } = req.params;
        const periodo = await PeriodoPago.findByPk(id, {
             // include: [{ model: Nomina, as: 'nominas' }] // Incluir relaciones si es necesario
        });
        if (periodo) {
            res.json(periodo);
        } else {
            res.status(404).json({ error: 'Periodo de Pago no encontrado' });
        }
    } catch (error) {
        console.error("Error en getPeriodoPagoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo periodo de pago
const createPeriodoPago = async (req, res) => {
    try {
        const nuevoPeriodo = await PeriodoPago.create(req.body);
        res.status(201).json(nuevoPeriodo);
    } catch (error) {
        console.error("Error en createPeriodoPago:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un periodo de pago por ID
const updatePeriodoPago = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await PeriodoPago.update(req.body, {
            where: { id_periodo: id }
        });
        if (updated) {
            const updatedPeriodo = await PeriodoPago.findByPk(id, {
                 // include: [{ model: Nomina, as: 'nominas' }] // Incluir relaciones si es necesario
            });
            res.json(updatedPeriodo);
        } else {
            res.status(404).json({ error: 'Periodo de Pago no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updatePeriodoPago:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un periodo de pago por ID
const deletePeriodoPago = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en Nomina (que referencia a PeriodoPago).
         // Si es RESTRICT, no podrás eliminar un periodo con nóminas asociadas.
        const deleted = await PeriodoPago.destroy({
            where: { id_periodo: id }
        });
        if (deleted) {
            res.status(204).send("Periodo de Pago eliminado");
        } else {
            res.status(404).json({ error: 'Periodo de Pago no encontrado' });
        }
    } catch (error) {
        console.error("Error en deletePeriodoPago:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPeriodosPago,
    getPeriodoPagoById,
    createPeriodoPago,
    updatePeriodoPago,
    deletePeriodoPago
};