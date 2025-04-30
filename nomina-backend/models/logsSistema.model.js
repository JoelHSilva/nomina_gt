// models/logsSistema.model.js
module.exports = (sequelize, DataTypes) => {
    const LogSistema = sequelize.define('LogSistema', {
        id_log: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: { // Foreign Key (nullable)
            type: DataTypes.INTEGER,
            allowNull: true // Coincide con SQL (FK permite NULL)
        },
        accion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tabla_afectada: {
            type: DataTypes.STRING(100),
            allowNull: true // VARCHAR sin NOT NULL es nullable
        },
        id_registro: { // Puede ser el ID del registro afectado, es nullable en SQL
            type: DataTypes.INTEGER,
            allowNull: true
        },
        datos_anteriores: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        datos_nuevos: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        direccion_ip: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        fecha_hora: { // DATETIME en SQL
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'LogSistema',
        tableName: 'logs_sistema',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    LogSistema.associate = function(models) {
        // Un Log de Sistema puede pertenecer a un Usuario (si aplica)
        LogSistema.belongsTo(models.Usuario, {
            foreignKey: {
                name: 'id_usuario',
                allowNull: true // Coincide con SQL
            },
            as: 'usuario',
            onDelete: 'SET NULL' // Coincide con default Sequelize para allowNull: true FKs
        });

        // Relación inversa (Usuario tiene muchos LogsSistema)
        // Se define en usuarios.model.js
    };

    return LogSistema;
};