// controllers/liquidaciones.controller.js
const db = require('../models');
const { Liquidacion, LiquidacionDetalle, Empleado } = db;
const liquidacionService = require('../services/liquidacion_service');

// Get all liquidaciones with filters
exports.getLiquidaciones = async (req, res) => {
    try {
        const { id_empleado, tipo_liquidacion, fecha_inicio, fecha_fin } = req.query;
        const { Op } = require('sequelize');

        // Construir condiciones de filtro
        const whereCondition = {};
        
        if (id_empleado) {
            whereCondition.id_empleado = id_empleado;
        }
        
        if (tipo_liquidacion) {
            whereCondition.tipo_liquidacion = tipo_liquidacion;
        }
        
        if (fecha_inicio || fecha_fin) {
            whereCondition.fecha_liquidacion = {};
            if (fecha_inicio) {
                whereCondition.fecha_liquidacion[Op.gte] = new Date(fecha_inicio);
            }
            if (fecha_fin) {
                whereCondition.fecha_liquidacion[Op.lte] = new Date(fecha_fin);
            }
        }

        const liquidaciones = await Liquidacion.findAll({
            where: whereCondition,
            include: [
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['nombre', 'apellido', 'codigo_empleado']
                },
                {
                    model: LiquidacionDetalle,
                    as: 'detalles',
                    attributes: ['concepto', 'tipo', 'monto', 'descripcion']
                }
            ],
            order: [['fecha_liquidacion', 'DESC']]
        });

        res.json({
            total: liquidaciones.length,
            liquidaciones: liquidaciones
        });
    } catch (error) {
        console.error('Error al obtener liquidaciones:', error);
        res.status(500).json({
            message: 'Error al obtener las liquidaciones',
            error: error.message
        });
    }
};

// Get liquidacion by id
exports.getLiquidacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const liquidacion = await Liquidacion.findByPk(id, {
            include: [
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['nombre', 'apellido', 'codigo_empleado', 'salario_actual'],
                    include: [
                        {
                            model: db.Puesto,
                            as: 'puesto',
                            attributes: ['nombre']
                        }
                    ]
                },
                {
                    model: LiquidacionDetalle,
                    as: 'detalles',
                    attributes: ['concepto', 'tipo', 'monto', 'descripcion']
                }
            ]
        });

        if (!liquidacion) {
            return res.status(404).json({
                message: 'Liquidación no encontrada'
            });
        }

        res.json(liquidacion);
    } catch (error) {
        console.error('Error al obtener liquidación:', error);
        res.status(500).json({
            message: 'Error al obtener la liquidación',
            error: error.message
        });
    }
};

// Create a new liquidacion
exports.createLiquidacion = async (req, res) => {
    try {
        const {
            id_empleado,
            tipo_liquidacion,
            fecha_liquidacion,
            motivo
        } = req.body;

        // Validar campos requeridos
        if (!id_empleado || !tipo_liquidacion || !fecha_liquidacion || !motivo) {
            return res.status(400).json({
                message: 'Faltan campos requeridos',
                campos_faltantes: {
                    id_empleado: !id_empleado,
                    tipo_liquidacion: !tipo_liquidacion,
                    fecha_liquidacion: !fecha_liquidacion,
                    motivo: !motivo
                }
            });
        }

        // Calcular la liquidación usando el servicio
        const liquidacion = await liquidacionService.calcularLiquidacion(
            id_empleado,
            new Date(fecha_liquidacion),
            tipo_liquidacion,
            motivo
        );

        // Obtener la liquidación con los datos del empleado y detalles
        const liquidacionCompleta = await Liquidacion.findByPk(liquidacion.id_liquidacion, {
            include: [
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['nombre', 'apellido', 'codigo_empleado', 'salario_actual'],
                    include: [
                        {
                            model: db.Puesto,
                            as: 'puesto',
                            attributes: ['nombre']
                        }
                    ]
                },
                {
                    model: LiquidacionDetalle,
                    as: 'detalles',
                    attributes: ['concepto', 'tipo', 'monto', 'descripcion']
                }
            ]
        });

        res.status(201).json({
            message: 'Liquidación creada exitosamente',
            liquidacion: liquidacionCompleta
        });

    } catch (error) {
        console.error('Error al crear liquidación:', error);
        res.status(500).json({
            message: 'Error al crear la liquidación',
            error: error.message
        });
    }
};

// Update liquidacion status
exports.updateLiquidacionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, fecha_pago } = req.body;

        const liquidacion = await Liquidacion.findByPk(id);
        if (!liquidacion) {
            return res.status(404).json({
                message: 'Liquidación no encontrada'
            });
        }

        // Validar estado
        if (!['Pendiente', 'Pagada', 'Anulada'].includes(estado)) {
            return res.status(400).json({
                message: 'Estado no válido'
            });
        }

        // Actualizar estado y fecha de pago
        await liquidacion.update({
            estado,
            fecha_pago: estado === 'Pagada' ? fecha_pago || new Date() : null
        });

        res.json({
            message: 'Estado de liquidación actualizado exitosamente',
            liquidacion
        });
    } catch (error) {
        console.error('Error al actualizar estado de liquidación:', error);
        res.status(500).json({
            message: 'Error al actualizar el estado de la liquidación',
            error: error.message
        });
    }
}; 