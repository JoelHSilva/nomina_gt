// controllers/horasExtras.controller.js
const db = require('../models');
const HoraExtra = db.HoraExtra;
const Empleado = db.Empleado; // Importar modelos asociados
const DetalleNomina = db.DetalleNomina;

// Obtener todas las horas extras (AHORA INCLUYE DATOS DEL EMPLEADO)
const getAllHorasExtras = async (req, res) => {
    try {
        const horasExtras = await HoraExtra.findAll({
             // --- MODIFICACIÓN CLAVE AQUÍ ---
             include: [
                 { model: Empleado, as: 'empleado' }, // <-- Descomentar y usar la inclusión con el alias 'empleado'
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina (ya estaba comentado, opcional incluir)
             ], 
             // --- FIN MODIFICACIÓN CLAVE ---
        });
        res.json(horasExtras);
    } catch (error) {
        console.error("Error en getAllHorasExtras:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una hora extra por ID (También incluye el empleado aquí)
const getHoraExtraById = async (req, res) => {
    try {
        const { id } = req.params;
        const horaExtra = await HoraExtra.findByPk(id, {
             // --- MODIFICACIÓN CLAVE AQUÍ ---
             include: [
                 { model: Empleado, as: 'empleado' }, // <-- Incluir también aquí
             //    { model: DetalleNomina, as: 'detalle_nomina_pago' } // Si se pagó en nómina (ya estaba comentado, opcional incluir)
             ]
             // --- FIN MODIFICACIÓN CLAVE ---
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

// Crear una nueva hora extra (sin cambios)
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

// Actualizar una hora extra por ID (sin cambios)
const updateHoraExtra = async (req, res) => { 
    try {
        const { id } = req.params;
        const [updated] = await HoraExtra.update(req.body, {
            where: { id_hora_extra: id }
        });
        if (updated) {
            const updatedHoraExtra = await HoraExtra.findByPk(id, {
                 // Si necesitas el empleado después de actualizar, inclúyelo aquí también
                 // include: [{ model: Empleado, as: 'empleado' }]
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

// Eliminar una hora extra por ID (sin cambios)
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
    getAllHorasExtras, // <-- Método modificado
    getHoraExtraById, // <-- Método modificado (opcionalmente)
    createHoraExtra,
    updateHoraExtra,
    deleteHoraExtra
};