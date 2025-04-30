// models/solicitudesViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const SolicitudViatico = sequelize.define('SolicitudViatico', {
        id_solicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_solicitud: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        fecha_inicio_viaje: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        fecha_fin_viaje: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        destino: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        monto_solicitado: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        monto_aprobado: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true // Según tu script
        },
        estado: {
            type: DataTypes.ENUM('Solicitada', 'Aprobada', 'Rechazada', 'Liquidada', 'Cancelada'),
            defaultValue: 'Solicitada',
            allowNull: false
        },
        aprobado_por: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_aprobacion: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: true
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        fecha_creacion: {
            type: DataTypes.DATE, // DATETIME en SQL
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SolicitudViatico',
        tableName: 'solicitudes_viaticos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    SolicitudViatico.associate = function(models) {
        // Una Solicitud de Viático pertenece a un Empleado
        SolicitudViatico.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Una Solicitud de Viático tiene muchos Detalles de Solicitud de Viáticos (relación inversa)
        SolicitudViatico.hasMany(models.DetalleSolicitudViatico, {
            foreignKey: 'id_solicitud', // La columna de clave foránea en la tabla 'detalle_solicitud_viaticos' (NOT NULL en DB)
            as: 'detalles_solicitud'
        });

         // Una Solicitud de Viático tiene muchos Anticipos de Viáticos (relación inversa)
        SolicitudViatico.hasMany(models.AnticipoViatico, {
            foreignKey: 'id_solicitud', // La columna de clave foránea en la tabla 'anticipos_viaticos' (NOT NULL en DB)
            as: 'anticipos'
        });

         // Una Solicitud de Viático puede tener una Liquidación de Viático (relación inversa, asumo 0 o 1 liquidación por solicitud)
        SolicitudViatico.hasOne(models.LiquidacionViatico, { // O hasMany si una solicitud puede tener múltiples liquidaciones? (poco común)
            foreignKey: 'id_solicitud', // La columna de clave foránea en la tabla 'liquidacion_viaticos' (NOT NULL en DB)
            as: 'liquidacion'
        });


        // Relación inversa (Empleado tiene muchas SolicitudesViaticos)
        // Se define en empleados.model.js
        // Una Solicitud de Viático puede estar relacionada con Destinos de Viáticos a través de Tarifas de Destino (Many-to-Many implícita)
        // No hay FK directa entre solicitudes_viaticos y destinos_viaticos.
    };

    return SolicitudViatico;
};