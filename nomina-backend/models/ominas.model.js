// models/nominas.model.js
module.exports = (sequelize, DataTypes) => {
    const Nomina = sequelize.define('Nomina', {
        id_nomina: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_periodo: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        fecha_generacion: { // DATETIME en SQL
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('Borrador', 'Verificada', 'Aprobada', 'Pagada'),
            defaultValue: 'Borrador',
            allowNull: false
        },
        total_ingresos: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false
        },
        total_descuentos: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false
        },
        total_neto: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false
        },
        usuario_generacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        usuario_aprobacion: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fecha_aprobacion: { // DATETIME en SQL
            type: DataTypes.DATE,
            allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Nomina',
        tableName: 'nominas',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    Nomina.associate = function(models) {
        // Una Nómina pertenece a un Periodo de Pago
        Nomina.belongsTo(models.PeriodoPago, {
            foreignKey: {
                name: 'id_periodo',
                allowNull: false // Coincide con SQL
            },
            as: 'periodo_pago',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Una Nómina tiene muchos DetalleNomina (relación inversa)
        Nomina.hasMany(models.DetalleNomina, {
            foreignKey: 'id_nomina', // La columna de clave foránea en la tabla 'detalle_nomina' (NOT NULL en DB)
            as: 'detalles_nomina'
        });


        // Relación inversa
        // PeriodoPago tiene muchas Nominas (definido en periodosPago.model.js)
    };

    return Nomina;
};