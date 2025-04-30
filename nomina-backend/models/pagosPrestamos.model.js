// models/pagosPrestamos.model.js
module.exports = (sequelize, DataTypes) => {
    const PagoPrestamo = sequelize.define('PagoPrestamo', {
        id_pago: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_prestamo: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_detalle_nomina: { // Foreign Key (nullable)
            type: DataTypes.INTEGER,
            allowNull: true // Coincide con SQL
        },
        monto_pagado: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fecha_pago: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        tipo_pago: {
            type: DataTypes.ENUM('Nómina', 'Manual'),
            allowNull: false
        },
        observaciones: {
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
        modelName: 'PagoPrestamo',
        tableName: 'pagos_prestamos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    PagoPrestamo.associate = function(models) {
        // Un Pago de Préstamo pertenece a un Préstamo
        PagoPrestamo.belongsTo(models.Prestamo, {
            foreignKey: {
                name: 'id_prestamo',
                allowNull: false // Coincide con SQL
            },
            as: 'prestamo',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Pago de Préstamo puede pertenecer a un Detalle de Nómina (si se pagó por nómina)
        PagoPrestamo.belongsTo(models.DetalleNomina, {
             foreignKey: {
                 name: 'id_detalle_nomina',
                 allowNull: true // Coincide con SQL
             },
             as: 'detalle_nomina_pago',
             onDelete: 'SET NULL' // Coincide con default Sequelize para allowNull: true FKs
        });

        // Relaciones inversas
        // Prestamo tiene muchos PagosPrestamos (definido en prestamos.model.js)
        // DetalleNomina tiene muchos PagosPrestamos (definido en detalleNomina.model.js)
    };

    return PagoPrestamo;
};