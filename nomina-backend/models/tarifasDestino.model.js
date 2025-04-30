// models/tarifasDestino.model.js
module.exports = (sequelize, DataTypes) => {
    const TarifaDestino = sequelize.define('TarifaDestino', {
        id_tarifa: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_destino: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_viatico: { // Foreign Key (References tipos_viaticos)
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto_sugerido: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
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
        modelName: 'TarifaDestino',
        tableName: 'tarifas_destino',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true, // Coincide con config/DB
        // Definir unique constraint para id_destino y id_tipo_viatico
        indexes: [
            {
                unique: true,
                fields: ['id_destino', 'id_tipo_viatico']
            }
        ]
    });

    TarifaDestino.associate = function(models) {
        // Una Tarifa de Destino pertenece a un Destino de Viático
        TarifaDestino.belongsTo(models.DestinoViatico, {
            foreignKey: {
                name: 'id_destino',
                allowNull: false // Coincide con SQL
            },
            as: 'destino',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Una Tarifa de Destino pertenece a un Tipo de Viático
        TarifaDestino.belongsTo(models.TipoViatico, {
            foreignKey: {
                name: 'id_tipo_viatico',
                allowNull: false // Coincide con SQL
            },
            as: 'tipo_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });


        // Relaciones inversas
        // DestinoViatico tiene muchas TarifasDestino (definido en destinosViaticos.model.js)
        // TipoViatico tiene muchas TarifasDestino (definido en tiposViaticos.model.js)
    };

    return TarifaDestino;
};