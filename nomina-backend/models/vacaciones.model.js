// models/vacaciones.model.js
module.exports = (sequelize, DataTypes) => {
    const Vacacion = sequelize.define('Vacacion', {
        id_vacaciones: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_solicitud: {
            type: DataTypes.DATEONLY, // DATE en SQL
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
        dias_tomados: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('Solicitada', 'Aprobada', 'Rechazada', 'Cancelada', 'Completada'),
            defaultValue: 'Solicitada',
            allowNull: false
        },
        aprobado_por: {
            type: DataTypes.STRING(100),
            allowNull: true
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
        modelName: 'Vacacion',
        tableName: 'vacaciones',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    Vacacion.associate = function(models) {
        // Una Vacación pertenece a un Empleado
        Vacacion.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Relación inversa (Empleado tiene muchas Vacaciones)
        // Se define en empleados.model.js
    };

    return Vacacion;};