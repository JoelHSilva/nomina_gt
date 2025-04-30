// models/configuracionFiscal.model.js
module.exports = (sequelize, DataTypes) => {
    const ConfiguracionFiscal = sequelize.define('ConfiguracionFiscal', {
        id_configuracion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        anio: {
            type: DataTypes.INTEGER, // YEAR en SQL, mapeamos a INTEGER
            allowNull: false,
            unique: true // UNIQUE(anio) en SQL
        },
        porcentaje_igss_empleado: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        porcentaje_igss_patronal: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        rango_isr_tramo1: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        porcentaje_isr_tramo1: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        rango_isr_tramo2: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        porcentaje_isr_tramo2: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        monto_bonificacion_incentivo: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        fecha_actualizacion: { // DATETIME en SQL
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ConfiguracionFiscal',
        tableName: 'configuracion_fiscal',
        timestamps: false, // Coincide con SQL
        underscored: true, // Coincide con config/DB o convención
        freezeTableName: true // Coincide con config/DB
    });

    // ConfiguracionFiscal no tiene claves foráneas salientes ni entrantes en tu script SQL
    ConfiguracionFiscal.associate = function(models) {
        // No hay asociaciones definidas por FK en tu script SQL para esta tabla.
        // Las referencias en Procedimientos Almacenados no se mapean automáticamente a asociaciones Sequelize.
    };

    return ConfiguracionFiscal;
};