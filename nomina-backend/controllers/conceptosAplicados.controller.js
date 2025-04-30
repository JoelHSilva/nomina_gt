// controllers/conceptosAplicados.controller.js
const db = require('../models');
const ConceptoAplicado = db.ConceptoAplicado;
const DetalleNomina = db.DetalleNomina; // Importar modelos asociados si se usan en includes
const ConceptoPago = db.ConceptoPago;

// Obtener todos los conceptos aplicados
const getAllConceptosAplicados = async (req, res) => {
    try {
        const conceptosAplicados = await ConceptoAplicado.findAll({
             // include: [
             //     { model: DetalleNomina, as: 'detalle_nomina' },
             //     { model: ConceptoPago, as: 'concepto_pago' }
             // ] // Incluir relaciones si es necesario
        });
        res.json(conceptosAplicados);
    } catch (error) {
        console.error("Error en getAllConceptosAplicados:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un concepto aplicado por ID
const getConceptoAplicadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const conceptoAplicado = await ConceptoAplicado.findByPk(id, {
             // include: [
             //     { model: DetalleNomina, as: 'detalle_nomina' },
             //     { model: ConceptoPago, as: 'concepto_pago' }
             // ] // Incluir relaciones si es necesario
        });
        if (conceptoAplicado) {
            res.json(conceptoAplicado);
        } else {
            res.status(404).json({ error: 'Concepto Aplicado no encontrado' });
        }
    } catch (error) {
        console.error("Error en getConceptoAplicadoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo concepto aplicado
const createConceptoAplicado = async (req, res) => {
    try {
        const nuevoConceptoAplicado = await ConceptoAplicado.create(req.body);
        res.status(201).json(nuevoConceptoAplicado);
    } catch (error) {
        console.error("Error en createConceptoAplicado:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un concepto aplicado por ID
const updateConceptoAplicado = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ConceptoAplicado.update(req.body, {
            where: { id_concepto_aplicado: id }
        });
        if (updated) {
            const updatedConceptoAplicado = await ConceptoAplicado.findByPk(id, {
                 // include: [
                 //     { model: DetalleNomina, as: 'detalle_nomina' },
                 //     { model: ConceptoPago, as: 'concepto_pago' }
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedConceptoAplicado);
        } else {
            res.status(404).json({ error: 'Concepto Aplicado no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateConceptoAplicado:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un concepto aplicado por ID
const deleteConceptoAplicado = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ConceptoAplicado.destroy({
            where: { id_concepto_aplicado: id }
        });
        if (deleted) {
            res.status(204).send("Concepto Aplicado eliminado");
        } else {
            res.status(404).json({ error: 'Concepto Aplicado no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteConceptoAplicado:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllConceptosAplicados,
    getConceptoAplicadoById,
    createConceptoAplicado,
    updateConceptoAplicado,
    deleteConceptoAplicado
};