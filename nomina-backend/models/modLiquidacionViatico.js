// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\models\liquidacionviatico.model.js

const { DataTypes } = require('sequelize');
// Se eliminaron las importaciones redundantes de sequelize y otros modelos.
// Estos se pasan como argumentos o se acceden a través del objeto 'models'.

module.exports = (sequelize, DataTypes) => {
    const LiquidacionViatico = sequelize.define('LiquidacionViatico', {
        id_liquidacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_solicitud: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_liquidacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        monto_total_gastado: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        monto_anticipo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        saldo_favor_empresa: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        saldo_favor_empleado: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        estado: {
            type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Completada'),
            defaultValue: 'Pendiente'
        },
        aprobado_por: {
            type: DataTypes.INTEGER
        },
        fecha_aprobacion: {
            type: DataTypes.DATE
        },
        observaciones: {
            type: DataTypes.TEXT
        },
        incluido_en_nomina: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_detalle_nomina: {
            type: DataTypes.INTEGER
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'liquidacion_viaticos',
        timestamps: true,
        createdAt: 'fecha_creacion',
        //updatedAt: 'fecha_actualizacion'
    });

    // Definición de asociaciones
    LiquidacionViatico.associate = function(models) {
        // Asociación con SolicitudViatico
        LiquidacionViatico.belongsTo(models.SolicitudViatico, { 
            foreignKey: 'id_solicitud',
            as: 'solicitud'
        });
        
        // Asociación con DetalleNomina
        LiquidacionViatico.belongsTo(models.DetalleNomina, { 
            foreignKey: 'id_detalle_nomina',
            as: 'detalleNomina'
        });
        
        // Asociación con Usuario (aprobador)
        LiquidacionViatico.belongsTo(models.Usuario, { 
            foreignKey: 'aprobado_por',
            as: 'Aprobador'
        });

        // Asociación con DetalleLiquidacionViatico (corregido el nombre del modelo y el alias)
        LiquidacionViatico.hasMany(models.DetalleLiquidacionViatico, { 
            foreignKey: 'id_liquidacion', // Esta es la foreign key en DetalleLiquidacionViatico que apunta a LiquidacionViatico
            as: 'detalles_liquidacion'    // Alias sugerido para consistencia
        });
    };

    return LiquidacionViatico;
};