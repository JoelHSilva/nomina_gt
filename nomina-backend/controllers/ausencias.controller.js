// controllers/ausencias.controller.js
const db = require('../models');
const Ausencia = db.Ausencia;
const Empleado = db.Empleado; // Importar modelos asociados
const LogSistema = db.LogSistema;

// Función auxiliar para crear logs
const crearLog = async (accion, tabla, idRegistro, datosAnteriores, datosNuevos, req) => {
    try {
        // Si es un cambio de estado, modificar la acción para ser más específica
        if (datosAnteriores && datosNuevos && 
            datosAnteriores.estado !== datosNuevos.estado) {
            accion = `CAMBIAR ESTADO AUSENCIA: ${datosAnteriores.estado} -> ${datosNuevos.estado}`;
        }

        await LogSistema.create({
            id_usuario: req.user ? req.user.id_usuario : null,
            accion: accion,
            tabla_afectada: tabla,
            id_registro: idRegistro,
            datos_anteriores: datosAnteriores ? JSON.stringify(datosAnteriores) : null,
            datos_nuevos: datosNuevos ? JSON.stringify(datosNuevos) : null,
            direccion_ip: req.ip
        });
    } catch (error) {
        console.error("Error al crear log:", error);
        // No lanzamos el error para no interrumpir la operación principal
    }
};

// Obtener todas las ausencias (AHORA INCLUYE DATOS DEL EMPLEADO)
const getAllAusencias = async (req, res) => {
    try {
        const ausencias = await Ausencia.findAll({
            include: [{ model: Empleado, as: 'empleado' }]
        });
        res.json(ausencias);
    } catch (error) {
        console.error("Error en getAllAusencias:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una ausencia por ID (También incluye el empleado aquí)
const getAusenciaById = async (req, res) => {
    try {
        const { id } = req.params;
        const ausencia = await Ausencia.findByPk(id, {
            include: [{ model: Empleado, as: 'empleado' }]
        });
        if (ausencia) {
            res.json(ausencia);
        } else {
            res.status(404).json({ error: 'Ausencia no encontrada' });
        }
    } catch (error) {
        console.error("Error en getAusenciaById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva ausencia (sin cambios)
const createAusencia = async (req, res) => { 
    try {
        const nuevaAusencia = await Ausencia.create(req.body);
        
        // Crear log de la creación
        await crearLog(
            'CREAR AUSENCIA',
            'ausencias',
            nuevaAusencia.id_ausencia,
            null,
            nuevaAusencia,
            req
        );

        res.status(201).json(nuevaAusencia);
    } catch (error) {
        console.error("Error en createAusencia:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar una ausencia por ID
const updateAusencia = async (req, res) => { 
    try {
        const { id } = req.params;
        
        // Obtener datos anteriores antes de actualizar
        const ausenciaAnterior = await Ausencia.findByPk(id, {
            include: [{ model: Empleado, as: 'empleado' }]
        });
        if (!ausenciaAnterior) {
            return res.status(404).json({ error: 'Ausencia no encontrada' });
        }

        // Verificar si es un cambio de estado
        const esCambioEstado = req.body.estado && req.body.estado !== ausenciaAnterior.estado;
        
        // Si es un cambio de estado, validar la transición
        if (esCambioEstado) {
            const estadosValidos = {
                'Solicitada': ['Aprobada', 'Rechazada'],
                'Aprobada': ['Completada'],
                'Rechazada': [], // No se puede cambiar desde Rechazada
                'Completada': [] // No se puede cambiar desde Completada
            };

            const estadosPermitidos = estadosValidos[ausenciaAnterior.estado] || [];
            if (!estadosPermitidos.includes(req.body.estado)) {
                return res.status(400).json({ 
                    error: `No se puede cambiar el estado de "${ausenciaAnterior.estado}" a "${req.body.estado}". Estados permitidos: ${estadosPermitidos.join(', ')}` 
                });
            }
        }

        const [updated] = await Ausencia.update(req.body, {
            where: { id_ausencia: id }
        });

        if (updated) {
            const updatedAusencia = await Ausencia.findByPk(id, {
                include: [{ model: Empleado, as: 'empleado' }]
            });

            // Crear log de la actualización
            await crearLog(
                esCambioEstado ? 'CAMBIAR ESTADO AUSENCIA' : 'ACTUALIZAR AUSENCIA',
                'ausencias',
                id,
                ausenciaAnterior,
                updatedAusencia,
                req
            );

            res.json(updatedAusencia);
        } else {
            res.status(404).json({ error: 'Ausencia no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateAusencia:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una ausencia por ID (sin cambios)
const deleteAusencia = async (req, res) => { 
    try {
        const { id } = req.params;
        
        // Obtener datos antes de eliminar
        const ausenciaAEliminar = await Ausencia.findByPk(id);
        if (!ausenciaAEliminar) {
            return res.status(404).json({ error: 'Ausencia no encontrada' });
        }

        const deleted = await Ausencia.destroy({
            where: { id_ausencia: id }
        });

        if (deleted) {
            // Crear log de la eliminación
            await crearLog(
                'ELIMINAR AUSENCIA',
                'ausencias',
                id,
                ausenciaAEliminar,
                null,
                req
            );

            res.status(204).send("Ausencia eliminada");
        } else {
            res.status(404).json({ error: 'Ausencia no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteAusencia:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAusencias, // <-- Método modificado
    getAusenciaById, // <-- Método modificado
    createAusencia,
    updateAusencia,
    deleteAusencia
};