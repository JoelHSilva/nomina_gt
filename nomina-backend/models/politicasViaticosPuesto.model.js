// models/politicasViaticosPuesto.model.js
module.exports = (sequelize, DataTypes) => {
    const PoliticaViaticoPuesto = sequelize.define('PoliticaViaticoPuesto', {
        id_politica: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_puesto: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_viatico: { // Foreign Key (References tipos_viaticos)
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto_maximo_diario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
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
        modelName: 'PoliticaViaticoPuesto',
        tableName: 'politicas_viaticos_puesto',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true, // Coincide con config/DB
        // Definir unique constraint para id_puesto y id_tipo_viatico
        indexes: [
            {
                unique: true,
                fields: ['id_puesto', 'id_tipo_viatico']
            }
        ]
    });

    PoliticaViaticoPuesto.associate = function(models) {
        // Una Política de Viático por Puesto pertenece a un Puesto
        PoliticaViaticoPuesto.belongsTo(models.Puesto, {
            foreignKey: {
                name: 'id_puesto',
                allowNull: false // Coincide con SQL
            },
            as: 'puesto',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Una Política de Viático por Puesto pertenece a un Tipo de Viático
        PoliticaViaticoPuesto.belongsTo(models.TipoViatico, {
            foreignKey: {
                name: 'id_tipo_viatico',
                allowNull: false // Coincide con SQL
            },
            as: 'tipo_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Relaciones inversas
        // Puesto puede tener muchas PoliticasViaticosPuesto (definido en puestos.model.js - añadir)
        // TipoViatico puede tener muchas PoliticasViaticosPuesto (definido en tiposViaticos.model.js - añadir)
    };

    return PoliticaViaticoPuesto;
};