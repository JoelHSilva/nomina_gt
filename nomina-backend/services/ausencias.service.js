const db = require('../models');
const { Op } = require('sequelize');
const fechaHelpers = require('../utils/fecha.helpers');

class AusenciasService {
    constructor() {
        this.models = db;
    }

    /**
     * Calcula los días trabajados considerando las ausencias aprobadas en un período
     * @param {number} idEmpleado - ID del empleado
     * @param {Date} fechaInicio - Fecha de inicio del período
     * @param {Date} fechaFin - Fecha de fin del período
     * @returns {Promise<{diasTrabajados: number, diasAusencia: number, detalleAusencias: Array}>}
     */
    async calcularDiasTrabajadosConAusencias(idEmpleado, fechaInicio, fechaFin) {
        try {
            console.log(`DEBUG: Calculando días trabajados para empleado ${idEmpleado}`);
            console.log(`DEBUG: Período: ${fechaInicio} a ${fechaFin}`);

            // Validar fechas
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);
            
            if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
                console.error('ERROR: Fechas inválidas:', { fechaInicio, fechaFin });
                throw new Error('Las fechas del período son inválidas');
            }

            // Obtener todas las ausencias aprobadas del empleado en el período
            const ausencias = await this.models.Ausencia.findAll({
                where: {
                    id_empleado: idEmpleado,
                    estado: 'Aprobada',
                    activo: true,
                    [Op.or]: [
                        // Ausencias que empiezan en el período
                        {
                            fecha_inicio: {
                                [Op.between]: [fechaInicio, fechaFin]
                            }
                        },
                        // Ausencias que terminan en el período
                        {
                            fecha_fin: {
                                [Op.between]: [fechaInicio, fechaFin]
                            }
                        },
                        // Ausencias que cubren todo el período
                        {
                            [Op.and]: [
                                { fecha_inicio: { [Op.lte]: fechaInicio } },
                                { fecha_fin: { [Op.gte]: fechaFin } }
                            ]
                        }
                    ]
                },
                order: [['fecha_inicio', 'ASC']]
            });

            console.log(`DEBUG: Ausencias encontradas: ${ausencias.length}`);

            // Calcular días totales del período (excluyendo domingos)
            let diasTotales = 0;
            let fechaActual = new Date(fechaInicioDate);
            while (fechaActual <= fechaFinDate) {
                if (fechaHelpers.esDiaHabil(fechaActual)) {
                    diasTotales++;
                }
                fechaActual.setDate(fechaActual.getDate() + 1);
            }

            console.log(`DEBUG: Días totales del período (excluyendo domingos): ${diasTotales}`);

            // Calcular días de ausencia que afectan el salario
            let diasAusencia = 0;
            const detalleAusencias = [];

            for (const ausencia of ausencias) {
                console.log(`DEBUG: Procesando ausencia ID ${ausencia.id_ausencia}: ${ausencia.tipo}`);
                
                // Ajustar fechas de ausencia al período si es necesario
                const fechaInicioAusencia = new Date(Math.max(new Date(ausencia.fecha_inicio), fechaInicioDate));
                const fechaFinAusencia = new Date(Math.min(new Date(ausencia.fecha_fin), fechaFinDate));

                // Calcular días hábiles de ausencia
                let diasAusenciaActual = 0;
                let fechaTemp = new Date(fechaInicioAusencia);
                while (fechaTemp <= fechaFinAusencia) {
                    if (fechaHelpers.esDiaHabil(fechaTemp)) {
                        diasAusenciaActual++;
                    }
                    fechaTemp.setDate(fechaTemp.getDate() + 1);
                }

                console.log(`DEBUG: Ausencia ${ausencia.id_ausencia}: ${diasAusenciaActual} días hábiles`);

                // Solo contar días si la ausencia afecta el salario
                if (ausencia.afecta_salario) {
                    diasAusencia += diasAusenciaActual;
                    console.log(`DEBUG: Ausencia ${ausencia.id_ausencia} afecta salario. Total días ausencia: ${diasAusencia}`);
                }

                // Guardar detalle de la ausencia
                detalleAusencias.push({
                    tipo: ausencia.tipo,
                    fecha_inicio: ausencia.fecha_inicio,
                    fecha_fin: ausencia.fecha_fin,
                    dias: diasAusenciaActual,
                    afecta_salario: ausencia.afecta_salario,
                    motivo: ausencia.motivo
                });
            }

            // Calcular días efectivamente trabajados
            const diasTrabajados = diasTotales - diasAusencia;

            console.log(`DEBUG: Resumen para empleado ${idEmpleado}:`);
            console.log(`- Días totales del período: ${diasTotales}`);
            console.log(`- Días de ausencia: ${diasAusencia}`);
            console.log(`- Días trabajados: ${diasTrabajados}`);

            return {
                diasTrabajados: Math.max(0, diasTrabajados), // No permitir días negativos
                diasAusencia,
                diasTotales,
                detalleAusencias
            };
        } catch (error) {
            console.error('Error al calcular días trabajados con ausencias:', error);
            throw error;
        }
    }

    /**
     * Obtiene el detalle de ausencias de un empleado en un período
     * @param {number} idEmpleado - ID del empleado
     * @param {Date} fechaInicio - Fecha de inicio del período
     * @param {Date} fechaFin - Fecha de fin del período
     * @returns {Promise<Array>} Lista de ausencias con su detalle
     */
    async obtenerAusenciasPeriodo(idEmpleado, fechaInicio, fechaFin) {
        try {
            const ausencias = await this.models.Ausencia.findAll({
                where: {
                    id_empleado: idEmpleado,
                    estado: 'Aprobada',
                    activo: true,
                    [Op.or]: [
                        {
                            fecha_inicio: {
                                [Op.between]: [fechaInicio, fechaFin]
                            }
                        },
                        {
                            fecha_fin: {
                                [Op.between]: [fechaInicio, fechaFin]
                            }
                        },
                        {
                            [Op.and]: [
                                { fecha_inicio: { [Op.lte]: fechaInicio } },
                                { fecha_fin: { [Op.gte]: fechaFin } }
                            ]
                        }
                    ]
                },
                order: [['fecha_inicio', 'ASC']]
            });

            return ausencias;
        } catch (error) {
            console.error('Error al obtener ausencias del período:', error);
            throw error;
        }
    }
}

module.exports = AusenciasService; 