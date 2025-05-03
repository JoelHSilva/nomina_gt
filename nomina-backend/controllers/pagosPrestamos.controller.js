// controllers/pagosPrestamos.controller.js
const db = require('../models');
const PagoPrestamo = db.PagoPrestamo;
const { prestamosService } = require('../services'); // Usa la instancia compartida

// Obtener todos los pagos de préstamos
const getAllPagosPrestamos = async (req, res) => {
    try {
        
        const pagos = await PagoPrestamo.findAll({
            include: [
                { 
                    model: db.Prestamo, 
                    as: 'prestamo',
                    include: [{ model: db.Empleado, as: 'empleado' }]
                },
                { model: db.DetalleNomina, as: 'detalle_nomina_pago' }
            ],
            order: [['fecha_pago', 'DESC']]
        });
        res.json(pagos);
    } catch (error) {
        console.error("Error en getAllPagosPrestamos:", error);
        res.status(500).json({ 
            error: 'Error al obtener los pagos de préstamos',
            details: error.message 
        });
    }
};

// Obtener un pago de préstamo por ID
const getPagoPrestamoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await PagoPrestamo.findByPk(id, {
            include: [
                { 
                    model: db.Prestamo, 
                    as: 'prestamo',
                    include: [{ model: db.Empleado, as: 'empleado' }]
                },
                { model: db.DetalleNomina, as: 'detalle_nomina_pago' }
            ]
        });
        
        if (!pago) {
            return res.status(404).json({ error: 'Pago de préstamo no encontrado' });
        }
        
        res.json(pago);
    } catch (error) {
        console.error("Error en getPagoPrestamoById:", error);
        res.status(500).json({ 
            error: 'Error al obtener el pago de préstamo',
            details: error.message 
        });
    }
};

// Crear un nuevo pago de préstamo (integrado con el servicio)
const createPagoPrestamo = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { id_prestamo, monto_pagado, tipo_pago, id_detalle_nomina, observaciones } = req.body;

        // Validaciones básicas
        if (!id_prestamo || !monto_pagado || monto_pagado <= 0) {
            await t.rollback();
            return res.status(400).json({ error: 'Datos de pago inválidos' });
        }

        // Procesar el pago usando el servicio
        const resultado = await prestamosService.procesarPagoPrestamo(
            id_prestamo,
            monto_pagado,
            tipo_pago || 'Manual',
            id_detalle_nomina || null,
            t
        );

        // Si hay observaciones, actualizar el pago
        if (observaciones) {
            await resultado.pago.update({ observaciones }, { transaction: t });
        }

        await t.commit();
        res.status(201).json({
            pago: resultado.pago,
            prestamo: resultado.prestamo
        });
    } catch (error) {
        await t.rollback();
        console.error("Error en createPagoPrestamo:", error);
        
        const status = error.message.includes('no encontrado') ? 404 : 400;
        res.status(status).json({ 
            error: 'Error al procesar el pago',
            details: error.message 
        });
    }
};

// Actualizar un pago de préstamo (con reversión del pago anterior)
const updatePagoPrestamo = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const { monto_pagado, id_prestamo, tipo_pago, observaciones } = req.body;

        // Obtener pago actual
        const pagoActual = await PagoPrestamo.findByPk(id, { transaction: t });
        if (!pagoActual) {
            await t.rollback();
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        // 1. Revertir el pago anterior en el préstamo
        await prestamosService.procesarPagoPrestamo(
            pagoActual.id_prestamo,
            -pagoActual.monto_pagado,
            'Reversión',
            null,
            t
        );

        // 2. Aplicar el nuevo pago (o el mismo si no cambió el monto)
        const nuevoMonto = monto_pagado || pagoActual.monto_pagado;
        const nuevoPrestamoId = id_prestamo || pagoActual.id_prestamo;
        
        const resultado = await prestamosService.procesarPagoPrestamo(
            nuevoPrestamoId,
            nuevoMonto,
            tipo_pago || pagoActual.tipo_pago,
            pagoActual.id_detalle_nomina,
            t
        );

        // 3. Actualizar el registro del pago
        const datosActualizacion = {
            monto_pagado: nuevoMonto,
            id_prestamo: nuevoPrestamoId,
            tipo_pago: tipo_pago || pagoActual.tipo_pago,
            observaciones: observaciones || pagoActual.observaciones
        };

        await pagoActual.update(datosActualizacion, { transaction: t });

        await t.commit();
        res.json({
            pago: pagoActual,
            prestamo: resultado.prestamo
        });
    } catch (error) {
        await t.rollback();
        console.error("Error en updatePagoPrestamo:", error);
        res.status(400).json({ 
            error: 'Error al actualizar el pago',
            details: error.message 
        });
    }
};

// Eliminar un pago de préstamo (con reversión)
const deletePagoPrestamo = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        
        const pago = await PagoPrestamo.findByPk(id, { transaction: t });
        if (!pago) {
            await t.rollback();
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        // Revertir el pago en el préstamo asociado
        await prestamosService.procesarPagoPrestamo(
            pago.id_prestamo,
            -pago.monto_pagado,
            'Reversión',
            null,
            t
        );

        // Eliminar el registro del pago
        await pago.destroy({ transaction: t });

        await t.commit();
        res.status(204).send();
    } catch (error) {
        await t.rollback();
        console.error("Error en deletePagoPrestamo:", error);
        res.status(400).json({ 
            error: 'Error al eliminar el pago',
            details: error.message 
        });
    }
};

// Obtener pagos por préstamo
const getPagosByPrestamo = async (req, res) => {
    try {
        const { id_prestamo } = req.params;
        
        const pagos = await PagoPrestamo.findAll({
            where: { id_prestamo },
            order: [['fecha_pago', 'DESC']],
            include: [
                { model: db.DetalleNomina, as: 'detalle_nomina_pago' }
            ]
        });
        
        res.json(pagos);
    } catch (error) {
        console.error("Error en getPagosByPrestamo:", error);
        res.status(500).json({ 
            error: 'Error al obtener los pagos del préstamo',
            details: error.message 
        });
    }
};

module.exports = {
    getAllPagosPrestamos,
    getPagoPrestamoById,
    createPagoPrestamo,
    updatePagoPrestamo,
    deletePagoPrestamo,
    getPagosByPrestamo
};