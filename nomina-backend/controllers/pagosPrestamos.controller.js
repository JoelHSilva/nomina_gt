// controllers/pagosPrestamos.controller.js
const db = require('../models');
const PagoPrestamo = db.PagoPrestamo;
const Prestamo = db.Prestamo; // Importar modelos asociados si se usan en includes
const DetalleNomina = db.DetalleNomina; // Importar modelos asociados si se usan en includes

// Obtener todos los pagos de prestamos (AHORA CON FILTRO OPCIONAL POR id_prestamo)
const getAllPagosPrestamos = async (req, res) => {
    try {
        // --- INICIO: Lógica de Filtrado ---
        // 1. Leer el parámetro id_prestamo desde los query parameters de la solicitud (ej: /pagos?id_prestamo=123)
        const { id_prestamo } = req.query;

        // 2. Crear un objeto vacío para la condición de filtro de Sequelize
        const whereCondition = {};
        
        // 3. Si el parámetro id_prestamo existe en la solicitud, añadirlo a la condición
        if (id_prestamo) {
            // Asegúrate de que el nombre de la columna en tu modelo PagoPrestamo es 'id_prestamo'
            whereCondition.id_prestamo = id_prestamo; 
        }
        // --- FIN: Lógica de Filtrado ---

        // 4. Realizar la consulta a la base de datos, aplicando la condición de filtro
        const pagos = await PagoPrestamo.findAll({
            where: whereCondition, // <-- ¡Aplicamos la condición aquí!
            // include: [
            //    { model: Prestamo, as: 'prestamo' }, // Puedes descomentar si necesitas datos del préstamo
            //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Puedes descomentar si necesitas datos del detalle nómina
            // ] 
             order: [['fecha_pago', 'ASC']] // Opcional: ordenar pagos
        });
        res.json(pagos);
    } catch (error) {
        console.error("Error en getAllPagosPrestamos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un pago de prestamo por ID (Este método no necesita el filtro por loanId, es solo para un pago específico)
const getPagoPrestamoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await PagoPrestamo.findByPk(id, {
             // include: [
             //    { model: Prestamo, as: 'prestamo' },
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' }
             // ]
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
// Nota: Este controlador `createPagoPrestamo` *directamente* crea un registro de pago.
// Si el registro de pago debe actualizar el saldo del préstamo asociado,
// es mejor usar el endpoint `processLoanPayment` que configuraste previamente,
// el cual llama al servicio `procesarPagoPrestamo` que SÍ tiene esa lógica.
// Asegúrate de usar el endpoint correcto desde el frontend para registrar pagos.
const createPagoPrestamo = async (req, res) => {
    try {
        const nuevoPago = await PagoPrestamo.create(req.body);
        // Considera si necesitas devolver el préstamo actualizado o el pago completo con relaciones
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
// Si habilitas esto, considera seriamente usar un servicio para manejar la lógica de
// reversión/ajuste del saldo del préstamo.
const updatePagoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await PagoPrestamo.update(req.body, {
            where: { id_pago: id }
        });
        if (updated) {
            const updatedPago = await PagoPrestamo.findByPk(id, {
                 // include: [...]
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
// Si habilitas esto, considera seriamente usar un servicio para manejar la lógica de
// reversión del saldo del préstamo.
const deletePagoPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
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
    getAllPagosPrestamos, // <-- Este es el método modificado
    getPagoPrestamoById,
    createPagoPrestamo,
    updatePagoPrestamo, 
    deletePagoPrestamo 
};