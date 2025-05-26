module.exports = (sequelize, DataTypes) => {
    const Liquidacion = sequelize.define('Liquidacion', {
        id_liquidacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_empleado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'empleados',
                key: 'id_empleado'
            }
        },
        fecha_liquidacion: {
            type: DataTypes.DATE(6),
            allowNull: true
        },
        tipo_liquidacion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        motivo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        salario_base: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'PAGADA'),
            defaultValue: 'PENDIENTE',
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('Renuncia', 'Despido Justificado', 'Despido Injustificado', 'Mutuo Acuerdo'),
            allowNull: false
        },
        periodo_inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        periodo_fin: {
            type: DataTypes.DATE,
            allowNull: false
        },
        bonificaciones: {
            type: DataTypes.JSON,
            allowNull: true
        },
        deducciones: {
            type: DataTypes.JSON,
            allowNull: true
        },
        total_bonificaciones: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        total_deducciones: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false
        },
        total_liquido: {
            type: DataTypes.DECIMAL(10, 2),
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
            type: DataTypes.DATE,
            allowNull: false
        },
        fecha_modificacion: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Liquidacion',
        tableName: 'liquidaciones',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        hooks: {
            beforeSave: async (liquidacion) => {
                // Calcular total de bonificaciones
                let totalBonificaciones = 0;
                if (liquidacion.bonificaciones) {
                    try {
                        const bonificaciones = typeof liquidacion.bonificaciones === 'string' 
                            ? JSON.parse(liquidacion.bonificaciones) 
                            : liquidacion.bonificaciones;
                        
                        totalBonificaciones = bonificaciones.reduce((total, bonificacion) => {
                            return total + parseFloat(bonificacion.monto || 0);
                        }, 0);
                    } catch (error) {
                        console.error('Error al procesar bonificaciones:', error);
                    }
                }

                // Calcular total de deducciones
                let totalDeducciones = 0;
                if (liquidacion.deducciones) {
                    try {
                        const deducciones = typeof liquidacion.deducciones === 'string'
                            ? JSON.parse(liquidacion.deducciones)
                            : liquidacion.deducciones;
                        
                        totalDeducciones = deducciones.reduce((total, deduccion) => {
                            return total + parseFloat(deduccion.monto || 0);
                        }, 0);
                    } catch (error) {
                        console.error('Error al procesar deducciones:', error);
                    }
                }

                // Actualizar los totales
                liquidacion.total_bonificaciones = totalBonificaciones;
                liquidacion.total_deducciones = totalDeducciones;
                liquidacion.total_liquido = parseFloat(liquidacion.salario_base || 0) + totalBonificaciones - totalDeducciones;

                // Actualizar fecha_modificacion
                liquidacion.fecha_modificacion = new Date();
            }
        }
    });

    // Define associations
    Liquidacion.associate = function(models) {
        Liquidacion.belongsTo(models.Empleado, {
            foreignKey: 'id_empleado',
            as: 'empleado'
        });
        
        Liquidacion.hasMany(models.LiquidacionDetalle, {
            foreignKey: 'id_liquidacion',
            as: 'detalles'
        });
    };

    return Liquidacion;
}; 