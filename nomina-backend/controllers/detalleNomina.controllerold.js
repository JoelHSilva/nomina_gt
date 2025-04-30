// controllers/detalleNomina.controller.js
const db = require('../models');
const DetalleNomina = db.DetalleNomina;
const Nomina = db.Nomina; // Importar modelos asociados si se usan en includes
const Empleado = db.Empleado;
const ConceptoAplicado = db.ConceptoAplicado; // Para hasMany
const PagoPrestamo = db.PagoPrestamo; // Para hasMany
const HoraExtra = db.HoraExtra; // Para hasMany
const LiquidacionViatico = db.LiquidacionViatico; // Para hasOne

// Obtener todos los detalles de nomina
const getAllDetalleNomina = async (req, res) => {
    try {
        const detalles = await DetalleNomina.findAll({
             // include: [
             //     { model: Nomina, as: 'nomina' },
             //     { model: Empleado, as: 'empleado' },
             //     { model: ConceptoAplicado, as: 'conceptos_aplicados' },
             //     { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
             //     { model: HoraExtra, as: 'horas_extras_pagadas' },
             //     { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
             // ] // Incluir relaciones si es necesario
        });
        res.json(detalles);
    } catch (error) {
        console.error("Error en getAllDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un detalle de nomina por ID
const getDetalleNominaById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleNomina.findByPk(id, {
             // include: [
             //     { model: Nomina, as: 'nomina' },
             //     { model: Empleado, as: 'empleado' },
             //     { model: ConceptoAplicado, as: 'conceptos_aplicados' },
             //     { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
             //     { model: HoraExtra, as: 'horas_extras_pagadas' },
             //     { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
             // ] // Incluir relaciones si es necesario
        });
        if (detalle) {
            res.json(detalle);
        } else {
            res.status(404).json({ error: 'Detalle de Nomina no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDetalleNominaById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo detalle de nomina
const createDetalleNomina = async (req, res) => {
    try {
        const nuevoDetalle = await DetalleNomina.create(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        console.error("Error en createDetalleNomina:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un detalle de nomina por ID
const updateDetalleNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await DetalleNomina.update(req.body, {
            where: { id_detalle: id }
        });
        if (updated) {
            const updatedDetalle = await DetalleNomina.findByPk(id, {
                 // include: [
                 //     { model: Nomina, as: 'nomina' },
                 //     { model: Empleado, as: 'empleado' },
                 //     { model: ConceptoAplicado, as: 'conceptos_aplicados' },
                 //     { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
                 //     { model: HoraExtra, as: 'horas_extras_pagadas' },
                 //     { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedDetalle);
        } else {
            res.status(404).json({ error: 'Detalle de Nomina no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateDetalleNomina:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un detalle de nomina por ID
const deleteDetalleNomina = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este (ConceptoAplicado, PagoPrestamo, HoraExtra, LiquidacionViatico).
        const deleted = await DetalleNomina.destroy({
            where: { id_detalle: id }
        });
        if (deleted) {
            res.status(204).send("Detalle de Nomina eliminado");
        } else {
            res.status(404).json({ error: 'Detalle de Nomina no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDetalleNomina,
    getDetalleNominaById,
    createDetalleNomina,
    updateDetalleNomina,
    deleteDetalleNomina
};