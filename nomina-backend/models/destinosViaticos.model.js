// models/destinosViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const DestinoViatico = sequelize.define('DestinoViatico', {
        id_destino: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        es_internacional: {
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
            type: DataTypes.DATE, // DATETIME en SQL
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'DestinoViatico',
        tableName: 'destinos_viaticos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    DestinoViatico.associate = function(models) {
        // Un Destino de Viático puede tener muchas Tarifas de Destino (relación inversa de TarifaDestino.belongsTo(DestinoViatico))
        DestinoViatico.hasMany(models.TarifaDestino, {
            foreignKey: 'id_destino', // La columna de clave foránea en la tabla 'tarifas_destino'
            as: 'tarifas_destino'
        });
    };

    return DestinoViatico;
};