// controllers/empleados.controller.js
const { Empleado, Puesto, Departamento } = require('../models');

// Obtener todos los empleados
const getAllEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll({
            include: [
                {
                    model: Puesto,
                    as: 'puesto',
                    include: [
                        {
                            model: Departamento,
                            as: 'departamento'
                        }
                    ]
                }
            ]
        });
        res.json(empleados);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ 
            message: 'Error al obtener empleados',
            error: error.message 
        });
    }
};

// Obtener un empleado por ID
const getEmpleadoById = async (req, res) => {
    try {
        const empleado = await Empleado.findByPk(req.params.id, {
            include: [
                {
                    model: Puesto,
                    as: 'puesto',
                    include: [
                        {
                            model: Departamento,
                            as: 'departamento'
                        }
                    ]
                }
            ]
        });
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        res.json(empleado);
    } catch (error) {
        console.error('Error al obtener empleado:', error);
        res.status(500).json({ 
            message: 'Error al obtener empleado',
            error: error.message 
        });
    }
};

// Crear un nuevo empleado
const createEmpleado = async (req, res) => {
    try {
        const empleado = await Empleado.create(req.body);
        res.status(201).json(empleado);
    } catch (error) {
        console.error('Error al crear empleado:', error);
        res.status(500).json({ 
            message: 'Error al crear empleado',
            error: error.message 
        });
    }
};

// Actualizar un empleado
const updateEmpleado = async (req, res) => {
    try {
        const [updated] = await Empleado.update(req.body, {
            where: { id_empleado: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        const empleado = await Empleado.findByPk(req.params.id);
        res.json(empleado);
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        res.status(500).json({ 
            message: 'Error al actualizar empleado',
            error: error.message 
        });
    }
};

// Eliminar un empleado
const deleteEmpleado = async (req, res) => {
    try {
        const deleted = await Empleado.destroy({
            where: { id_empleado: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        res.json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({ 
            message: 'Error al eliminar empleado',
            error: error.message 
        });
    }
};

// Cambiar estado de un empleado
const toggleEmpleadoStatus = async (req, res) => {
    try {
        const empleado = await Empleado.findByPk(req.params.id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        // Cambiar el estado activo
        empleado.activo = !empleado.activo;
        await empleado.save();

        res.json({
            message: `Empleado ${empleado.activo ? 'activado' : 'desactivado'} correctamente`,
            empleado
        });
    } catch (error) {
        console.error('Error al cambiar estado del empleado:', error);
        res.status(500).json({ 
            message: 'Error al cambiar estado del empleado',
            error: error.message 
        });
    }
};

module.exports = {
    getAllEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    toggleEmpleadoStatus
};