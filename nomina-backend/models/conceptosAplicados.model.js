// models/conceptosAplicados.model.js
module.exports = (sequelize, DataTypes) => {
    const ConceptoAplicado = sequelize.define('ConceptoAplicado', {
        id_concepto_aplicado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_detalle: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_concepto: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        observacion: {
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
        modelName: 'ConceptoAplicado',
        tableName: 'conceptos_aplicados',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    ConceptoAplicado.associate = function(models) {
        // Un Concepto Aplicado pertenece a un Detalle de Nómina
        ConceptoAplicado.belongsTo(models.DetalleNomina, {
            foreignKey: {
                name: 'id_detalle',
                allowNull: false // Coincide con SQL
            },
            as: 'detalle_nomina',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Concepto Aplicado pertenece a un Concepto de Pago
        ConceptoAplicado.belongsTo(models.ConceptoPago, {
            foreignKey: {
                name: 'id_concepto',
                allowNull: false // Coincide con SQL
            },
            as: 'concepto_pago',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Relaciones inversas
        // DetalleNomina tiene muchos ConceptosAplicados (definido en detalleNomina.model.js)
        // ConceptoPago tiene muchos ConceptosAplicados (definido en conceptosPago.model.js)
    };

    return ConceptoAplicado;
};