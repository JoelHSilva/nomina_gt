// controllers/detalleSolicitudViaticos.controller.js
const db = require('../models');
const DetalleSolicitudViatico = db.DetalleSolicitudViatico;
const SolicitudViatico = db.SolicitudViatico; // Importar modelos asociados si se usan en includes
const TipoViatico = db.TipoViatico;

// Obtener todos los detalles de solicitud de viaticos
const getAllDetalleSolicitudViaticos = async (req, res) => {
    try {
        const detalles = await DetalleSolicitudViatico.findAll({
             // include: [
             //     { model: SolicitudViatico, as: 'solicitud_viatico' },
             //     { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        res.json(detalles);
    } catch (error) {
        console.error("Error en getAllDetalleSolicitudViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un detalle de solicitud de viatico por ID
const getDetalleSolicitudViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleSolicitudViatico.findByPk(id, {
             // include: [
             //     { model: SolicitudViatico, as: 'solicitud_viatico' },
             //     { model: TipoViatico, as: 'tipo_viatico' }
             // ] // Incluir relaciones si es necesario
        });
        if (detalle) {
            res.json(detalle);
        } else {
            res.status(404).json({ error: 'Detalle de Solicitud de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDetalleSolicitudViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo detalle de solicitud de viatico
const createDetalleSolicitudViatico = async (req, res) => {
    try {
        const nuevoDetalle = await DetalleSolicitudViatico.create(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        console.error("Error en createDetalleSolicitudViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un detalle de solicitud de viatico por ID
const updateDetalleSolicitudViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await DetalleSolicitudViatico.update(req.body, {
            where: { id_detalle: id }
        });
        if (updated) {
            const updatedDetalle = await DetalleSolicitudViatico.findByPk(id, {
                 // include: [
                 //     { model: SolicitudViatico, as: 'solicitud_viatico' },
                 //     { model: TipoViatico, as: 'tipo_viatico' }
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedDetalle);
        } else {
            res.status(404).json({ error: 'Detalle de Solicitud de Viatico no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateDetalleSolicitudViatico:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un detalle de solicitud de viatico por ID
const deleteDetalleSolicitudViatico = async (req, res) => {
    try {
        const { id } = req.params;
        // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este.
        const deleted = await DetalleSolicitudViatico.destroy({
            where: { id_detalle: id }
        });
        if (deleted) {
            res.status(204).send("Detalle de Solicitud de Viatico eliminado");
        } else {
            res.status(404).json({ error: 'Detalle de Solicitud de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteDetalleSolicitudViatico:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDetalleSolicitudViaticos,
    getDetalleSolicitudViaticoById,
    createDetalleSolicitudViatico,
    updateDetalleSolicitudViatico,
    deleteDetalleSolicitudViatico
};