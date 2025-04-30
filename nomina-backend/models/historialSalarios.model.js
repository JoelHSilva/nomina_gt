// models/historialSalarios.model.js
module.exports = (sequelize, DataTypes) => {
    const HistorialSalario = sequelize.define('HistorialSalario', {
        id_historial: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        salario_anterior: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        salario_nuevo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fecha_cambio: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        autorizado_por: {
            type: DataTypes.STRING(100),
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
        modelName: 'HistorialSalario',
        tableName: 'historial_salarios',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    HistorialSalario.associate = function(models) {
        // Un Historial de Salario pertenece a un Empleado
        HistorialSalario.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Relación inversa (Empleado tiene muchos HistorialSalarios)
        // Se define en empleados.model.js
    };

    return HistorialSalario;
};