const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Puesto = require('./puestos.model');
const TipoViatico = require('./modTipoViatico');

module.exports = (sequelize, DataTypes) => {
    const PoliticaViatico = sequelize.define('PoliticaViatico', {
        id_politica: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_puesto: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_viatico: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto_maximo_diario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'politicas_viaticos_puesto',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion',
        indexes: [
            {
                unique: true,
                fields: ['id_puesto', 'id_tipo_viatico']
            }
        ]
    });

    // Definición de asociaciones
    PoliticaViatico.associate = function(models) {
        PoliticaViatico.belongsTo(models.Puesto, { 
            foreignKey: 'id_puesto',
            as: 'puesto'
        });
        
        PoliticaViatico.belongsTo(models.TipoViatico, { 
            foreignKey: 'id_tipo_viatico',
            as: 'tipoViatico'
        });
    };

    return PoliticaViatico;
};