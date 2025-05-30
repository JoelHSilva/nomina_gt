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


// Obtener todos los detalles de nómina (ahora con relaciones Y FILTRO OPCIONAL por id_nomina y búsqueda)
const getAllDetalleNomina = async (req, res) => {
    try {
        // Objeto para construir la condición WHERE dinámicamente
        const whereCondition = {};

        // --- AQUI ESTA LA CLAVE DE LA CORRECCIÓN ---
        // Verifica si el query parameter 'id_nomina' está presente en la petición (ej: ?id_nomina=10)
        // Si existe, añade la condición para filtrar por ese id_nomina
        if (req.query.id_nomina) {
            // Añade la condición id_nomina al objeto WHERE
            // Sequelize automáticamente maneja la conversión de tipo si el modelo está bien definido
            whereCondition.id_nomina = req.query.id_nomina;
        }
        // ---------------------------------------------

        // Implementación de filtro por searchTerm (Opcional, si tu frontend lo usa en esta página)
        // Si quieres que la búsqueda en el frontend de la página de detalle de nómina
        // filtre los detalles de empleado mostrados, debes añadir lógica aquí.
        // Esto requiere que la búsqueda se envíe a este endpoint con un query param 'search'
        // Asegúrate de que las relaciones en 'include' están definidas correctamente para usar $alias.campo$
        // if (req.query.search) {
        //     const searchTerm = req.query.search.toLowerCase();
        //     // Define en qué campos buscar dentro del DetalleNomina o sus relaciones incluidas
        //     whereCondition[Op.or] = [
        //         // Ejemplo: buscar en el nombre o apellido del empleado relacionado
        //         // '$empleado.nombre$' asume que 'empleado' es el alias de la relación Empleado
        //         { '$empleado.nombre$': { [Op.like]: `%${searchTerm}%` } },
        //         { '$empleado.apellido$': { [Op.like]: `%${searchTerm}%` } },
        //         // Ejemplo: buscar en observaciones del detalle
        //         { observaciones: { [Op.like]: `%${searchTerm}%` } },
        //         // ... otros campos relevantes en DetalleNomina o relaciones incluidas
        //     ];
        //     // Si usas búsqueda en relaciones ($alias.campo$), usualmente necesitas subQuery: false en findAll opciones
        // }


        // Consulta a la base de datos usando el modelo DetalleNomina
        const detalles = await DetalleNomina.findAll({
            where: whereCondition, // <-- Aplica el filtro (puede estar vacío si no se envió id_nomina)
            include: [
                { model: Nomina, as: 'nomina' }, // Incluir la nómina principal (opcional si no necesitas sus datos en cada detalle)
                { model: Empleado, as: 'empleado' }, // ¡Clave para anidar el empleado!
                // Asegúrate de que estas relaciones están definidas en tus modelos para DetalleNomina
                { model: ConceptoAplicado, as: 'conceptos_aplicados' },
                { model: PagoPrestamo, as: 'pagos_prestamo_asociados' }, // Asegúrate de que esta relación existe y tiene alias
                { model: HoraExtra, as: 'horas_extras_pagadas' }, // Asegúrate de que esta relación existe y tiene alias
                { model: LiquidacionViatico, as: 'liquidacion_viatico_incluida' }, // Asegúrate de que esta relación existe y tiene alias
            ],
            // subQuery: false, // Descomentar si usas búsqueda en relaciones ($alias.campo$) o ciertas configuraciones de include/limit
            // order: [['campo', 'ASC']], // Opcional: ordenar los resultados
            // limit: 10, // Opcional: paginación
            // offset: 0, // Opcional: paginación
        });

        res.json(detalles); // Envía los detalles filtrados (o todos si no se envió id_nomina)

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
                {
                    model: Nomina,
                    as: 'nomina',
                    include: [
                        { model: db.PeriodoPago, as: 'periodo_pago' }
                    ]
                },
                {
                    model: Empleado,
                    as: 'empleado',
                    include: [
                        { model: db.Puesto, as: 'puesto' }
                    ]
                },
                {
                    model: ConceptoAplicado,
                    as: 'conceptos_aplicados',
                    include: [
                        { model: db.ConceptoPago, as: 'concepto_pago' }
                    ]
                },
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