// models/periodosPago.model.js
module.exports = (sequelize, DataTypes) => {
    const PeriodoPago = sequelize.define('PeriodoPago', {
        id_periodo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        fecha_inicio: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        fecha_fin: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        fecha_pago: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('Quincenal', 'Mensual', 'Bono14', 'Aguinaldo', 'Otro'),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('Abierto', 'Procesando', 'Cerrado'),
            defaultValue: 'Abierto',
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
        modelName: 'PeriodoPago',
        tableName: 'periodos_pago',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true, // Coincide con config/DB
        // Definir unique constraint para fecha_inicio, fecha_fin, tipo
        indexes: [
            {
                unique: true,
                fields: ['fecha_inicio', 'fecha_fin', 'tipo']
            }
        ]
    });

    PeriodoPago.associate = function(models) {
        // Un Periodo de Pago tiene muchas Nóminas (relación inversa)
        PeriodoPago.hasMany(models.Nomina, {
            foreignKey: 'id_periodo', // La columna de clave foránea en la tabla 'nominas' (NOT NULL en DB)
            as: 'nominas'
        });
    };

    return PeriodoPago;
};