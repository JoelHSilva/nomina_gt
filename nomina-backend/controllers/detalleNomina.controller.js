// controllers/detalleNomina.controller.js
const db = require('../models');
const DetalleNomina = db.DetalleNomina;
const Nomina = db.Nomina; // Asegúrate de que este modelo está definido y relacionado si lo incluyes
const Empleado = db.Empleado; // Asegúrate de que este modelo está definido y relacionado
const ConceptoAplicado = db.ConceptoAplicado; // Asegúrate de que este modelo está definido y relacionado
const PagoPrestamo = db.PagoPrestamo; // Asegúrate de que este modelo está definido y relacionado
const HoraExtra = db.HoraExtra; // Asegúrate de que este modelo está definido y relacionado
const LiquidacionViatico = db.LiquidacionViatico; // Asegúrate de que este modelo está definido y relacionado
const { Op } = db.Sequelize; // Importa Op para usar operadores de Sequelize (AND, OR, LIKE, etc.)


// Obtener todos los detalles de nómina (con relaciones y filtro opcional por id_nomina)
const getAllDetalleNomina = async (req, res) => {
    try {
        // Objeto para construir la condición WHERE dinámicamente
        const whereCondition = {};

        // Verifica si el query parameter 'id_nomina' está presente
        if (req.query.id_nomina) {
            whereCondition.id_nomina = req.query.id_nomina;
        }

        // Consulta a la base de datos usando el modelo DetalleNomina
        const detalles = await DetalleNomina.findAll({
            where: whereCondition,
            include: [
                { model: Nomina, as: 'nomina' },
                { 
                    model: Empleado, 
                    as: 'empleado',
                    include: [
                        { model: db.Puesto, as: 'puesto', include: [{ model: db.Departamento, as: 'departamento' }] }
                    ]
                },
                { model: ConceptoAplicado, as: 'conceptos_aplicados' },
                { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
                { model: HoraExtra, as: 'horas_extras_pagadas' },
                { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' }
            ],
            order: [['id_detalle', 'ASC']]
        });

        res.json(detalles);
    } catch (error) {
        console.error("Error en getAllDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};


// Obtener un detalle por ID (con relaciones)
const getDetalleNominaById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleNomina.findByPk(id, {
            include: [
                { model: Nomina, as: 'nomina' },
                { model: Empleado, as: 'empleado' }, // ¡Clave para anidar el empleado!
                // Opcional: Otras relaciones si las necesitas al obtener un solo detalle
                { model: ConceptoAplicado, as: 'conceptos_aplicados' },
                { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
                { model: HoraExtra, as: 'horas_extras_pagadas' },
                { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
            ]
        });
        if (detalle) {
            res.json(detalle);
        } else {
            res.status(404).json({ error: 'Detalle no encontrado' });
        }
    } catch (error) {
        console.error("Error en getDetalleNominaById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo detalle (sin cambios aquí)
const createDetalleNomina = async (req, res) => {
    try {
        const nuevoDetalle = await DetalleNomina.create(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        console.error("Error en createDetalleNomina:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un detalle (ahora devuelve el objeto actualizado con relaciones)
const updateDetalleNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await DetalleNomina.update(req.body, {
            where: { id_detalle: id }
        });
        if (updated) {
            const updatedDetalle = await DetalleNomina.findByPk(id, {
                include: [
                    { model: Nomina, as: 'nomina' },
                    { model: Empleado, as: 'empleado' },
                    // Incluir otras relaciones si es necesario después de actualizar
                    { model: ConceptoAplicado, as: 'conceptos_aplicados' },
                    { model: PagoPrestamo, as: 'pagos_prestamo_asociados' },
                    { model: HoraExtra, as: 'horas_extras_pagadas' },
                    { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
                ]
            });
            res.json(updatedDetalle); // Devuelve el detalle con relaciones
        } else {
            res.status(404).json({ error: 'Detalle no encontrado o sin cambios' });
        }
    } catch (error) {
        console.error("Error en updateDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un detalle (sin cambios aquí)
const deleteDetalleNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await DetalleNomina.destroy({
            where: { id_detalle: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Detalle no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteDetalleNomina:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDetalleNomina,
    getDetalleNominaById,
    createDetalleNomina,
    updateDetalleNomina,
    deleteDetalleNomina
};