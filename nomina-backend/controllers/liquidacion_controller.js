const express = require('express');
const router = express.Router();
const db = require('../models');
const { Liquidacion, LiquidacionDetalle, Empleado } = db;
const liquidacionService = require('../services/liquidacion_service');

// Crear nueva liquidación
router.post('/', async (req, res) => {
  try {
    const service = new liquidacionService();
    const liquidacion = await service.calcularLiquidacion(
      req.body.id_empleado,
      new Date(req.body.fecha_liquidacion),
      req.body.tipo_liquidacion,
      req.body.motivo
    );

    // Generar detalles de la liquidación
    const detalles = await service.generarDetalles(liquidacion);

    res.json({
      id_liquidacion: liquidacion.id_liquidacion,
      id_empleado: liquidacion.id_empleado,
      fecha_liquidacion: liquidacion.fecha_liquidacion,
      tipo_liquidacion: liquidacion.tipo_liquidacion,
      total_liquidacion: liquidacion.total_liquidacion,
      estado: liquidacion.estado,
      detalles: detalles.map(detalle => ({
        concepto: detalle.concepto,
        tipo: detalle.tipo,
        monto: detalle.monto,
        descripcion: detalle.descripcion
      }))
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener liquidación por ID
router.get('/:id_liquidacion', async (req, res) => {
  try {
    const liquidacion = await Liquidacion.findByPk(req.params.id_liquidacion, {
      include: [
        {
          model: Empleado,
          attributes: ['nombre', 'apellido', 'codigo_empleado', 'dpi', 'nit']
        },
        {
          model: LiquidacionDetalle,
          attributes: ['concepto', 'tipo', 'monto', 'descripcion']
        }
      ]
    });

    if (!liquidacion) {
      return res.status(404).json({ error: 'Liquidación no encontrada' });
    }

    res.json(liquidacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener liquidaciones por empleado
router.get('/empleado/:id_empleado', async (req, res) => {
  try {
    const liquidaciones = await Liquidacion.findAll({
      where: {
        id_empleado: req.params.id_empleado,
        activo: true
      },
      include: [
        {
          model: Empleado,
          attributes: ['nombre', 'apellido', 'codigo_empleado']
        },
        {
          model: LiquidacionDetalle,
          attributes: ['concepto', 'tipo', 'monto', 'descripcion']
        }
      ]
    });

    res.json(liquidaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de liquidación
router.put('/:id_liquidacion/estado', async (req, res) => {
  try {
    const liquidacion = await Liquidacion.findByPk(req.params.id_liquidacion);
    if (!liquidacion) {
      return res.status(404).json({ error: 'Liquidación no encontrada' });
    }

    const nuevoEstado = req.body.estado;
    if (!['Pendiente', 'Pagada', 'Anulada'].includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    liquidacion.estado = nuevoEstado;
    if (nuevoEstado === 'Pagada') {
      liquidacion.fecha_pago = new Date();
    }

    await liquidacion.save();
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 