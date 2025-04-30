// models/prestamos.model.js
module.exports = (sequelize, DataTypes) => {
    const Prestamo = sequelize.define('Prestamo', {
        id_prestamo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        saldo_pendiente: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cuota_mensual: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cantidad_cuotas: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cuotas_pagadas: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        fecha_inicio: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        fecha_fin_estimada: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('Aprobado', 'En Curso', 'Pagado', 'Cancelado'),
            defaultValue: 'Aprobado',
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
        modelName: 'Prestamo',
        tableName: 'prestamos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    Prestamo.associate = function(models) {
        // Un Préstamo pertenece a un Empleado
        Prestamo.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Préstamo tiene muchos Pagos de Préstamos (relación inversa)
        Prestamo.hasMany(models.PagoPrestamo, {
            foreignKey: 'id_prestamo', // La columna de clave foránea en la tabla 'pagos_prestamos' (NOT NULL en DB)
            as: 'pagos'
        });

        // Relación inversa (Empleado tiene muchos Prestamos)
        // Se define en empleados.model.js
    };

    return Prestamo;
};