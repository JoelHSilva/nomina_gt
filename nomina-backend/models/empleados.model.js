// models/empleados.model.js
module.exports = (sequelize, DataTypes) => {
        const Empleado = sequelize.define('Empleado', {
            id_empleado: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            codigo_empleado: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true // Mantener único: esencial
            },
            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            apellido: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            dpi: {
                type: DataTypes.STRING(13),
                allowNull: false,
                unique: true // Mantener único: esencial
            },
            nit: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: true // Mantener único: esencial
            },
            numero_igss: {
                type: DataTypes.STRING(20),
                // REMOVIDO para reducir el conteo de índices definidos por el modelo
                // unique: true,
                allowNull: true
            },
            fecha_nacimiento: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            genero: {
                type: DataTypes.ENUM('M', 'F', 'O'),
                allowNull: false
            },
            direccion: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            telefono: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            correo_electronico: {
                type: DataTypes.STRING(100),
                // REMOVIDO para reducir el conteo de índices definidos por el modelo
                // unique: true,
                allowNull: true
            },
            fecha_contratacion: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            fecha_fin_contrato: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            tipo_contrato: {
                type: DataTypes.ENUM('Indefinido', 'Plazo fijo', 'Por obra'),
                allowNull: false
            },
            salario_actual: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            cuenta_bancaria: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            banco: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            estado: {
                type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido', 'Vacaciones'),
                defaultValue: 'Activo',
                allowNull: false
            },
            activo: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Empleado',
            tableName: 'empleados',
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            // Asegurarse de que NO hay un array 'indexes' aquí que duplique índices únicos o añada muchos otros.
            // Si tienes un array 'indexes', revísalo cuidadosamente.
        });
    
        // Definir asociaciones
        Empleado.associate = function(models) {
            // Un Empleado pertenece a un Puesto
            Empleado.belongsTo(models.Puesto, {
                foreignKey: {
                    name: 'id_puesto',
                    allowNull: false
                },
                as: 'puesto',
                onDelete: 'RESTRICT'
            });
    
            // Un Empleado tiene muchos DetalleNomina
            Empleado.hasMany(models.DetalleNomina, {
                foreignKey: 'id_empleado',
                as: 'nominas'
            });
    
            // Un Empleado tiene muchos Prestamos
            Empleado.hasMany(models.Prestamo, {
                foreignKey: 'id_empleado',
                as: 'prestamos'
            });
    
            // Un Empleado tiene muchas Vacaciones
            Empleado.hasMany(models.Vacacion, {
                foreignKey: 'id_empleado',
                as: 'vacaciones'
            });
    
            // Un Empleado tiene muchas Ausencias
            Empleado.hasMany(models.Ausencia, {
                foreignKey: 'id_empleado',
                as: 'ausencias'
            });
    
            // Un Empleado tiene muchas Horas Extras
            Empleado.hasMany(models.HoraExtra, {
                foreignKey: 'id_empleado',
                as: 'horas_extras'
            });
    
            // Un Empleado tiene muchos Historial Salarios
            Empleado.hasMany(models.HistorialSalario, {
                foreignKey: 'id_empleado',
                as: 'historial_salarios'
            });
    
            // Un Empleado tiene muchas Solicitudes de Viaticos
            Empleado.hasMany(models.SolicitudViatico, {
                foreignKey: 'id_empleado',
                as: 'solicitudes_viaticos'
            });
        };
    
        return Empleado;
    };