// controllers/prestamos.controller.js
const db = require('../models');
// Importar el servicio de Préstamos
// Importar el servicio de Nominas si la función applyPayrollPayments está aquí
// const NominasService = require('../services/nominas.service'); // Si applyPayrollPayments vive aquí

// Instanciar el servicio
// Si applyPayrollPayments vive aquí y usa NominasService
// const nominasService = new NominasService();
const { prestamosService } = require('../services'); // Usa la instancia compartida

// --- Métodos CRUD básicos (pueden seguir interactuando con el modelo directamente si la lógica es simple) ---

// Obtener todos los prestamos
const getAllPrestamos = async (req, res) => {
    try {
        const prestamos = await db.Prestamo.findAll({
             include: [
                { model: db.Empleado, as: 'empleado' }, // Asegúrate de que el alias coincida con el modelo
                { model: db.PagoPrestamo, as: 'pagos' }, // Asegúrate de que el alias coincida con el modelo
             ] // Incluir relaciones si es necesario para la respuesta
        });
        res.json(prestamos);
    } catch (error) {
        console.error("Error en getAllPrestamos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un prestamo por ID
const getPrestamoById = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await db.Prestamo.findByPk(id, {
             include: [
                { model: db.Empleado, as: 'empleado' }, // Asegúrate de que el alias coincida con el modelo
                { model: db.PagoPrestamo, as: 'pagos' }, // Asegúrate de que el alias coincida con el modelo
             ] // Incluir relaciones si es necesario para la respuesta
        });
        if (prestamo) {
            res.json(prestamo);
        } else {
            res.status(404).json({ error: 'Préstamo no encontrado' });
        }
    } catch (error) {
        console.error("Error en getPrestamoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un prestamo por ID (Permite actualizar campos simples, lógica compleja vía servicio)
const updatePrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        // Considera qué campos *realmente* quieres permitir actualizar aquí (ej: estado, motivo)
        // La actualización de monto_total o saldo_pendiente debería ser manejada por métodos de servicio específicos (ej: abono extraordinario).
        const [updated] = await db.Prestamo.update(req.body, {
            where: { id_prestamo: id }
        });
        if (updated) {
            const updatedPrestamo = await db.Prestamo.findByPk(id, {
                 include: [
                    { model: db.Empleado, as: 'empleado' },
                    { model: db.PagoPrestamo, as: 'pagos' },
                 ]
            });
            res.json(updatedPrestamo);
        } else {
            res.status(404).json({ error: 'Préstamo no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updatePrestamo:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
              res.status(400).json({ error: error.errors.map(e => e.message) });
          } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un prestamo por ID (Ten cuidado con las restricciones de FK)
const deletePrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en PagosPrestamos (que referencia a Prestamo).
        // Si es RESTRICT (el default que pusimos en el modelo), no podrás eliminar un préstamo que tenga pagos asociados.
        const deleted = await db.Prestamo.destroy({
            where: { id_prestamo: id }
        });
        if (deleted) {
            res.status(204).send("Préstamo eliminado");
        } else {
            res.status(404).json({ error: 'Préstamo no encontrado' });
        }
    } catch (error) {
        console.error("Error en deletePrestamo:", error);
        res.status(500).json({ error: error.message }); // Puede dar error 500 si la restricción FK falla
    }
};


// --- Métodos que usan el Servicio de Préstamos para la lógica de negocio ---

// Crear un nuevo prestamo - Delega la lógica compleja al servicio
const createPrestamo = async (req, res) => {
    try {
        // El servicio maneja la validación de empleado, cálculo de cuota, inicialización de saldo, etc.
        const nuevoPrestamo = await prestamosService.crearPrestamo(req.body);
        // Opcional: Cargar el préstamo creado con relaciones para devolverlo completo
         const prestamoCompleto = await db.Prestamo.findByPk(nuevoPrestamo.id_prestamo, {
              include: [{ model: db.Empleado, as: 'empleado' }]
         });
        res.status(201).json(prestamoCompleto); // Devuelve el préstamo creado
    } catch (error) {
        console.error("Error en createPrestamo (Controller):", error);
         // Manejo específico de errores lanzados por el servicio
         if (error.message.includes('Empleado no encontrado')) {
             res.status(404).json({ error: error.message });
         } else if (error.message.includes('cantidad de cuotas debe ser mayor')) {
             res.status(400).json({ error: error.message });
         }
         else {
             // Captura otros errores (ej: validación de Sequelize si el servicio no la maneja completamente, errores de BD)
             if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
                  res.status(400).json({ error: error.errors.map(e => e.message) });
              } else {
                 // Errores generales o de lógica no previstos específicamente
                 res.status(400).json({ error: error.message }); // Usar 400 para problemas del cliente o 500 para problemas del servidor
             }
         }
    }
};

// Procesar un pago de préstamo (manual o via nómina) - Delega la lógica al servicio
const processLoanPayment = async (req, res) => {
    try {
        const { id } = req.params; // ID del Préstamo
        const { monto_pagado, tipo_pago, id_detalle_nomina } = req.body; // Datos del pago

        if (monto_pagado === undefined || monto_pagado <= 0) {
             return res.status(400).json({ error: 'El monto pagado debe ser mayor a cero.' });
        }
         if (!tipo_pago || !['Nómina', 'Manual'].includes(tipo_pago)) {
              return res.status(400).json({ error: 'Tipo de pago inválido. Debe ser "Nómina" o "Manual".' });
         }
         if (tipo_pago === 'Nómina' && !id_detalle_nomina) {
              return res.status(400).json({ error: 'id_detalle_nomina es requerido para tipo de pago "Nómina".' });
         }
         if (tipo_pago === 'Manual' && id_detalle_nomina) {
               return res.status(400).json({ error: 'id_detalle_nomina no es requerido para tipo de pago "Manual".' });
         }


        // Delega el procesamiento del pago y la actualización del préstamo al servicio
        const result = await prestamosService.procesarPagoPrestamo(
            id, // ID del Préstamo
            parseFloat(monto_pagado), // Asegura que el monto es un número
            tipo_pago,
            id_detalle_nomina
        );

        res.json(result); // Devuelve el registro del pago y el préstamo actualizado

    } catch (error) {
        console.error("Error en processLoanPayment (Controller):", error);
         // Manejo específico de errores lanzados por el servicio
         if (error.message.includes('Préstamo no encontrado')) {
             res.status(404).json({ error: error.message });
         } else if (error.message.includes('Este préstamo ya está pagado') || error.message.includes('Datos de pago incompletos')) { // Agrega manejo de otros errores del servicio
             res.status(400).json({ error: error.message });
         }
         else {
             // Captura otros errores (ej: validación de Sequelize, errores de BD)
             if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                  res.status(400).json({ error: error.errors.map(e => e.message) });
              } else {
                 res.status(500).json({ error: error.message }); // Usa 500 para errores del servidor
             }
         }
    }
};

// --- Función para aplicar pagos de préstamos desde una nómina (puede estar aquí o en nomina.controller) ---
// Si esta función está aquí, necesitará acceder a NominasService.
// Si está en nomina.controller, NominasService podría llamar a PrestamosService.
// La segunda opción (NominasService llama a PrestamosService) es generalmente mejor para mantener la lógica relacionada con Nómina en NominasService.
// Por ahora, dejo el placeholder y la lógica en NominasService como discutimos.

// const applyPayrollPayments = async (req, res) => {
//     // Lógica para aplicar pagos de préstamos de una nómina específica
//     // ... llamar a NominasService o PrestamosService ...
// };


module.exports = {
    getAllPrestamos,
    getPrestamoById,
    createPrestamo, // Usa servicio
    updatePrestamo, // CRUD básico
    deletePrestamo, // CRUD básico
    processLoanPayment, // Usa servicio
    // applyPayrollPayments // Si decides implementarlo aquí
};