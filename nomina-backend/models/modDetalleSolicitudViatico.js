// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\models\solicitudviatico.js

const { DataTypes } = require('sequelize');
// ELIMINADA: const sequelize = require('../config/database'); // Esto era redundante

module.exports = (sequelize, DataTypes) => { // Sequelize y DataTypes se pasan como argumentos
    const SolicitudViatico = sequelize.define('SolicitudViatico', {
        id_solicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_solicitud: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        fecha_inicio_viaje: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_fin_viaje: {
            type: DataTypes.DATEONLY,
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
            type: DataTypes.DECIMAL(10, 2)
        },
        estado: {
            type: DataTypes.ENUM('Solicitada', 'Aprobada', 'Rechazada', 'Liquidada', 'Cancelada'),
            defaultValue: 'Solicitada'
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
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'solicitudes_viaticos',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    // Definición de asociaciones
    SolicitudViatico.associate = function(models) {
        console.log('DEBUG (SolicitudViatico.associate): Entrando a la función associate.');
        console.log('DEBUG (SolicitudViatico.associate): Contenido de models (claves):', Object.keys(models));
        console.log('DEBUG (SolicitudViatico.associate): models.Usuario es:', models.Usuario ? 'DEFINIDO' : 'UNDEFINED');
        if (models.Usuario) {
            console.log('DEBUG (SolicitudViatico.associate): models.Usuario.name es:', models.Usuario.name);
        }

        // Relación con Empleado
        SolicitudViatico.belongsTo(models.Empleado, { 
            foreignKey: 'id_empleado',
            as: 'empleado'
        });
        
        // Relación con Usuario (aprobador)
        SolicitudViatico.belongsTo(models.Usuario, { 
            foreignKey: 'aprobado_por',
            as: 'Aprobador' 
        });

        // Asociación con DetalleSolicitudViatico
        SolicitudViatico.hasMany(models.DetalleSolicitudViatico, {
            foreignKey: 'id_solicitud', // Esta es la foreign key en DetalleSolicitudViatico que apunta a SolicitudViatico
            as: 'detalles_solicitud' // ¡Este es el alias que tus consultas esperaban!
        });

        // OTRAS ASOCIACIONES (si las tienes)
        SolicitudViatico.hasOne(models.AnticipoViatico, { 
            foreignKey: 'id_solicitud',
            as: 'anticipo' 
        });
        SolicitudViatico.hasOne(models.LiquidacionViatico, { 
            foreignKey: 'id_solicitud',
            as: 'liquidacion' 
        });
    };

    return SolicitudViatico;
};