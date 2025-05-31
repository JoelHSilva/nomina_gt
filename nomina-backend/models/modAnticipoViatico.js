const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SolicitudViatico = require('./modSolicitudViatico');
const Usuario = require('./usuarios.model');

module.exports = (sequelize, DataTypes) => {
    const AnticipoViatico = sequelize.define('AnticipoViatico', {
        id_anticipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_solicitud: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fecha_entrega: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        metodo_pago: {
            type: DataTypes.ENUM('Efectivo', 'Transferencia', 'Cheque'),
            allowNull: false
        },
        referencia_pago: {
            type: DataTypes.STRING(100)
        },
        entregado_por: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recibido_por: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        observaciones: {
            type: DataTypes.TEXT
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'anticipos_viaticos',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    // Definición de asociaciones
    AnticipoViatico.associate = function(models) {
        AnticipoViatico.belongsTo(models.SolicitudViatico, { 
            foreignKey: 'id_solicitud',
            as: 'solicitud'  // Puedes cambiar este alias si lo prefieres
        });
        
        AnticipoViatico.belongsTo(models.Usuario, { 
            foreignKey: 'entregado_por',
            as: 'Entregador'  // Manteniendo el mismo alias que en tu versión original
        });
    };

    return AnticipoViatico;
};