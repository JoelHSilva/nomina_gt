// models/liquidacionViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const LiquidacionViatico = sequelize.define('LiquidacionViatico', {
        id_liquidacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_solicitud: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_liquidacion: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        monto_total_gastado: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        monto_anticipo: { // Este campo puede ser redundante si siempre calculas el anticipo sumando anticipos_viaticos
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        saldo_favor_empresa: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false // Según tu script, tiene default pero es NOT NULL
        },
        saldo_favor_empleado: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false // Según tu script, tiene default pero es NOT NULL
        },
        estado: {
            type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Completada'),
            defaultValue: 'Pendiente',
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
        incluido_en_nomina: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        id_detalle_nomina: { // Foreign Key (nullable)
            type: DataTypes.INTEGER,
            allowNull: true // Coincide con SQL
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
        modelName: 'LiquidacionViatico',
        tableName: 'liquidacion_viaticos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    LiquidacionViatico.associate = function(models) {
        // Una Liquidación de Viático pertenece a una Solicitud de Viático
        LiquidacionViatico.belongsTo(models.SolicitudViatico, {
            foreignKey: {
                name: 'id_solicitud',
                allowNull: false // Coincide con SQL
            },
            as: 'solicitud_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Una Liquidación de Viático puede pertenecer a un Detalle de Nómina (si fue incluida en una nómina)
        LiquidacionViatico.belongsTo(models.DetalleNomina, {
             foreignKey: {
                 name: 'id_detalle_nomina',
                 allowNull: true // Coincide con SQL
             },
             as: 'detalle_nomina_inclusion',
             onDelete: 'SET NULL' // Coincide con default Sequelize para allowNull: true FKs
        });

        // Una Liquidación de Viático tiene muchos DetalleLiquidacionViaticos (relación inversa)
        LiquidacionViatico.hasMany(models.DetalleLiquidacionViatico, {
            foreignKey: 'id_liquidacion', // La columna de clave foránea en la tabla 'detalle_liquidacion_viaticos' (NOT NULL en DB)
            as: 'detalles_liquidacion'
        });


        // Relaciones inversas
        // SolicitudViatico tiene una LiquidacionViatico (puede ser hasOne o hasMany, basado en el diseño)
        // DetalleNomina tiene una LiquidacionViatico (si la incluyó) (definido en detalleNomina.model.js)
    };

    return LiquidacionViatico;
};