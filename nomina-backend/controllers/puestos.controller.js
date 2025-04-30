// controllers/puestos.controller.js
const db = require('../models');
const Puesto = db.Puesto;
const Departamento = db.Departamento; // Importar modelos asociados si se usan en includes
const Empleado = db.Empleado; // Para hasMany
const PoliticaViaticoPuesto = db.PoliticaViaticoPuesto; // Para hasMany

// Obtener todos los puestos
const getAllPuestos = async (req, res) => {
    try {
        const puestos = await Puesto.findAll({
             include: [
                 { model: Departamento, as: 'departamento' },
                 // { model: Empleado, as: 'empleados' }, // Incluir empleados si es necesario
                 // { model: PoliticaViaticoPuesto, as: 'politicas_viaticos' }, // Incluir políticas si es necesario
             ]
        });
        res.json(puestos);
    } catch (error) {
        console.error("Error en getAllPuestos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un puesto por ID
const getPuestoById = async (req, res) => {
    try {
        const { id } = req.params;
        const puesto = await Puesto.findByPk(id, {
             include: [
                 { model: Departamento, as: 'departamento' },
                 // { model: Empleado, as: 'empleados' }, // Incluir empleados si es necesario
                 // { model: PoliticaViaticoPuesto, as: 'politicas_viaticos' }, // Incluir políticas si es necesario
             ]
        });
        if (puesto) {
            res.json(puesto);
        } else {
            res.status(404).json({ error: 'Puesto no encontrado' });
        }
    } catch (error) {
        console.error("Error en getPuestoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo puesto
const createPuesto = async (req, res) => {
    try {
        const nuevoPuesto = await Puesto.create(req.body);
        res.status(201).json(nuevoPuesto);
    } catch (error) {
        console.error("Error en createPuesto:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un puesto por ID
const updatePuesto = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Puesto.update(req.body, {
            where: { id_puesto: id }
        });
        if (updated) {
            const updatedPuesto = await Puesto.findByPk(id, {
                 include: [
                     { model: Departamento, as: 'departamento' },
                     // { model: Empleado, as: 'empleados' }, // Incluir empleados si es necesario
                     // { model: PoliticaViaticoPuesto, as: 'politicas_viaticos' }, // Incluir políticas si es necesario
                 ]
            });
            res.json(updatedPuesto);
        } else {
            res.status(404).json({ error: 'Puesto no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updatePuesto:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un puesto por ID
const deletePuesto = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en Empleado y PoliticaViaticoPuesto (que referencian a Puesto).
         // Si es RESTRICT (el default que pusimos), no podrás eliminar un puesto que tenga empleados o políticas asociadas.
        const deleted = await Puesto.destroy({
            where: { id_puesto: id }
        });
        if (deleted) {
            res.status(204).send("Puesto eliminado");
        } else {
            res.status(404).json({ error: 'Puesto no encontrado' });
        }
    } catch (error) {
        console.error("Error en deletePuesto:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPuestos,
    getPuestoById,
    createPuesto,
    updatePuesto,
    deletePuesto
};