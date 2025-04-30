// controllers/solicitudesViaticos.controller.js
const db = require('../models');
// Importar el servicio de Viáticos
const ViaticosService = require('../services/viaticos.service');
// Importar modelos asociados si se usan en includes (Empleado, DetalleSolicitudViatico, etc.)


// Instanciar el servicio
const viaticosService = new ViaticosService();


// --- Métodos CRUD básicos (pueden seguir interactuando con el modelo directamente si la lógica es simple) ---

// Obtener todas las solicitudes de viaticos
const getAllSolicitudesViaticos = async (req, res) => {
    try {
        const solicitudes = await db.SolicitudViatico.findAll({
             include: [
                 { model: db.Empleado, as: 'empleado' }, // Asegúrate de que el alias coincida
                 { model: db.DetalleSolicitudViatico, as: 'detalles_solicitud' }, // Asegúrate de que el alias coincida
                 { model: db.AnticipoViatico, as: 'anticipos' }, // Asegúrate de que el alias coincida
                 { model: db.LiquidacionViatico, as: 'liquidacion' }, // Asegúrate de que el alias coincida (si es hasOne)
             ] // Incluir relaciones si es necesario para la respuesta
        });
        res.json(solicitudes);
    } catch (error) {
        console.error("Error en getAllSolicitudesViaticos:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener una solicitud de viatico por ID
const getSolicitudViaticoById = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await db.SolicitudViatico.findByPk(id, {
             include: [
                 { model: db.Empleado, as: 'empleado' },
                 { model: db.DetalleSolicitudViatico, as: 'detalles_solicitud' },
                 { model: db.AnticipoViatico, as: 'anticipos' },
                 { model: db.LiquidacionViatico, as: 'liquidacion' },
             ] // Incluir relaciones si es necesario para la respuesta
        });
        if (solicitud) {
            res.json(solicitud);
        } else {
            res.status(404).json({ error: 'Solicitud de Viático no encontrada' });
        }
    } catch (error) {
        console.error("Error en getSolicitudViaticoById:", error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una solicitud de viatico por ID (Permite actualizar campos simples, lógica compleja vía servicio)
const updateSolicitudViatico = async (req, res) => {
    try {
        const { id } = req.params;
        // Considera qué campos *realmente* quieres permitir actualizar aquí (ej: destino, motivo si estado es Solicitada)
        // No deberías permitir actualizar monto_solicitado, monto_aprobado, estado directamente si hay un flujo de aprobación/liquidación.
        const [updated] = await db.SolicitudViatico.update(req.body, {
            where: { id_solicitud: id }
        });
        if (updated) {
            const updatedSolicitud = await db.SolicitudViatico.findByPk(id, {
                 include: [
                     { model: db.Empleado, as: 'empleado' },
                     { model: db.DetalleSolicitudViatico, as: 'detalles_solicitud' },
                     { model: db.AnticipoViatico, as: 'anticipos' },
                     { model: db.LiquidacionViatico, as: 'liquidacion' },
                 ]
            });
            res.json(updatedSolicitud);
        } else {
            res.status(404).json({ error: 'Solicitud de Viático no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateSolicitudViatico:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
              res.status(400).json({ error: error.errors.map(e => e.message) });
          } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una solicitud de viatico por ID (Ten cuidado con las restricciones de FK)
const deleteSolicitudViatico = async (req, res) => {
    try {
        const { id } = req.params;
         // Nota: Considera la acción ON DELETE definida en DetalleSolicitudViatico, AnticipoViatico, LiquidacionViatico.
         // Si es RESTRICT, no podrás eliminar una solicitud si tiene detalles, anticipos o liquidaciones asociadas.
        const deleted = await db.SolicitudViatico.destroy({
            where: { id_solicitud: id }
        });
        if (deleted) {
            res.status(204).send("Solicitud de Viático eliminada");
        } else {
            res.status(404).json({ error: 'Solicitud de Viático no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteSolicitudViatico:", error);
        res.status(500).json({ error: error.message }); // Puede dar error 500 si la restricción FK falla
    }
};

// --- Métodos que usan el Servicio de Viáticos para la lógica de negocio ---

// Crear una nueva solicitud de viatico - Delega la lógica compleja (solicitud + detalles) al servicio
const createSolicitudViatico = async (req, res) => {
    try {
        // El servicio maneja la creación de la solicitud principal y sus detalles, y el cálculo del monto total.
        const nuevaSolicitud = await viaticosService.crearSolicitud(req.body);
        res.status(201).json(nuevaSolicitud); // Devuelve la solicitud creada (con detalles si el servicio la carga)
    } catch (error) {
        console.error("Error en createSolicitudViatico (Controller):", error);
         // Manejo específico de errores lanzados por el servicio (validaciones de negocio, FKs, etc.)
         if (error.message.includes('Empleado no encontrado') || error.message.includes('debe tener al menos un detalle')) {
             res.status(400).json({ error: error.message }); // Usar 400 para problemas del cliente o de lógica de negocio inválida
         } else {
             // Captura otros errores (ej: validación de Sequelize si el servicio no la maneja completamente, errores de BD)
             if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                  res.status(400).json({ error: error.errors.map(e => e.message) });
              } else {
                 res.status(500).json({ error: error.message }); // Usa 500 para errores del servidor
             }
         }
    }
};

// Aprobar una solicitud de viatico - Delega la lógica al servicio
const aprobarSolicitud = async (req, res) => {
    try {
        const { id } = req.params; // ID de la Solicitud
        const datosAprobacion = req.body; // Debe incluir al menos { aprobado_por, monto_aprobado (opcional) }

        // Delega la lógica de aprobación y actualización del estado al servicio
        const solicitudAprobada = await viaticosService.aprobarSolicitud(id, datosAprobacion);

        res.json(solicitudAprobada); // Devuelve la solicitud actualizada

    } catch (error) {
        console.error("Error en aprobarSolicitud (Controller):", error);
         // Manejo específico de errores lanzados por el servicio
         if (error.message.includes('Solicitud de Viático no encontrada')) {
             res.status(404).json({ error: error.message });
         } else if (error.message.includes('Solo se pueden aprobar solicitudes en estado') || error.message.includes('Se requiere especificar quién aprueba')) { // Agrega manejo de otros errores del servicio
             res.status(400).json({ error: error.message });
         }
         else {
             // Captura otros errores
             res.status(500).json({ error: error.message });
         }
    }
};

// Registrar un anticipo para una solicitud - Delega la lógica al servicio
const registrarAnticipo = async (req, res) => {
    try {
        const { id } = req.params; // ID de la Solicitud a la que se registra el anticipo
        const datosAnticipo = req.body; // Debe incluir { monto, metodo_pago, entregado_por, recibido_por, etc. }

        // Delega la creación del registro de anticipo al servicio
        const anticipoRegistrado = await viaticosService.registrarAnticipo(id, datosAnticipo);

        res.status(201).json(anticipoRegistrado); // Devuelve el registro de anticipo creado

    } catch (error) {
        console.error("Error en registrarAnticipo (Controller):", error);
         // Manejo específico de errores lanzados por el servicio
         if (error.message.includes('Solicitud de Viático no encontrada')) {
             res.status(404).json({ error: error.message });
         } else if (error.message.includes('La solicitud debe estar aprobada para registrar un anticipo') || error.message.includes('Datos de anticipo incompletos')) { // Agrega manejo de otros errores del servicio
             res.status(400).json({ error: error.message });
         }
         else {
             // Captura otros errores
             res.status(400).json({ error: error.message });
         }
    }
};

// Liquidar viáticos para una solicitud - Delega la lógica compleja (liquidación + detalles) al servicio
const liquidarViaticos = async (req, res) => {
    try {
        const { id } = req.params; // ID de la Solicitud a liquidar
        const datosLiquidacion = req.body; // Debe incluir { detalles: [], ...otros datos de liquidación }

        // Delega la creación de la liquidación y sus detalles, y el cálculo de saldos al servicio
        const liquidacion = await viaticosService.liquidarViaticos(id, datosLiquidacion);

        res.status(201).json(liquidacion); // Devuelve el registro de liquidación creado (con detalles si el servicio la carga)

    } catch (error) {
        console.error("Error en liquidarViaticos (Controller):", error);
         // Manejo específico de errores lanzados por el servicio
         if (error.message.includes('Solicitud de Viático no encontrada')) {
             res.status(404).json({ error: error.message });
         } else if (error.message.includes('debe tener al menos un detalle de gasto') || error.message.includes('Solo se pueden liquidar solicitudes en estado')) { // Agrega manejo de otros errores del servicio
             res.status(400).json({ error: error.message });
         }
         else {
             // Captura otros errores (ej: validación de Sequelize, errores de BD)
             if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                  res.status(400).json({ error: error.errors.map(e => e.message) });
              } else {
                 res.status(500).json({ error: error.message }); // Usa 500 para errores del servidor
             }
         }
    }
};


module.exports = {
    getAllSolicitudesViaticos,
    getSolicitudViaticoById,
    createSolicitudViatico, // Usa servicio
    updateSolicitudViatico, // CRUD básico
    deleteSolicitudViatico, // CRUD básico
    aprobarSolicitud, // Usa servicio
    registrarAnticipo, // Usa servicio
    liquidarViaticos // Usa servicio
};