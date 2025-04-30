// models/detalleLiquidacionViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const DetalleLiquidacionViatico = sequelize.define('DetalleLiquidacionViatico', {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_liquidacion: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_viatico: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_gasto: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        numero_factura: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        nombre_proveedor: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        nit_proveedor: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        tiene_factura: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        imagen_comprobante: {
            type: DataTypes.STRING(255),
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
        modelName: 'DetalleLiquidacionViatico',
        tableName: 'detalle_liquidacion_viaticos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    DetalleLiquidacionViatico.associate = function(models) {
        // Un Detalle de Liquidación de Viático pertenece a una Liquidación de Viático
        DetalleLiquidacionViatico.belongsTo(models.LiquidacionViatico, {
            foreignKey: {
                name: 'id_liquidacion',
                allowNull: false // Coincide con SQL
            },
            as: 'liquidacion_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Detalle de Liquidación de Viático pertenece a un Tipo de Viático
        DetalleLiquidacionViatico.belongsTo(models.TipoViatico, {
            foreignKey: {
                name: 'id_tipo_viatico',
                allowNull: false // Coincide con SQL
            },
            as: 'tipo_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Relaciones inversas
        // LiquidacionViatico tiene muchos DetalleLiquidacionViaticos (definido en liquidacionViaticos.model.js)
        // TipoViatico tiene muchos DetalleLiquidacionViaticos (definido en tiposViaticos.model.js)
    };

    return DetalleLiquidacionViatico;
};