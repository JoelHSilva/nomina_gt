// models/puestos.model.js
module.exports = (sequelize, DataTypes) => {
    const Puesto = sequelize.define('Puesto', {
        id_puesto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
             allowNull: true // Según tu script
        },
        salario_base: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        // La columna id_departamento es definida por la asociación belongsTo
        // id_departamento: { // No es necesario definirla aquí explícitamente si usas foreignKey en la asociación
        //    type: DataTypes.INTEGER,
        //    allowNull: true // Según tu script para la columna en la tabla 'puestos'
        // },
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
        modelName: 'Puesto',
        tableName: 'puestos',
        timestamps: false, // Coincide con tu script
        underscored: true, // Coincide con tu configuración global/script
        freezeTableName: true // Coincide con tu configuración global/script
    });

    // Definir asociaciones
    Puesto.associate = function(models) {
        // Un Puesto pertenece a un Departamento
        Puesto.belongsTo(models.Departamento, {
            foreignKey: {
                 name: 'id_departamento',
                 allowNull: true // Coincide con la definición INT en tu script (que es NULLABLE por defecto)
            },
            as: 'departamento', // Alias para incluir
            onDelete: 'SET NULL' // Coincide con default Sequelize para allowNull: true FKs (y compatible con SQL NULLABLE)
        });

        // Un Puesto tiene muchos Empleados
        Puesto.hasMany(models.Empleado, {
            foreignKey: 'id_puesto', // La columna de clave foránea en la tabla 'empleados' (NOT NULL en DB)
            as: 'empleados', // Alias para incluir
            // onUpdate: 'CASCADE', // Tu script no lo especifica, Sequelize lo aplica por defecto
            onDelete: 'RESTRICT' // Coincide con el comportamiento por defecto de MySQL para FKs NOT NULL sin ON DELETE
        });

        // Un Puesto tiene muchas Políticas de Viáticos por Puesto (relación inversa)
        Puesto.hasMany(models.PoliticaViaticoPuesto, {
            foreignKey: 'id_puesto', // La columna de clave foránea en la tabla 'politicas_viaticos_puesto' (NOT NULL en DB)
            as: 'politicas_viaticos'
        });
    };

    return Puesto;
};