const viaticosService = require('../services/modViaticos.service');

// Función para manejar errores
const handleError = (res, error) => {
    console.error(error);
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};

exports.crearSolicitud = async (req, res) => {
    try {
        const solicitudData = req.body;
        const usuarioId = req.user.id;
        
        const solicitud = await viaticosService.crearSolicitud(solicitudData, usuarioId);
        res.status(201).json({
            success: true,
            message: 'Solicitud de viáticos creada correctamente',
            data: solicitud
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.listarSolicitudes = async (req, res) => {
    try {
        const { estado, empleadoId } = req.query;
        const solicitudes = await viaticosService.listarSolicitudes({ estado, empleadoId });
        
        res.status(200).json({
            success: true,
            data: solicitudes
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.obtenerSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await viaticosService.obtenerSolicitud(id);
        
        res.status(200).json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.aprobarSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobado, montoAprobado, observaciones } = req.body;
        const aprobadorId = req.user.id;
        
        const solicitud = await viaticosService.aprobarSolicitud(
            id, 
            aprobado, 
            montoAprobado, 
            observaciones, 
            aprobadorId
        );
        
        res.status(200).json({
            success: true,
            message: `Solicitud ${aprobado ? 'aprobada' : 'rechazada'} correctamente`,
            data: solicitud
        });
    } catch (error) {
        handleError(res, error);
    }
};