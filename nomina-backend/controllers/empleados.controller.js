// controllers/empleados.controller.js
const db = require('../models');
const Empleado = db.Empleado;
const Puesto = db.Puesto; // Importar modelos asociados si se usan en includes
const Departamento = db.Departamento;
// Importar otros modelos asociados si se usan en includes (DetalleNomina, Prestamo, Vacacion, etc.)

// Obtener todos los empleados
const getAllEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll({
             include: [
                 {
                     model: Puesto,
                     as: 'puesto',
                     include: [{ model: Departamento, as: 'departamento' }]
                 },
                // { model: db.DetalleNomina, as: 'nominas' }, // Incluir otras relaciones si es necesario
                // { model: db.Prestamo, as: 'prestamos' },
                // { model: db.Vacacion, as: 'vacaciones' },
                // { model: db.Ausencia, as: 'ausencias' },
                // { model: db.HoraExtra, as: 'horas_extras' },
                // { model: db.HistorialSalario, as: 'historial_salarios' },
                // { model: db.SolicitudViatico, as: 'solicitudes_viaticos' },
             ]
        });
        res.json(empleados);
    } catch (error) {
        console.error("Error en getAllEmpleados:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un empleado por ID
const getEmpleadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await Empleado.findByPk(id, {
             include: [
                 {
                     model: Puesto,
                     as: 'puesto',
                     include: [{ model: Departamento, as: 'departamento' }]
                 },
                 // { model: db.DetalleNomina, as: 'nominas' }, // Incluir otras relaciones si es necesario
                 // { model: db.Prestamo, as: 'prestamos' },
                 // { model: db.Vacacion, as: 'vacaciones' },
                 // { model: db.Ausencia, as: 'ausencias' },
                 // { model: db.HoraExtra, as: 'horas_extras' },
                 // { model: db.HistorialSalario, as: 'historial_salarios' },
                 // { model: db.SolicitudViatico, as: 'solicitudes_viaticos' },
             ]
        });
        if (empleado) {
            res.json(empleado);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error("Error en getEmpleadoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo empleado
const createEmpleado = async (req, res) => {
    try {
        const nuevoEmpleado = await Empleado.create(req.body);
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        console.error("Error en createEmpleado:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Actualizar un empleado por ID
const updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Empleado.update(req.body, {
            where: { id_empleado: id }
        });
        if (updated) {
            const updatedEmpleado = await Empleado.findByPk(id, {
                 include: [
                     {
                         model: Puesto,
                         as: 'puesto',
                         include: [{ model: Departamento, as: 'departamento' }]
                     },
                     // { model: db.DetalleNomina, as: 'nominas' }, // Incluir otras relaciones si es necesario
                     // { model: db.Prestamo, as: 'prestamos' },
                     // { model: db.Vacacion, as: 'vacaciones' },
                     // { model: db.Ausencia, as: 'ausencias' },
                     // { model: db.HoraExtra, as: 'horas_extras' },
                     // { model: db.HistorialSalario, as: 'historial_salarios' },
                     // { model: db.SolicitudViatico, as: 'solicitudes_viaticos' },
                 ]
            });
            res.json(updatedEmpleado);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateEmpleado:", error);
        if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
             res.status(400).json({ error: error.errors.map(e => e.message) });
         } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar un empleado por ID
const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en otros modelos que referencian a este (DetalleNomina, Prestamo, Vacacion, etc.).
         // Si es RESTRICT (el default que pusimos), no podrás eliminar un empleado que tenga registros asociados en esas tablas.
        const deleted = await Empleado.destroy({
            where: { id_empleado: id }
        });
        if (deleted) {
            res.status(204).send("Empleado eliminado");
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error("Error en deleteEmpleado:", error);
        res.status(500).json({ error: error.message });
    }
};

// Controlador para cambiar el estado activo/inactivo (del ejemplo anterior)
const toggleEmpleadoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        empleado.activo = !empleado.activo;
        // Opcional: Actualizar el campo 'estado' basado en 'activo' si decides mantener ambos
        // empleado.estado = empleado.activo ? 'Activo' : 'Inactivo';
        await empleado.save();

        // Opcionalmente, busca el empleado actualizado con relaciones para devolverlo completo
        const updatedEmpleado = await Empleado.findByPk(id, {
             include: [
                 {
                     model: Puesto,
                     as: 'puesto',
                     include: [{ model: Departamento, as: 'departamento' }]
                 },
                 // ... otras inclusiones si son necesarias
             ]
        });

        res.json(updatedEmpleado); // o solo empleado si no necesitas las relaciones de vuelta
    } catch (error) {
        console.error("Error en toggleEmpleadoStatus:", error);
        res.status(400).json({ error: error.message }); // Usar 400 para errores relacionados con la operación
    }
};


module.exports = {
    getAllEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    toggleEmpleadoStatus // Exportar también la función de toggle status
};