// controllers/conceptosPago.controller.js
const db = require('../models');
const ConceptoPago = db.ConceptoPago;
// Importar modelos asociados si se usan en includes

// Obtener todos los conceptos de pago
const getAllConceptosPago = async (req, res) => {
    try {
        const conceptos = await ConceptoPago.findAll({
             // include: [] // Incluir relaciones si es necesario
        });
        res.json(conceptos);
    } catch (error) {
        console.error("Error en getAllConceptosPago:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un concepto de pago por ID
const getConceptoPagoById = async (req, res) => {
    try {
        const { id } = req.params;
        const concepto = await ConceptoPago.findByPk(id, {
             // include: [] // Incluir relaciones si es necesario
        });
        if (concepto) {
            res.json(concepto);
        } else {
            res.status(404).json({ error: 'Concepto de Pago no encontrado' });
        }
    } catch (error) {
        console.error("Error en getConceptoPagoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo concepto de pago
const createConceptoPago = async (req, res) => {
    try {
        const nuevoConcepto = await ConceptoPago.create(req.body);
        res.status(201).json(nuevoConcepto);
    } catch (error) {
        console.error("Error en createConceptoPago:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un concepto de pago por ID
const updateConceptoPago = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ConceptoPago.update(req.body, {
            where: { id_concepto: id }
        });
        if (updated) {
            const updatedConcepto = await ConceptoPago.findByPk(id, {
                 // include: [] // Incluir relaciones si es necesario
            });
            res.json(updatedConcepto);
        } else {
            res.status(404).json({ error: 'Concepto de Pago no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateConceptoPago:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un concepto de pago por ID
const deleteConceptoPago = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ConceptoPago.destroy({
            where: { id_concepto: id }
        });
        if (deleted) {
            res.status(204).send("Concepto de Pago eliminado");
        } else {
            res.status(404).json({ error: 'Concepto de Pago no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteConceptoPago:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllConceptosPago,
    getConceptoPagoById,
    createConceptoPago,
    updateConceptoPago,
    deleteConceptoPago
};