// controllers/pagosPrestamos.controller.js
const db = require('../models');
const PagoPrestamo = db.PagoPrestamo;
const Prestamo = db.Prestamo; // Importar modelos asociados si se usan en includes
const DetalleNomina = db.DetalleNomina;

// Obtener todos los pagos de prestamos
const getAllPagosPrestamos = async (req, res) => {
    try {
        const pagos = await PagoPrestamo.findAll({
             // include: [
             //    { model: Prestamo, as: 'prestamo' },
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina
             // ] // Incluir relaciones si es necesario
        });
        res.json(pagos);
    } catch (error) {
        console.error("Error en getAllPagosPrestamos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un pago de prestamo por ID
const getPagoPrestamoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await PagoPrestamo.findByPk(id, {
             // include: [
             //    { model: Prestamo, as: 'prestamo' },
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina
             // ] // Incluir relaciones si es necesario
        });
        if (pago) {
            res.json(pago);
        } else {
            res.status(404).json({ error: 'Pago de Prestamo no encontrado' });
        }
    } catch (error) {
        console.error("Error en getPagoPrestamoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo pago de prestamo
// Nota: La creación de pagos de préstamo puede tener lógica asociada (actualizar saldo en Prestamo)
const createPagoPrestamo = async (req, res) => {
    try {
        // Aquí podrías tener lógica para actualizar el saldo en la tabla `prestamos`
        const nuevoPago = await PagoPrestamo.create(req.body);
        res.status(201).json(nuevoPago);
    } catch (error) {
        console.error("Error en createPagoPrestamo:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un pago de prestamo por ID (puede ser sensible actualizar pagos existentes)
const updatePagoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        // Considera la lógica de actualización del saldo del préstamo si cambias el monto
        const [updated] = await PagoPrestamo.update(req.body, {
            where: { id_pago: id }
        });
        if (updated) {
            const updatedPago = await PagoPrestamo.findByPk(id, {
                 // include: [
                 //    { model: Prestamo, as: 'prestamo' },
                 //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedPago);
        } else {
            res.status(404).json({ error: 'Pago de Prestamo no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updatePagoPrestamo:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un pago de prestamo por ID (puede ser sensible eliminar pagos existentes)
const deletePagoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        // Considera la lógica de reversión del saldo en la tabla `prestamos`
        const deleted = await PagoPrestamo.destroy({
            where: { id_pago: id }
        });
        if (deleted) {
            res.status(204).send("Pago de Prestamo eliminado");
        } else {
            res.status(404).json({ error: 'Pago de Prestamo no encontrado' });
        }
    } catch (error) {
        console.error("Error en deletePagoPrestamo:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPagosPrestamos,
    getPagoPrestamoById,
    createPagoPrestamo,
    updatePagoPrestamo, // Considera si habilitas
    deletePagoPrestamo // Considera si habilitas
};