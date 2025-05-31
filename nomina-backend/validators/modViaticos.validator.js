const Joi = require('joi');


// --- Funciones de utilidad para fechas ---
const isValidDate = (dateString) => {
    try {
        const date = new Date(dateString);
        // Comprueba si la fecha es un objeto Date válido y no es "Invalid Date"
        return date instanceof Date && !isNaN(date);
    } catch (e) {
        return false;
    }
};

const isFutureDate = (dateString, options = { inclusive: false }) => {
    if (!isValidDate(dateString)) {
        return false;
    }
    const checkDate = new Date(dateString);
    const today = new Date();
    // Normaliza las fechas para comparar solo el día, mes y año
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    if (options.inclusive) {
        return checkDate >= today;
    } else {
        return checkDate > today;
    }
};
// --- Fin de funciones de utilidad para fechas ---


// Esquema base para validación de fechas
const fechaSchema = Joi.string().custom((value, helpers) => {
    if (!isValidDate(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}).messages({
    'any.invalid': 'La fecha proporcionada no es válida'
});

// Validación de solicitud de viáticos
const solicitudViaticoSchema = Joi.object({
    id_empleado: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'El ID de empleado debe ser un número',
            'any.required': 'El ID de empleado es requerido'
        }),
    fecha_inicio_viaje: fechaSchema.required()
        .custom((value, helpers) => {
            if (isFutureDate(value, { inclusive: false })) {
                return value;
            }
            return helpers.error('any.invalid');
        })
        .messages({
            'any.invalid': 'La fecha de inicio debe ser futura',
            'any.required': 'La fecha de inicio es requerida'
        }),
    fecha_fin_viaje: fechaSchema.required()
        .custom((value, helpers) => {
            const { fecha_inicio_viaje } = helpers.state.ancestors[0];
            if (new Date(value) >= new Date(fecha_inicio_viaje)) {
                return value;
            }
            return helpers.error('any.invalid');
        })
        .messages({
            'any.invalid': 'La fecha de fin debe ser igual o posterior a la de inicio',
            'any.required': 'La fecha de fin es requerida'
        }),
    destino: Joi.string().max(200).required()
        .messages({
            'string.max': 'El destino no puede exceder los 200 caracteres',
            'any.required': 'El destino es requerido'
        }),
    motivo: Joi.string().min(10).max(500).required()
        .messages({
            'string.min': 'El motivo debe tener al menos 10 caracteres',
            'string.max': 'El motivo no puede exceder los 500 caracteres',
            'any.required': 'El motivo es requerido'
        }),
    detalles: Joi.array().min(1).items(
        Joi.object({
            id_tipo_viatico: Joi.number().integer().positive().required()
                .messages({
                    'number.base': 'El tipo de viático debe ser un número válido',
                    'any.required': 'El tipo de viático es requerido'
                }),
            descripcion: Joi.string().max(200).required()
                .messages({
                    'string.max': 'La descripción no puede exceder los 200 caracteres',
                    'any.required': 'La descripción es requerida'
                }),
            monto: Joi.number().positive().precision(2).max(100000)
                .required()
                .messages({
                    'number.base': 'El monto debe ser un número válido',
                    'number.positive': 'El monto debe ser positivo',
                    'number.max': 'El monto no puede exceder Q100,000.00',
                    'any.required': 'El monto es requerido'
                })
        })
    ).required()
    .messages({
        'array.min': 'Debe agregar al menos un detalle de viático',
        'any.required': 'Los detalles son requeridos'
    })
});

// Validación de aprobación de solicitud
const aprobacionSolicitudSchema = Joi.object({
    aprobado: Joi.boolean().required()
        .messages({
            'boolean.base': 'El estado de aprobación debe ser verdadero o falso',
            'any.required': 'El estado de aprobación es requerido'
        }),
    montoAprobado: Joi.when('aprobado', {
        is: true,
        then: Joi.number().positive().precision(2).max(100000).required()
            .messages({
                'number.base': 'El monto aprobado debe ser un número válido',
                'number.positive': 'El monto aprobado debe ser positivo',
                'number.max': 'El monto aprobado no puede exceder Q100,000.00',
                'any.required': 'El monto aprobado es requerido cuando la solicitud es aprobada'
            }),
        otherwise: Joi.forbidden()
    }),
    observaciones: Joi.string().max(500)
        .messages({
            'string.max': 'Las observaciones no pueden exceder los 500 caracteres'
        })
});

// Validación de registro de anticipo
const anticipoSchema = Joi.object({
    solicitudId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'El ID de solicitud debe ser un número',
            'any.required': 'El ID de solicitud es requerido'
        }),
    monto: Joi.number().positive().precision(2).max(100000).required()
        .messages({
            'number.base': 'El monto debe ser un número válido',
            'number.positive': 'El monto debe ser positivo',
            'number.max': 'El monto no puede exceder Q100,000.00',
            'any.required': 'El monto es requerido'
        }),
    metodoPago: Joi.string().valid('Efectivo', 'Transferencia', 'Cheque').required()
        .messages({
            'any.only': 'El método de pago debe ser Efectivo, Transferencia o Cheque',
            'any.required': 'El método de pago es requerido'
        }),
    referencia: Joi.when('metodoPago', {
        is: 'Efectivo',
        then: Joi.forbidden(),
        otherwise: Joi.string().max(100).required()
            .messages({
                'string.max': 'La referencia no puede exceder los 100 caracteres',
                'any.required': 'La referencia es requerida para este método de pago'
            })
    })
});

// Validación de liquidación de viáticos
const liquidacionSchema = Joi.object({
    solicitudId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'El ID de solicitud debe ser un número',
            'any.required': 'El ID de solicitud es requerido'
        }),
    anticipoId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'El ID de anticipo debe ser un número',
            'any.required': 'El ID de anticipo es requerido'
        }),
    gastos: Joi.array().min(1).items(
        Joi.object({
            id_tipo_viatico: Joi.number().integer().positive().required()
                .messages({
                    'number.base': 'El tipo de viático debe ser un número válido',
                    'any.required': 'El tipo de viático es requerido'
                }),
            fecha_gasto: fechaSchema.required()
                .messages({
                    'any.required': 'La fecha del gasto es requerida'
                }),
            descripcion: Joi.string().max(200).required()
                .messages({
                    'string.max': 'La descripción no puede exceder los 200 caracteres',
                    'any.required': 'La descripción es requerida'
                }),
            monto: Joi.number().positive().precision(2).max(100000)
                .required()
                .messages({
                    'number.base': 'El monto debe ser un número válido',
                    'number.positive': 'El monto debe ser positivo',
                    'number.max': 'El monto no puede exceder Q100,000.00',
                    'any.required': 'El monto es requerido'
                }),
            numero_factura: Joi.when('tiene_factura', {
                is: true,
                then: Joi.string().max(50).required()
                    .messages({
                        'string.max': 'El número de factura no puede exceder los 50 caracteres',
                        'any.required': 'El número de factura es requerido cuando hay factura'
                    }),
                otherwise: Joi.forbidden()
            }),
            nombre_proveedor: Joi.string().max(200)
                .messages({
                    'string.max': 'El nombre del proveedor no puede exceder los 200 caracteres'
                }),
            nit_proveedor: Joi.string().pattern(/^[0-9]+(-[0-9kK])?$/)
                .messages({
                    'string.pattern.base': 'El NIT debe tener el formato correcto (ej: 12345678-9)'
                }),
            tiene_factura: Joi.boolean().default(true),
            imagen_comprobante: Joi.string().uri()
                .messages({
                    'string.uri': 'La URL de la imagen debe ser válida'
                })
        })
    ).required()
    .messages({
        'array.min': 'Debe agregar al menos un gasto',
        'any.required': 'Los gastos son requeridos'
    })
});

// Validación de aprobación de liquidación
const aprobacionLiquidacionSchema = Joi.object({
    aprobado: Joi.boolean().required()
        .messages({
            'boolean.base': 'El estado de aprobación debe ser verdadero o falso',
            'any.required': 'El estado de aprobación es requerido'
        }),
    observaciones: Joi.string().max(500)
        .messages({
            'string.max': 'Las observaciones no pueden exceder los 500 caracteres'
        })
});

// Funciones de validación exportadas
module.exports = {
    validarSolicitudViatico: (data) => solicitudViaticoSchema.validate(data, { abortEarly: false }),
    validarAprobacionSolicitud: (data) => aprobacionSolicitudSchema.validate(data, { abortEarly: false }),
    validarAnticipo: (data) => anticipoSchema.validate(data, { abortEarly: false }),
    validarLiquidacion: (data) => liquidacionSchema.validate(data, { abortEarly: false }),
    validarAprobacionLiquidacion: (data) => aprobacionLiquidacionSchema.validate(data, { abortEarly: false })
};