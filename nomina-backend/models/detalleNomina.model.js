// models/detalleNomina.model.js
module.exports = (sequelize, DataTypes) => {
    const DetalleNomina = sequelize.define('DetalleNomina', {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_nomina: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        salario_base: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        dias_trabajados: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        horas_extra: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0,
            allowNull: false
        },
        monto_horas_extra: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        bonificacion_incentivo: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        otros_ingresos: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        total_ingresos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        igss_laboral: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        isr: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        otros_descuentos: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        total_descuentos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        liquido_recibir: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fecha_creacion: {
            type: DataTypes.DATE, // DATETIME en SQL
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        dias_ausencia: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0,
            allowNull: false,
            comment: 'Días de ausencia que afectan el salario en el período'
        },
        dias_totales_periodo: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Total de días hábiles en el período'
        },
        detalle_ausencias: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON con el detalle de las ausencias aplicadas en el período'
        }
    }, {
        sequelize,
        modelName: 'DetalleNomina',
        tableName: 'detalle_nomina',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true, // Coincide con config/DB
        // Definir unique constraint para id_nomina y id_empleado
        indexes: [
            {
                unique: true,
                fields: ['id_nomina', 'id_empleado']
            }
        ]
    });

    DetalleNomina.associate = function(models) {
        // Un Detalle de Nómina pertenece a una Nómina
        DetalleNomina.belongsTo(models.Nomina, {
            foreignKey: {
                name: 'id_nomina',
                allowNull: false // Coincide con SQL
            },
            as: 'nomina',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Detalle de Nómina pertenece a un Empleado
        DetalleNomina.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Detalle de Nómina tiene muchos Conceptos Aplicados (relación inversa)
        DetalleNomina.hasMany(models.ConceptoAplicado, {
            foreignKey: 'id_detalle',
            as: 'conceptos_aplicados'
        });

        // Un Detalle de Nómina puede tener un Pago de Préstamo asociado (relación inversa, puede ser hasOne o hasMany dependiendo de la lógica)
        // Según tu script, pagos_prestamos tiene id_detalle_nomina FK nullable.
        // Un DetalleNomina *puede* estar referenciado por 0 o 1 PagosPrestamos si un pago cubre la cuota de nómina.
        // Un PagoPrestamo *puede* referenciar a 0 o 1 DetalleNomina (si el pago es manual).
        // Lo más común es hasMany en este lado y belongsTo en el otro, o hasOne si solo puede haber 1 pago por detalle.
        // La tabla pagos_prestamos tiene id_detalle_nomina INT, puede haber múltiples pagos de préstamo referenciando el MISMO detalle de nómina? No, un pago es un pago.
        // La FK está en pagos_prestamos, entonces belongsTo en PagosPrestamos.hasOne o hasMany aquí.
        // Si un pago de préstamo siempre se registra contra un *único* detalle de nómina (cuando se paga por nómina), entonces la relación inversa aquí podría ser hasOne o hasMany si permites múltiples pagos manuales referenciando el mismo detalle (poco probable).
        // Asumo que un detalle de nómina puede estar asociado a CERO o UN pago de préstamo registrado vía nómina.
        // Pero la tabla pagos_prestamos puede tener múltiples entradas para un mismo id_detalle_nomina FK si un pago cubre múltiples cuotas o conceptos? No, un pago es un monto.
        // La FK es `id_detalle_nomina`. Esto sugiere que cada fila en `pagos_prestamos` se *asocia* a un detalle de nómina específico (cuando aplica).
        // Un DetalleNomina puede estar referenciado por *múltiples* filas en pagos_prestamos si ese detalle de nómina incluye *varios* descuentos de préstamo? Sí, parece posible.
        DetalleNomina.hasMany(models.PagoPrestamo, {
             foreignKey: 'id_detalle_nomina', // La columna de clave foránea en la tabla 'pagos_prestamos'
             as: 'pagos_prestamo_asociados' // Alias para incluir
        });

        // Un Detalle de Nómina puede tener Horas Extras asociadas (relación inversa)
         DetalleNomina.hasMany(models.HoraExtra, {
             foreignKey: 'id_detalle_nomina', // La columna de clave foránea en la tabla 'horas_extras' (nullable)
             as: 'horas_extras_pagadas' // Alias para incluir
         });

        // Un Detalle de Nómina puede tener una Liquidación de Viático asociada (relación inversa, FK nullable)
         DetalleNomina.hasOne(models.LiquidacionViatico, { // Asumiendo que una liquidación solo se incluye en un detalle de nómina
             foreignKey: 'id_detalle_nomina', // La columna de clave foránea en la tabla 'liquidacion_viaticos' (nullable)
             as: 'liquidacion_viatico_incluida' // Alias para incluir
         });

        // Relaciones inversas de las asociaciones belongTo
        // Nomina tiene muchos DetalleNomina (definido en nominas.model.js)
        // Empleado tiene muchos DetalleNomina (definido en empleados.model.js)
    };

    return DetalleNomina;
};