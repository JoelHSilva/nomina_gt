// models/detalleSolicitudViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const DetalleSolicitudViatico = sequelize.define('DetalleSolicitudViatico', {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_solicitud: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_viatico: { // Foreign Key (References tipos_viaticos)
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true // Según tu script
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
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
        modelName: 'DetalleSolicitudViatico',
        tableName: 'detalle_solicitud_viaticos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    DetalleSolicitudViatico.associate = function(models) {
        // Un Detalle de Solicitud de Viático pertenece a una Solicitud de Viático
        DetalleSolicitudViatico.belongsTo(models.SolicitudViatico, {
            foreignKey: {
                name: 'id_solicitud',
                allowNull: false // Coincide con SQL
            },
            as: 'solicitud_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Un Detalle de Solicitud de Viático pertenece a un Tipo de Viático
        DetalleSolicitudViatico.belongsTo(models.TipoViatico, {
            foreignKey: {
                name: 'id_tipo_viatico',
                allowNull: false // Coincide con SQL
            },
            as: 'tipo_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL
        });

        // Relaciones inversas
        // SolicitudViatico tiene muchos DetalleSolicitudViaticos (definido en solicitudesViaticos.model.js)
        // TipoViatico tiene muchos DetalleSolicitudViaticos (definido en tiposViaticos.model.js)
    };

    return DetalleSolicitudViatico;
};