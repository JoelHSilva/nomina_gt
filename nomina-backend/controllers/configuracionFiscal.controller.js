// controllers/configuracionFiscal.controller.js
const db = require('../models');
const ConfiguracionFiscal = db.ConfiguracionFiscal;
// Importar modelos asociados si se usan en includes

// Obtener todas las configuraciones fiscales
const getAllConfiguracionFiscal = async (req, res) => {
    try {
        const configs = await ConfiguracionFiscal.findAll({
             // include: [] // Incluir relaciones si es necesario
        });
        res.json(configs);
    } catch (error) {
        console.error("Error en getAllConfiguracionFiscal:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una configuración fiscal por ID
const getConfiguracionFiscalById = async (req, res) => {
    try {
        const { id } = req.params;
        const config = await ConfiguracionFiscal.findByPk(id, {
             // include: [] // Incluir relaciones si es necesario
        });
        if (config) {
            res.json(config);
        } else {
            res.status(404).json({ error: 'Configuración Fiscal no encontrada' });
        }
    } catch (error) {
        console.error("Error en getConfiguracionFiscalById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva configuración fiscal
const createConfiguracionFiscal = async (req, res) => {
    try {
        const nuevaConfig = await ConfiguracionFiscal.create(req.body);
        res.status(201).json(nuevaConfig);
    } catch (error) {
        console.error("Error en createConfiguracionFiscal:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una configuración fiscal por ID
const updateConfiguracionFiscal = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ConfiguracionFiscal.update(req.body, {
            where: { id_configuracion: id }
        });
        if (updated) {
            const updatedConfig = await ConfiguracionFiscal.findByPk(id, {
                 // include: [] // Incluir relaciones si es necesario
            });
            res.json(updatedConfig);
        } else {
            res.status(404).json({ error: 'Configuración Fiscal no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateConfiguracionFiscal:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una configuración fiscal por ID
const deleteConfiguracionFiscal = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ConfiguracionFiscal.destroy({
            where: { id_configuracion: id }
        });
        if (deleted) {
            res.status(204).send("Configuración Fiscal eliminada");
        } else {
            res.status(404).json({ error: 'Configuración Fiscal no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteConfiguracionFiscal:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllConfiguracionFiscal,
    getConfiguracionFiscalById,
    createConfiguracionFiscal,
    updateConfiguracionFiscal,
    deleteConfiguracionFiscal
};