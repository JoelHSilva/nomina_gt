// models/departamentos.model.js
module.exports = (sequelize, DataTypes) => {
    const Departamento = sequelize.define('Departamento', {
        id_departamento: {
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
        sequelize, // Pasa la instancia de sequelize
        modelName: 'Departamento', // Define el nombre del modelo
        tableName: 'departamentos', // Especifica el nombre exacto de la tabla
        timestamps: false, // Coincide con tu script (no hay createdAt/updatedAt)
        underscored: true, // Coincide con tu configuración global/script (snake_case)
        freezeTableName: true // Coincide con tu configuración global/script (evita pluralización)
    });

    // Definir asociaciones
    Departamento.associate = function(models) {
        // Un Departamento tiene muchos Puestos
        Departamento.hasMany(models.Puesto, {
            foreignKey: 'id_departamento', // La columna de clave foránea en la tabla 'puestos'
            as: 'puestos' // Alias para incluir en consultas
            // ON DELETE SET NULL es compatible aquí ya que id_departamento en puestos es nullable en tu DB.
            // No es necesario especificar onDelete si SET NULL es el comportamiento deseado y allowNull es true.
        });
    };

    return Departamento;
};