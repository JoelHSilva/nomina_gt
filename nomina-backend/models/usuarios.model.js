// models/usuarios.model.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_usuario: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        contrasena: {
            type: DataTypes.STRING(255), // Guarda el hash de la contraseña
            allowNull: false
        },
        nombre_completo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM('Administrador', 'RRHH', 'Contador', 'Consulta'),
            allowNull: false
        },
        ultimo_acceso: {
            type: DataTypes.DATE, // DATETIME en SQL
            allowNull: true // Puede ser null si nunca ha accedido
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
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    Usuario.associate = function(models) {
        // Un Usuario puede generar muchos Logs de Sistema (relación inversa)
        Usuario.hasMany(models.LogSistema, {
            foreignKey: 'id_usuario', // La columna de clave foránea en la tabla 'logs_sistema' (nullable en DB)
            as: 'logs'
        });
    };

    return Usuario;
};