const liquidacionesService = require('../services/modLiquidaciones.service');

// Implementación local de handleErrorResponse
const handleErrorResponse = (res, error) => {
    console.error('Error:', error); // Esto te ayudará a ver los errores en la consola del servidor
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.stack : {} // Muestra el stack en desarrollo
    });
};

exports.crearLiquidacion = async (req, res) => {
    try {
        const { solicitudId, anticipoId, gastos } = req.body;
        const empleadoId = req.user.id;

        const liquidacion = await liquidacionesService.crearLiquidacion(
            solicitudId,
            anticipoId,
            gastos,
            empleadoId
        );

        res.status(201).json({
            success: true,
            message: 'Liquidación registrada correctamente',
            data: liquidacion
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

exports.aprobarLiquidacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobado, observaciones } = req.body;
        const aprobadorId = req.user.id;

        const liquidacion = await liquidacionesService.aprobarLiquidacion(
            id,
            aprobado,
            observaciones,
            aprobadorId
        );

        res.status(200).json({
            success: true,
            message: `Liquidación ${aprobado ? 'aprobada' : 'rechazada'} correctamente`,
            data: liquidacion
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

exports.obtenerLiquidacion = async (req, res) => {
    try {
        const { id } = req.params;
        const liquidacion = await liquidacionesService.obtenerLiquidacion(id);

        res.status(200).json({
            success: true,
            data: liquidacion
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

exports.listarLiquidaciones = async (req, res) => {
    try {
        const { solicitudId, empleadoId, estado } = req.query;
        const liquidaciones = await liquidacionesService.listarLiquidaciones({
            solicitudId,
            empleadoId,
            estado
        });

        res.status(200).json({
            success: true,
            data: liquidaciones
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};