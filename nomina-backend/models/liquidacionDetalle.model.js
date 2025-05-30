// models/liquidacionDetalle.model.js
module.exports = (sequelize, DataTypes) => {
    const LiquidacionDetalle = sequelize.define('LiquidacionDetalle', {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_liquidacion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'liquidaciones',
                key: 'id_liquidacion'
            }
        },
        concepto: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('Ingreso', 'Descuento'),
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'LiquidacionDetalle',
        tableName: 'liquidaciones_detalle',
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });

    LiquidacionDetalle.associate = function(models) {
        LiquidacionDetalle.belongsTo(models.Liquidacion, {
            foreignKey: 'id_liquidacion',
            as: 'liquidacion'
        });
    };

    return LiquidacionDetalle;
}; 