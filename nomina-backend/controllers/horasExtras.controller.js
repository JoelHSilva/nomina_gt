// controllers/horasExtras.controller.js
const db = require('../models');
const HoraExtra = db.HoraExtra;
const Empleado = db.Empleado; // Importar modelos asociados si se usan en includes
const DetalleNomina = db.DetalleNomina;

// Obtener todas las horas extras
const getAllHorasExtras = async (req, res) => {
    try {
        const horasExtras = await HoraExtra.findAll({
             // include: [
             //    { model: Empleado, as: 'empleado' },
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina
             // ] // Incluir relaciones si es necesario
        });
        res.json(horasExtras);
    } catch (error) {
        console.error("Error en getAllHorasExtras:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una hora extra por ID
const getHoraExtraById = async (req, res) => {
    try {
        const { id } = req.params;
        const horaExtra = await HoraExtra.findByPk(id, {
             // include: [
             //    { model: Empleado, as: 'empleado' },
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina
             // ] // Incluir relaciones si es necesario
        });
        if (horaExtra) {
            res.json(horaExtra);
        } else {
            res.status(404).json({ error: 'Hora Extra no encontrada' });
        }
    } catch (error) {
        console.error("Error en getHoraExtraById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva hora extra
const createHoraExtra = async (req, res) => {
    try {
        const nuevaHoraExtra = await HoraExtra.create(req.body);
        res.status(201).json(nuevaHoraExtra);
    } catch (error) {
        console.error("Error en createHoraExtra:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una hora extra por ID
const updateHoraExtra = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await HoraExtra.update(req.body, {
            where: { id_hora_extra: id }
        });
        if (updated) {
            const updatedHoraExtra = await HoraExtra.findByPk(id, {
                 // include: [
                 //    { model: Empleado, as: 'empleado' },
                 //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedHoraExtra);
        } else {
            res.status(404).json({ error: 'Hora Extra no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateHoraExtra:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una hora extra por ID
const deleteHoraExtra = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await HoraExtra.destroy({
            where: { id_hora_extra: id }
        });
        if (deleted) {
            res.status(204).send("Hora Extra eliminada");
        } else {
            res.status(404).json({ error: 'Hora Extra no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteHoraExtra:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllHorasExtras,
    getHoraExtraById,
    createHoraExtra,
    updateHoraExtra,
    deleteHoraExtra
};