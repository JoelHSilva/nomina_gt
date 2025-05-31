// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\models\tiposViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const TipoViatico = sequelize.define('TipoViatico', {
        id_tipo_viatico: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigo: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        monto_maximo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        requiere_factura: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        afecta_isr: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        // ¡Eliminada la línea `sequelize,` redundante!
        modelName: 'TipoViatico',
        tableName: 'tipos_viaticos',
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });

    TipoViatico.associate = function(models) {
        // Un Tipo de Viático puede estar en muchos Detalle Solicitud Viaticos (relación inversa)
        TipoViatico.hasMany(models.DetalleSolicitudViatico, {
            foreignKey: 'id_tipo_viatico',
            as: 'detalles_solicitud'
        });

        // Un Tipo de Viático puede estar en muchas Tarifas de Destino (relación inversa)
        TipoViatico.hasMany(models.TarifaDestino, {
            foreignKey: 'id_tipo_viatico',
            as: 'tarifas_destino'
        });

        // Un Tipo de Viático puede estar en muchas Politicas Viaticos Puesto (relación inversa)
        TipoViatico.hasMany(models.PoliticaViaticoPuesto, {
            foreignKey: 'id_tipo_viatico',
            as: 'politicas_puesto'
        });

        // Un Tipo de Viático puede estar en muchos Detalle Liquidacion Viaticos (relación inversa)
        TipoViatico.hasMany(models.DetalleLiquidacionViatico, {
            foreignKey: 'id_tipo_viatico',
            as: 'detalles_liquidacion'
        });
    };

    return TipoViatico;
};