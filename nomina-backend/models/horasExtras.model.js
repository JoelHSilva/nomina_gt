// models/horasExtras.model.js
module.exports = (sequelize, DataTypes) => {
    const HoraExtra = sequelize.define('HoraExtra', {
        id_hora_extra: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        horas: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Pagada'),
            defaultValue: 'Pendiente',
            allowNull: false
        },
        aprobado_por: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        id_detalle_nomina: { // Foreign Key (nullable)
            type: DataTypes.INTEGER,
            allowNull: true // Coincide con SQL
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
        modelName: 'HoraExtra',
        tableName: 'horas_extras',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    HoraExtra.associate = function(models) {
        // Una Hora Extra pertenece a un Empleado
        HoraExtra.belongsTo(models.Empleado, {
            foreignKey: {
                name: 'id_empleado',
                allowNull: false // Coincide con SQL
            },
            as: 'empleado',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Una Hora Extra puede pertenecer a un Detalle de Nómina (si ya fue pagada en una nómina)
        HoraExtra.belongsTo(models.DetalleNomina, {
             foreignKey: {
                 name: 'id_detalle_nomina',
                 allowNull: true // Coincide con SQL
             },
             as: 'detalle_nomina_pago',
             onDelete: 'SET NULL' // Coincide con default Sequelize para allowNull: true FKs
        });

        // Relaciones inversas
        // Empleado tiene muchas HorasExtras (definido en empleados.model.js)
        // DetalleNomina tiene muchas HorasExtras (definido en detalleNomina.model.js)
    };

    return HoraExtra;
};