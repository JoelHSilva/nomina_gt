const anticiposService = require('../services/modAnticipos.service');

// Función local para manejo de errores
const handleError = (res, error) => {
    console.error('Error en controlador de anticipos:', error);
    
    const status = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    
    res.status(status).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

exports.registrarAnticipo = async (req, res) => {
    try {
        const { solicitudId, monto, metodoPago, referencia } = req.body;
        const registradorId = req.user.id;
        
        const anticipo = await anticiposService.registrarAnticipo(
            solicitudId,
            monto,
            metodoPago,
            referencia,
            registradorId
        );
        
        res.status(201).json({
            success: true,
            message: 'Anticipo registrado correctamente',
            data: anticipo
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.listarAnticipos = async (req, res) => {
    try {
        const { solicitudId, empleadoId, liquidado } = req.query;
        const anticipos = await anticiposService.listarAnticipos({ 
            solicitudId, 
            empleadoId, 
            liquidado 
        });
        
        res.status(200).json({
            success: true,
            data: anticipos
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.obtenerAnticipo = async (req, res) => {
    try {
        const { id } = req.params;
        const anticipo = await anticiposService.obtenerAnticipo(id);
        
        res.status(200).json({
            success: true,
            data: anticipo
        });
    } catch (error) {
        handleError(res, error);
    }
};