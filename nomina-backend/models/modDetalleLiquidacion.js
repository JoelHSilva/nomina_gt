const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const LiquidacionViatico = require('./modLiquidacionViatico');
const TipoViatico = require('./modTipoViatico');

module.exports = (sequelize, DataTypes) => {
    const DetalleLiquidacion = sequelize.define('DetalleLiquidacion', {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_liquidacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_viatico: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_gasto: {
            type: DataTypes.DATEONLY,
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
            type: DataTypes.STRING(50)
        },
        nombre_proveedor: {
            type: DataTypes.STRING(200)
        },
        nit_proveedor: {
            type: DataTypes.STRING(15)
        },
        tiene_factura: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        imagen_comprobante: {
            type: DataTypes.STRING(255)
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'detalle_liquidacion_viaticos',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    // Definición de asociaciones
    DetalleLiquidacion.associate = function(models) {
        DetalleLiquidacion.belongsTo(models.LiquidacionViatico, { 
            foreignKey: 'id_liquidacion',
            as: 'liquidacion'
        });
        
        DetalleLiquidacion.belongsTo(models.TipoViatico, { 
            foreignKey: 'id_tipo_viatico',
            as: 'tipoViatico'
        });
    };

    return DetalleLiquidacion;
};