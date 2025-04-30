// models/conceptosPago.model.js (Corrected associations based on SQL FKs)
module.exports = (sequelize, DataTypes) => {
    const ConceptoPago = sequelize.define('ConceptoPago', {
        id_concepto: {
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
        tipo: {
            type: DataTypes.ENUM('Ingreso', 'Descuento', 'Aporte'),
            allowNull: false
        },
        es_fijo: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        afecta_igss: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        afecta_isr: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        es_viatico: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        porcentaje: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        monto_fijo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        obligatorio: {
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
        sequelize,
        modelName: 'ConceptoPago',
        tableName: 'conceptos_pago',
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });

    ConceptoPago.associate = function(models) {
        // Un Concepto de Pago puede estar en muchos Conceptos Aplicados
        ConceptoPago.hasMany(models.ConceptoAplicado, {
            foreignKey: 'id_concepto',
            as: 'conceptos_aplicados'
        });
        // No hay otras FKs en tu script que referencien a `conceptos_pago`.
    };

    return ConceptoPago;
};