// controllers/nominas.controller.js
const db = require('../models');
// Importar el servicio de Nominas
const NominasService = require('../services/nominas.service');
// Importar modelos asociados si se usan en includes


// Instanciar el servicio
const nominasService = new NominasService();


// --- Métodos CRUD básicos ---

// Obtener todas las nominas (MODIFICADO para filtrar por activo)
const getAllNominas = async (req, res) => {
    try {
        const whereCondition = {}; // Objeto base para la condición WHERE

        // Filtrar por estado activo si el parámetro 'activo' está presente en la query
        // req.query.activo será una cadena ('true' o 'false') si se envía
        if (req.query.activo !== undefined) {
            // Convertir la cadena a booleano
            whereCondition.activo = req.query.activo === 'true';
        } else {
            // Por defecto, solo mostrar nóminas activas
            whereCondition.activo = true;
        }

        // Implementación de filtro por searchTerm (Opcional)
        // Si quieres que la búsqueda en el frontend filtre los resultados desde la base de datos,
        // debes añadir lógica aquí usando el parámetro req.query.search
        // require('../models').Sequelize accede a la instancia de Sequelize y sus operadores (Op)
        // const { Op } = require('../models').Sequelize;
        // if (req.query.search) {
        //     const searchTerm = req.query.search.toLowerCase();
        //     // Define en qué campos buscar. Esto puede incluir campos de Nomina o de PeriodoPago (usando el alias 'periodo_pago')
        //     // La búsqueda en relaciones requiere un include definido arriba y a veces subQuery: false
        //     whereCondition[Op.or] = [
        //         { descripcion: { [Op.like]: `%${searchTerm}%` } },
        //         { estado: { [Op.like]: `%${searchTerm}%` } },
        //         // Ejemplo de búsqueda en relación (nombre del periodo):
        //         // { '$periodo_pago.nombre$': { [Op.like]: `%${searchTerm}%` } }
        //     ];
        //     // Si usas búsqueda en relaciones ($alias.campo$), necesitas subQuery: false
        //     // También asegúrate de que el modelo PeriodoPago esté correctamente relacionado e incluido.
        // }


        const nominas = await db.Nomina.findAll({
             where: whereCondition, // Aplicar la condición de filtro
             include: [
                { model: db.PeriodoPago, as: 'periodo_pago' }, // Asegúrate de que el alias coincida
             ],
            // subQuery: false, // Descomentar si implementas búsqueda en relaciones con $alias.campo$
        });
        res.json(nominas);
    } catch (error) {
        console.error("Error en getAllNominas:", error);
        // Considera devolver error.errors si es un ValidationError de Sequelize
        res.status(500).json({ error: error.message });
    }
};

// Obtener una nomina por ID
const getNominaById = async (req, res) => {
    try {
        const { id } = req.params;
        const nomina = await db.Nomina.findByPk(id, {
             include: [
                { model: db.PeriodoPago, as: 'periodo_pago' },
                 // Incluir detalles y sus relaciones anidadas (Empleado -> Puesto -> Departamento)
                 {
                     model: db.DetalleNomina,
                     as: 'detalles_nomina',
                     include: [
                         // Inclusión anidada: Empleado -> Puesto -> Departamento
                         {
                             model: db.Empleado,
                             as: 'empleado',
                             include: [
                                 { model: db.Puesto, as: 'puesto', include: [{ model: db.Departamento, as: 'departamento' }] }
                             ]
                         },
                         { model: db.ConceptoAplicado, as: 'conceptos_aplicados' },
                         { model: db.PagoPrestamo, as: 'pagos_prestamo_asociados' },
                         { model: db.HoraExtra, as: 'horas_extras_pagadas' },
                         { model: db.LiquidacionViatico, as: 'liquidacion_viatico_incluida' },
                     ]
                 }
             ]
        });
        if (nomina) {
            res.json(nomina);
        } else {
            res.status(404).json({ error: 'Nómina no encontrada' });
        }
    } catch (error) {
        console.error("Error en getNominaById:", error);
        res.status(500).json({ error: error.message });
    }
};


// Actualizar una nomina por ID (Usado ahora para BORRADO LÓGICO y otros cambios)
const updateNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        const nomina = await db.Nomina.findByPk(id);
        if (!nomina) {
             return res.status(404).json({ error: 'Nómina no encontrada' });
        }

        const [updated] = await db.Nomina.update(body, {
            where: { id_nomina: id }
        });
        if (updated) {
            const updatedNomina = await db.Nomina.findByPk(id, {
                 include: [
                    { model: db.PeriodoPago, as: 'periodo_pago' },
                 ]
            });
            res.json(updatedNomina);
        } else {
            res.status(404).json({ error: 'Nómina no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        console.error("Error en updateNomina:", error);
         if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
              res.status(400).json({ error: error.errors.map(e => e.message) });
          } else {
            res.status(400).json({ error: error.message });
        }
    }
};

// Eliminar una nomina por ID (Mantener si se necesita borrado físico en otro contexto)
const deleteNomina = async (req, res) => {
    console.warn("Advertencia: Se está realizando un borrado físico de Nómina. Considera usar borrado lógico en su lugar.");
    try {
        const { id } = req.params;

         const nomina = await db.Nomina.findByPk(id);
         if (!nomina) {
             return res.status(404).json({ error: 'Nómina no encontrada' });
         }
         if (nomina.estado !== 'Borrador') {
             return res.status(400).json({ error: `Solo se pueden eliminar físicamente nóminas en estado Borrador. Estado actual: ${nomina.estado}` });
         }

        const deleted = await db.Nomina.destroy({
            where: { id_nomina: id }
        });
        if (deleted) {
            res.status(204).send("Nómina eliminada físicamente");
        } else {
            res.status(404).json({ error: 'Nómina no encontrada' });
        }
    } catch (error) {
        console.error("Error en deleteNomina:", error);
        res.status(500).json({ error: error.message });
    }
};


// --- Métodos que usan el Servicio de Nóminas para la lógica de negocio del flujo ---

// Crear (Generar) una nueva nómina - Delega la lógica compleja al servicio
const createNomina = async (req, res) => {
    try {
        const { idPeriodo } = req.body;

        if (!idPeriodo) {
             return res.status(400).json({ error: 'El idPeriodo es requerido para generar la nómina.' });
        }

        const usuarioGeneracion = req.user ? req.user.nombre_usuario : 'Sistema';

        const nuevaNomina = await nominasService.generarNomina(idPeriodo, usuarioGeneracion);

        res.status(201).json(nuevaNomina);

    } catch (error) {
        console.error("Error en createNomina (Controller):", error);
         if (error.message.includes('Periodo de Pago no encontrado')) {
             res.status(404).json({ error: error.message });
         } else if (error.message.includes('Ya existe una nómina') || error.message.includes('Error de validación') || error.message.includes('clave foránea') || error.message.includes('Error generando nómina')) {
             res.status(400).json({ error: error.message });
         } else {
             res.status(500).json({ error: error.message });
         }
    }
};


// Cambiar el estado de una nómina a 'Verificada' - Delega la lógica al servicio
const verificarNomina = async (req, res) => {
     try {
         const { id } = req.params;
         const nominaVerificada = await nominasService.verificarNomina(id);
         res.json(nominaVerificada);

     } catch (error) {
         console.error("Error en verificarNomina (Controller):", error);
          if (error.message.includes('Nómina no encontrada')) {
              res.status(404).json({ error: error.message });
          } else if (error.message.includes('Solo se pueden verificar nóminas en estado Borrador')) {
               res.status(400).json({ error: error.message });
          }
          else {
              res.status(500).json({ error: error.message });
          }
     }
};

// Cambiar el estado de una nómina a 'Aprobada' - Delega la lógica al servicio
const aprobarNomina = async (req, res) => {
     try {
         const { id } = req.params;
         const usuarioAprobacion = req.user ? req.user.nombre_usuario : 'Usuario Aprobador';
         const nominaAprobada = await nominasService.aprobarNomina(id, usuarioAprobacion);
         res.json(nominaAprobada);

     } catch (error) {
         console.error("Error en aprobarNomina (Controller):", error);
          if (error.message.includes('Nómina no encontrada')) {
              res.status(404).json({ error: error.message });
          } else if (error.message.includes('Solo se pueden aprobar nóminas en estado Verificada') || error.message.includes('Error aplicando pagos')) {
               res.status(400).json({ error: error.message });
          }
          else {
              res.status(500).json({ error: error.message });
          }
     }
};

// Cambiar el estado de una nómina a 'Pagada' - Delega la lógica al servicio
const pagarNomina = async (req, res) => {
    try {
         const { id } = req.params;
         const nominaPagada = await nominasService.pagarNomina(id);
         res.json(nominaPagada);

     } catch (error) {
         console.error("Error en pagarNomina (Controller):", error);
          if (error.message.includes('Nómina no encontrada')) {
              res.status(404).json({ error: error.message });
          } else if (error.message.includes('Solo se pueden marcar como pagadas nóminas en estado Aprobada')) {
               res.status(400).json({ error: error.message });
          }
          else {
              res.status(500).json({ error: error.message });
          }
     }
};


module.exports = {
    getAllNominas,
    getNominaById,
    createNomina,
    updateNomina, // Usado ahora para borrado lógico y otras actualizaciones
    deleteNomina, // Mantener si se necesita borrado físico, pero frontend ya no lo usa
    verificarNomina,
    aprobarNomina,
    pagarNomina,
};