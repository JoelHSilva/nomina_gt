// models/anticiposViaticos.model.js
module.exports = (sequelize, DataTypes) => {
    const AnticipoViatico = sequelize.define('AnticipoViatico', {
        id_anticipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_solicitud: { // Foreign Key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        fecha_entrega: {
            type: DataTypes.DATEONLY, // DATE en SQL
            allowNull: false
        },
        metodo_pago: {
            type: DataTypes.ENUM('Efectivo', 'Transferencia', 'Cheque'),
            allowNull: false
        },
        referencia_pago: {
            type: DataTypes.STRING(100),
            allowNull: true // VARCHAR sin NOT NULL es nullable
        },
        entregado_por: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        recibido_por: {
            type: DataTypes.STRING(100),
            allowNull: false
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
        modelName: 'AnticipoViatico',
        tableName: 'anticipos_viaticos',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    AnticipoViatico.associate = function(models) {
        // Un Anticipo pertenece a una Solicitud de Viático
        AnticipoViatico.belongsTo(models.SolicitudViatico, {
            foreignKey: {
                name: 'id_solicitud',
                allowNull: false // Coincide con SQL
            },
            as: 'solicitud_viatico',
            onDelete: 'RESTRICT' // Coincide con default MySQL si no se especifica en FK y columna es NOT NULL
        });

        // Relación inversa (SolicitudViatico tiene muchos AnticiposViaticos)
        // Se define en solicitudesViaticos.model.js
    };

    return AnticipoViatico;
};