const { Op } = require('sequelize');
const db = require('../models');
const { Liquidacion, LiquidacionDetalle, Empleado, Ausencia, HoraExtra, Vacacion } = db;
const CalculosService = require('./calculos.service');

class LiquidacionService {
  constructor() {
    this.calculosService = new CalculosService();
  }

  async calcularLiquidacion(idEmpleado, fechaLiquidacion, tipoLiquidacion, motivo) {
    // Obtener datos del empleado
    const empleado = await Empleado.findByPk(idEmpleado, {
        include: [
            { model: HoraExtra, as: 'horas_extras', where: { estado: 'Pendiente' }, required: false },
            { model: Vacacion, as: 'vacaciones', where: { estado: 'Pendiente' }, required: false }
        ]
    });
    if (!empleado) {
        throw new Error('Empleado no encontrado');
    }

    // Crear nueva liquidación con todos los campos requeridos
    const liquidacion = await Liquidacion.create({
        id_empleado: idEmpleado,
        fecha_liquidacion: fechaLiquidacion,
        tipo_liquidacion: tipoLiquidacion,
        motivo: motivo,
        salario_base: empleado.salario_actual,
        estado: 'PENDIENTE',
        fecha: new Date(),
        tipo: tipoLiquidacion,
        periodo_inicio: new Date(fechaLiquidacion.getFullYear(), fechaLiquidacion.getMonth(), 1),
        periodo_fin: new Date(fechaLiquidacion.getFullYear(), fechaLiquidacion.getMonth() + 1, 0),
        bonificaciones: [],
        deducciones: [],
        total_bonificaciones: 0,
        total_deducciones: 0,
        total_liquido: empleado.salario_actual,
        observaciones: motivo,
        activo: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
    });

    // Calcular componentes según el tipo de liquidación
    switch (tipoLiquidacion) {
        case 'Renuncia':
            await this._calcularLiquidacionRenuncia(liquidacion, empleado);
            break;
        case 'Despido Justificado':
            await this._calcularLiquidacionDespidoJustificado(liquidacion, empleado);
            break;
        case 'Despido Injustificado':
            await this._calcularLiquidacionDespidoInjustificado(liquidacion, empleado);
            break;
        case 'Mutuo Acuerdo':
            await this._calcularLiquidacionMutuoAcuerdo(liquidacion, empleado);
            break;
        default:
            throw new Error('Tipo de liquidación no válido');
    }

    // Calcular descuentos obligatorios
    await this._calcularDescuentos(liquidacion, empleado);

    // Calcular total final
    await this._calcularTotal(liquidacion);

    // Guardar liquidación
    await liquidacion.save();

    // Generar detalles de la liquidación
    await this.generarDetalles(liquidacion);

    return liquidacion;
  }

  async _calcularLiquidacionRenuncia(liquidacion, empleado) {
    // En renuncia solo se paga lo proporcional
    const bonificaciones = [];
    const deducciones = [];

    // 1. Calcular salario proporcional
    const diasTrabajados = await this._calcularDiasTrabajados(empleado, liquidacion.fecha_liquidacion);
    const salarioProporcional = (empleado.salario_actual / 30) * diasTrabajados;
    bonificaciones.push({
        concepto: 'Salario Proporcional',
        monto: salarioProporcional,
        descripcion: `Salario proporcional por ${diasTrabajados} días trabajados`
    });

    // 2. Calcular aguinaldo proporcional
    const aguinaldo = await this._calcularAguinaldoProporcional(empleado, liquidacion.fecha_liquidacion);
    if (aguinaldo > 0) {
        bonificaciones.push({
            concepto: 'Aguinaldo Proporcional',
            monto: aguinaldo,
            descripcion: 'Aguinaldo proporcional pendiente'
        });
    }

    // 3. Calcular bono 14 proporcional
    const bono14 = await this._calcularBono14Proporcional(empleado, liquidacion.fecha_liquidacion);
    if (bono14 > 0) {
        bonificaciones.push({
            concepto: 'Bono 14 Proporcional',
            monto: bono14,
            descripcion: 'Bono 14 proporcional pendiente'
        });
    }

    // 4. Calcular horas extras pendientes
    const horasExtras = await this._calcularHorasExtrasPendientes(empleado, liquidacion.fecha_liquidacion);
    if (horasExtras > 0) {
        bonificaciones.push({
            concepto: 'Horas Extras Pendientes',
            monto: horasExtras,
            descripcion: 'Horas extras pendientes de pago'
        });
    }

    // Actualizar liquidación
    liquidacion.bonificaciones = bonificaciones;
    liquidacion.total_bonificaciones = bonificaciones.reduce((sum, b) => sum + b.monto, 0);
    liquidacion.deducciones = deducciones;
    liquidacion.total_deducciones = deducciones.reduce((sum, d) => sum + d.monto, 0);
    liquidacion.total_liquido = salarioProporcional + liquidacion.total_bonificaciones - liquidacion.total_deducciones;
  }

  async _calcularLiquidacionDespidoJustificado(liquidacion, empleado) {
    // En despido justificado se paga lo proporcional más vacaciones
    await this._calcularLiquidacionRenuncia(liquidacion, empleado);
    
    // Calcular vacaciones pendientes
    const vacaciones = await this._calcularVacacionesPendientes(empleado, liquidacion.fecha_liquidacion);
    if (vacaciones > 0) {
        const bonificaciones = liquidacion.bonificaciones || [];
        bonificaciones.push({
            concepto: 'Vacaciones Pendientes',
            monto: vacaciones,
            descripcion: 'Vacaciones pendientes más bono vacacional'
        });
        liquidacion.bonificaciones = bonificaciones;
        liquidacion.total_bonificaciones = bonificaciones.reduce((sum, b) => sum + b.monto, 0);
        liquidacion.total_liquido = liquidacion.salario_base + liquidacion.total_bonificaciones - liquidacion.total_deducciones;
    }
  }

  async _calcularLiquidacionDespidoInjustificado(liquidacion, empleado) {
    // En despido injustificado se paga todo más indemnización
    await this._calcularLiquidacionDespidoJustificado(liquidacion, empleado);
    
    // Calcular indemnización
    const indemnizacion = await this._calcularIndemnizacion(empleado, liquidacion.fecha_liquidacion);
    if (indemnizacion > 0) {
        const bonificaciones = liquidacion.bonificaciones || [];
        bonificaciones.push({
            concepto: 'Indemnización',
            monto: indemnizacion,
            descripcion: 'Indemnización por despido injustificado'
        });
        liquidacion.bonificaciones = bonificaciones;
        liquidacion.total_bonificaciones = bonificaciones.reduce((sum, b) => sum + b.monto, 0);
        liquidacion.total_liquido = liquidacion.salario_base + liquidacion.total_bonificaciones - liquidacion.total_deducciones;
    }
  }

  async _calcularLiquidacionMutuoAcuerdo(liquidacion, empleado) {
    // En mutuo acuerdo se paga todo según lo acordado
    await this._calcularLiquidacionDespidoJustificado(liquidacion, empleado);
  }

  async _calcularAguinaldoProporcional(empleado, fechaLiquidacion) {
    const fechaActual = new Date(fechaLiquidacion);
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();

    if (mesActual < 11) { // Si no es diciembre, calcular proporcional
        const diasTrabajadosSemestre = await this._calcularDiasTrabajadosSemestre(empleado, anioActual);
        return (empleado.salario_actual / 365) * diasTrabajadosSemestre;
    }
    return 0;
  }

  async _calcularBono14Proporcional(empleado, fechaLiquidacion) {
    const fechaActual = new Date(fechaLiquidacion);
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();

    if (mesActual < 6) { // Si no es julio, calcular proporcional
        const diasTrabajadosAnio = await this._calcularDiasTrabajadosAnio(empleado, anioActual);
        return (empleado.salario_actual / 365) * diasTrabajadosAnio;
    }
    return 0;
  }

  async _calcularVacacionesPendientes(empleado, fechaLiquidacion) {
    const añosTrabajados = (fechaLiquidacion - empleado.fecha_contratacion) / (1000 * 60 * 60 * 24 * 365);
    const diasVacaciones = Math.min(15, Math.floor(añosTrabajados * 15));
    const salarioDiario = empleado.salario_actual / 30;
    const montoVacaciones = salarioDiario * diasVacaciones;
    const bonoVacacional = montoVacaciones * 0.25; // 25% adicional según Art. 130
    return montoVacaciones + bonoVacacional;
  }

  async _calcularIndemnizacion(empleado, fechaLiquidacion) {
    const añosTrabajados = (fechaLiquidacion - empleado.fecha_contratacion) / (1000 * 60 * 60 * 24 * 365);
    return empleado.salario_actual * Math.floor(añosTrabajados);
  }

  async _calcularHorasExtrasPendientes(empleado, fechaLiquidacion) {
    const horasExtras = await HoraExtra.findAll({
        where: {
            id_empleado: empleado.id_empleado,
            fecha: {
                [Op.between]: [
                    new Date(fechaLiquidacion.getFullYear(), fechaLiquidacion.getMonth(), 1),
                    fechaLiquidacion
                ]
            },
            estado: 'Pendiente'
        }
    });

    const salarioHora = empleado.salario_actual / 240; // 240 horas mensuales (8 horas * 30 días)
    let totalHorasExtras = 0;

    for (const horaExtra of horasExtras) {
        let multiplicador = 1;
        switch (horaExtra.tipo) {
            case 'Diurna':
                multiplicador = 1.5; // 50% adicional
                break;
            case 'Nocturna':
                multiplicador = 2.0; // 100% adicional
                break;
            case 'Mixta':
                multiplicador = 1.75; // 75% adicional
                break;
            default:
                multiplicador = 1.5;
        }
        totalHorasExtras += salarioHora * multiplicador * horaExtra.horas;
    }

    return totalHorasExtras;
  }

  async _calcularDescuentos(liquidacion, empleado) {
    const deducciones = [];
    
    // Calcular base imponible para IGSS e ISR
    const baseImponible = liquidacion.salario_base + liquidacion.total_bonificaciones;

    // Calcular descuento IGSS
    const topeIGSS = 4167.17; // Tope IGSS 2024
    const baseIGSS = Math.min(baseImponible, topeIGSS);
    const igss = baseIGSS * 0.0483; // 4.83% IGSS
    if (igss > 0) {
        deducciones.push({
            concepto: 'Descuento IGSS',
            monto: igss,
            descripcion: 'Descuento IGSS (4.83%)'
        });
    }

    // Calcular ISR
    const baseISR = baseImponible - igss;
    let isr = 0;

    if (baseISR <= 300000) {
        isr = 0;
    } else if (baseISR <= 450000) {
        isr = (baseISR - 300000) * 0.05;
    } else if (baseISR <= 650000) {
        isr = 7500 + (baseISR - 450000) * 0.10;
    } else if (baseISR <= 900000) {
        isr = 27500 + (baseISR - 650000) * 0.15;
    } else if (baseISR <= 1200000) {
        isr = 65000 + (baseISR - 900000) * 0.20;
    } else if (baseISR <= 1500000) {
        isr = 125000 + (baseISR - 1200000) * 0.25;
    } else {
        isr = 200000 + (baseISR - 1500000) * 0.30;
    }

    if (isr > 0) {
        deducciones.push({
            concepto: 'Descuento ISR',
            monto: isr,
            descripcion: 'Descuento ISR según tabla progresiva'
        });
    }

    // Actualizar liquidación
    liquidacion.deducciones = deducciones;
    liquidacion.total_deducciones = deducciones.reduce((sum, d) => sum + d.monto, 0);
  }

  async _calcularTotal(liquidacion) {
    // Recalcular total líquido
    liquidacion.total_liquido = liquidacion.salario_base + liquidacion.total_bonificaciones - liquidacion.total_deducciones;
  }

  async generarDetalles(liquidacion) {
    const detalles = [];
    const fechaActual = new Date();

    // Agregar ingresos
    if (liquidacion.salario_base > 0) {
        detalles.push({
            id_liquidacion: liquidacion.id_liquidacion,
            concepto: 'Salario Base',
            tipo: 'Ingreso',
            monto: liquidacion.salario_base,
            descripcion: `Salario base por ${liquidacion.dias_trabajados} días`,
            created_at: fechaActual,
            updated_at: fechaActual
        });
    }

    if (liquidacion.aguinaldo > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Aguinaldo Pendiente',
        tipo: 'Ingreso',
        monto: liquidacion.aguinaldo,
        descripcion: 'Aguinaldo proporcional pendiente',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    if (liquidacion.bono_14 > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Bono 14 Pendiente',
        tipo: 'Ingreso',
        monto: liquidacion.bono_14,
        descripcion: 'Bono 14 proporcional pendiente',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    if (liquidacion.vacaciones > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Vacaciones Pendientes',
        tipo: 'Ingreso',
        monto: liquidacion.vacaciones,
        descripcion: 'Vacaciones pendientes más bono vacacional',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    if (liquidacion.indemnizacion > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Indemnización',
        tipo: 'Ingreso',
        monto: liquidacion.indemnizacion,
        descripcion: 'Indemnización por despido injustificado',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    if (liquidacion.horas_extras > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Horas Extras Pendientes',
        tipo: 'Ingreso',
        monto: liquidacion.horas_extras,
        descripcion: 'Horas extras pendientes de pago',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    // Agregar descuentos
    if (liquidacion.igss > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Descuento IGSS',
        tipo: 'Descuento',
        monto: liquidacion.igss,
        descripcion: 'Descuento IGSS (4.83%)',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    if (liquidacion.isr > 0) {
      detalles.push({
        id_liquidacion: liquidacion.id_liquidacion,
        concepto: 'Descuento ISR',
        tipo: 'Descuento',
        monto: liquidacion.isr,
        descripcion: 'Descuento ISR según tabla progresiva',
        created_at: fechaActual,
        updated_at: fechaActual
      });
    }

    // Agregar bonificaciones
    if (liquidacion.bonificaciones && liquidacion.bonificaciones.length > 0) {
        for (const bonificacion of liquidacion.bonificaciones) {
            detalles.push({
                id_liquidacion: liquidacion.id_liquidacion,
                concepto: bonificacion.concepto,
                tipo: 'Ingreso',
                monto: bonificacion.monto,
                descripcion: bonificacion.descripcion,
                created_at: fechaActual,
                updated_at: fechaActual
            });
        }
    }

    // Agregar deducciones
    if (liquidacion.deducciones && liquidacion.deducciones.length > 0) {
        for (const deduccion of liquidacion.deducciones) {
            detalles.push({
                id_liquidacion: liquidacion.id_liquidacion,
                concepto: deduccion.concepto,
                tipo: 'Descuento',
                monto: deduccion.monto,
                descripcion: deduccion.descripcion,
                created_at: fechaActual,
                updated_at: fechaActual
            });
        }
    }

    // Guardar todos los detalles
    if (detalles.length > 0) {
        await LiquidacionDetalle.bulkCreate(detalles);
    }
  }

  async _calcularDiasTrabajados(empleado, fechaLiquidacion) {
    // Obtener ausencias del último mes
    const ausencias = await Ausencia.findAll({
        where: {
            id_empleado: empleado.id_empleado,
            fecha_inicio: {
                [Op.gte]: new Date(fechaLiquidacion.getFullYear(), fechaLiquidacion.getMonth(), 1)
            },
            fecha_fin: {
                [Op.lte]: fechaLiquidacion
            },
            afecta_salario: true
        }
    });

    // Calcular días trabajados (30 días - ausencias)
    const diasAusencia = ausencias.reduce((total, ausencia) => {
        const inicio = new Date(ausencia.fecha_inicio);
        const fin = new Date(ausencia.fecha_fin);
        return total + Math.floor((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);

    return 30 - diasAusencia;
  }

  async _calcularDiasTrabajadosSemestre(empleado, anio) {
    const fechaInicio = new Date(anio, 0, 1); // 1 de enero
    const fechaFin = new Date(anio, 5, 30); // 30 de junio
    return await this._calcularDiasTrabajadosEnPeriodo(empleado, fechaInicio, fechaFin);
  }

  async _calcularDiasTrabajadosAnio(empleado, anio) {
    const fechaInicio = new Date(anio, 0, 1); // 1 de enero
    const fechaFin = new Date(anio, 11, 31); // 31 de diciembre
    return await this._calcularDiasTrabajadosEnPeriodo(empleado, fechaInicio, fechaFin);
  }

  async _calcularDiasTrabajadosEnPeriodo(empleado, fechaInicio, fechaFin) {
    const ausencias = await Ausencia.findAll({
        where: {
            id_empleado: empleado.id_empleado,
            fecha_inicio: {
                [Op.between]: [fechaInicio, fechaFin]
            },
            afecta_salario: true
        }
    });

    const diasAusencia = ausencias.reduce((total, ausencia) => {
        const inicio = new Date(Math.max(ausencia.fecha_inicio, fechaInicio));
        const fin = new Date(Math.min(ausencia.fecha_fin, fechaFin));
        return total + Math.floor((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);

    const diasTotales = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    return diasTotales - diasAusencia;
  }
}

module.exports = new LiquidacionService(); 