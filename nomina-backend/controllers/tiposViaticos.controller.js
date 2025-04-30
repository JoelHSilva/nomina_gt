// controllers/tiposViaticos.controller.js
const db = require('../models');
const TipoViatico = db.TipoViatico;
const DetalleSolicitudViatico = db.DetalleSolicitudViatico; // Importar modelos asociados si se usan en includes
const TarifaDestino = db.TarifaDestino;
const PoliticaViaticoPuesto = db.PoliticaViaticoPuesto;
const DetalleLiquidacionViatico = db.DetalleLiquidacionViatico;

// Obtener todos los tipos de viaticos
const getAllTiposViaticos = async (req, res) => {
    try {
        const tipos = await TipoViatico.findAll({
             // include: [
             //     { model: DetalleSolicitudViatico, as: 'detalles_solicitud' },
             //     { model: TarifaDestino, as: 'tarifas_destino' },
             //     { model: PoliticaViaticoPuesto, as: 'politicas_puesto' },
             //     { model: DetalleLiquidacionViatico, as: 'detalles_liquidacion' },
             // ] // Incluir relaciones si es necesario
        });
        res.json(tipos);
    } catch (error) {
        console.error("Error en getAllTiposViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un tipo de viatico por ID
const getTipoViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await TipoViatico.findByPk(id, {
             // include: [
             //     { model: DetalleSolicitudViatico, as: 'detalles_solicitud' },
             //     { model: TarifaDestino, as: 'tarifas_destino' },
             //     { model: PoliticaViaticoPuesto, as: 'politicas_puesto' },
             //     { model: DetalleLiquidacionViatico, as: 'detalles_liquidacion' },
             // ] // Incluir relaciones si es necesario
        });
        if (tipo) {
            res.json(tipo);
        } else {
            res.status(404).json({ error: 'Tipo de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en getTipoViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo tipo de viatico
const createTipoViatico = async (req, res) => {
    try {
        const nuevoTipo = await TipoViatico.create(req.body);
        res.status(201).json(nuevoTipo);
    } catch (error) {
        console.error("Error en createTipoViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un tipo de viatico por ID
const updateTipoViatico = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await TipoViatico.update(req.body, {
            where: { id_tipo_viatico: id }
        });
        if (updated) {
            const updatedTipo = await TipoViatico.findByPk(id, {
                 // include: [
                 //     { model: DetalleSolicitudViatico, as: 'detalles_solicitud' },
                 //     { model: TarifaDestino, as: 'tarifas_destino' },
                 //     { model: PoliticaViaticoPuesto, as: 'politicas_puesto' },
                 //     { model: DetalleLiquidacionViatico, as: 'detalles_liquidacion' },
                 // ] // Incluir relaciones si es necesario
            });
            res.json(updatedTipo);
        } else {
            res.status(404).json({ error: 'Tipo de Viatico no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateTipoViatico:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un tipo de viatico por ID
const deleteTipoViatico = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este (DetalleSolicitudViatico, TarifaDestino, PoliticaViaticoPuesto, DetalleLiquidacionViatico).
        const deleted = await TipoViatico.destroy({
            where: { id_tipo_viatico: id }
        });
        if (deleted) {
            res.status(204).send("Tipo de Viatico eliminado");
        } else {
            res.status(404).json({ error: 'Tipo de Viatico no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteTipoViatico:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTiposViaticos,
    getTipoViaticoById,
    createTipoViatico,
    updateTipoViatico,
    deleteTipoViatico
};