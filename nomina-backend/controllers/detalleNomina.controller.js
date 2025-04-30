// controllers/detalleNomina.controller.js
const db = require('../models');
const DetalleNomina = db.DetalleNomina;
const Nomina = db.Nomina;
const Empleado = db.Empleado;
const ConceptoAplicado = db.ConceptoAplicado;
const PagoPrestamo = db.PagoPrestamo;
const HoraExtra = db.HoraExtra;
const LiquidacionViatico = db.LiquidacionViatico;

// Obtener todos los detalles de nómina (ahora con relaciones)
const getAllDetalleNomina = async (req, res) => {
    try {
        const detalles = await DetalleNomina.findAll({
            include: [
                { model: Nomina, as: 'nomina' },
                { model: Empleado, as: 'empleado' },
                // Opcional: Descomenta si necesitas estas relaciones
                // { model: ConceptoAplicado, as: 'conceptos_aplicados' },
                // { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
                // { model: HoraExtra, as: 'horas_extras_pagadas' },
                // { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
            ]
        });
        res.json(detalles);
    } catch (error) {
        console.error("Error en getAllDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un detalle por ID (con relaciones)
const getDetalleNominaById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleNomina.findByPk(id, {
            include: [
                { model: Nomina, as: 'nomina' },
                { model: Empleado, as: 'empleado' }, // ¡Clave para anidar el empleado!
                // Opcional: Otras relaciones
            ]
        });
        if (detalle) {
            res.json(detalle);
        } else {
            res.status(404).json({ error: 'Detalle no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDetalleNominaById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo detalle (sin cambios)
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

// Actualizar un detalle (ahora devuelve el objeto actualizado con relaciones)
const updateDetalleNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await DetalleNomina.update(req.body, {
            where: { id_detalle: id }
        });
        if (updated) {
            const updatedDetalle = await DetalleNomina.findByPk(id, {
                include: [
                    { model: Nomina, as: 'nomina' },
                    { model: Empleado, as: 'empleado' }
                ]
            });
            res.json(updatedDetalle); // Devuelve el detalle con relaciones
        } else {
            res.status(404).json({ error: 'Detalle no encontrado o sin cambios' });
        }
    } catch (error) {
        console.error("Error en updateDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un detalle (sin cambios)
const deleteDetalleNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await DetalleNomina.destroy({
            where: { id_detalle: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Detalle no encontrado' });
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