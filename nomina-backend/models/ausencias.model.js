// models/ausencias.model.js
module.exports = (sequelize, DataTypes) => {
    const Ausencia = sequelize.define('Ausencia', {
        id_ausencia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
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
        tipo: {
            type: DataTypes.ENUM('Permiso con goce', 'Permiso sin goce', 'Enfermedad', 'Suspensión IGSS', 'Otro'),
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        documento_respaldo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        estado: {
            type: DataTypes.ENUM('Solicitada', 'Aprobada', 'Rechazada', 'Completada'),
            defaultValue: 'Solicitada',
            allowNull: false
        },
        aprobado_por: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        afecta_salario: {
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
        modelName: 'Ausencia',
        tableName: 'ausencias',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    Ausencia.associate = function(models) {
        // Una Ausencia pertenece a un Empleado
        Ausencia.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL si no se especifica en FK y columna es NOT NULL
        });

        // Relación inversa (Empleado tiene muchas Ausencias)
        // Se define en empleados.model.js
    };

    return Ausencia;
};