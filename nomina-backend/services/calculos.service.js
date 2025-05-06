// services/calculos.service.js
const db = require('../models'); // Accede a los modelos a través del objeto db

class CalculosService {
  constructor() {
    this.models = db; // Guarda el objeto db en la instancia
  }

  async calcularIGSS(salario, anio) {
    const config = await this.models.ConfiguracionFiscal.findOne({
      where: { anio, activo: true }
    });

    if (!config) {
      // Es mejor lanzar un error con un mensaje claro
      throw new Error(`No hay configuración fiscal activa para el año ${anio}`);
    }

    // El cálculo del IGSS se basa en el salario mensual
    return parseFloat((salario * (config.porcentaje_igss_empleado / 100)).toFixed(2)); // Asegura float y 2 decimales
  }

  async calcularISR(salarioMensual, anio) {
    const config = await this.models.ConfiguracionFiscal.findOne({
      where: { anio, activo: true }
    });

    if (!config) {
       throw new Error(`No hay configuración fiscal activa para el año ${anio}`);
    }

    const salarioAnual = salarioMensual * 12;
    let isrAnual = 0; // Inicializa ISR anual en 0

    // Asumimos que la ConfiguracionFiscal tiene campos que representan:
    // - rango_isr_tramo1: El monto de la exención anual total (Q48,000)
    // - rango_isr_tramo2: El límite superior del primer tramo imponible (Q300,000)
    // - porcentaje_isr_tramo1: El porcentaje para el primer tramo (5%)
    // - porcentaje_isr_tramo2: El porcentaje para el segundo tramo (7%)

    // Usamos valores de config si existen, de lo contrario, valores estándar de Guatemala
    const exencionAnual = config.rango_isr_tramo1 || 48000;
    const limitePrimerTramoImponible = config.rango_isr_tramo2 || 300000;
    const porcentajePrimerTramo = (config.porcentaje_isr_tramo1 / 100) || 0.05;
    const porcentajeSegundoTramo = (config.porcentaje_isr_tramo2 / 100) || 0.07;


    // 1. Calcular la base imponible anual después de restar la exención.
    // Si el resultado es negativo, la base imponible es 0.
    const baseImponibleAnual = Math.max(0, salarioAnual - exencionAnual);

    // 2. Aplicar los tramos de ISR sobre la base imponible anual calculada.
    if (baseImponibleAnual > 0) { // Solo calcular si hay base imponible positiva
        if (baseImponibleAnual <= limitePrimerTramoImponible) {
            // La base imponible cae en el primer tramo (hasta el límite definido por config.rango_isr_tramo2, usualmente 300,000)
            isrAnual = baseImponibleAnual * porcentajePrimerTramo;
        } else {
            // La base imponible excede el primer tramo, calcular para ambos tramos
            // ISR sobre la porción del primer tramo (hasta el límite)
            isrAnual = limitePrimerTramoImponible * porcentajePrimerTramo;
            // ISR sobre la porción que excede el primer tramo (en el segundo tramo)
            isrAnual += (baseImponibleAnual - limitePrimerTramoImponible) * porcentajeSegundoTramo;
        }
    }
    // Si baseImponibleAnual es <= 0, isrAnual se mantiene en 0, lo cual es correcto.

    return {
      isrMensual: parseFloat((isrAnual / 12).toFixed(2)), // Dividir ISR anual entre 12 para el monto mensual
      isrAnual: parseFloat(isrAnual.toFixed(2))
    };
  }

  async calcularSalarioDiario(salarioMensual) {
    // En Guatemala se consideran 30 días para cálculo de salario diario
    return parseFloat((salarioMensual / 30).toFixed(2));
  }

   // Nota: Bono 14 y Aguinaldo se calculan sobre el promedio del último año o salario de los últimos 6 meses.
   // Calcular con salario mensual actual y días trabajados en el periodo no es el cálculo legal exacto.
   // La lógica de tu DB tiene 'dias_trabajados' en detalle_nomina, que podría referirse a los días del PERIODO, no del año/semestre.
   // Asumiendo que 'diasTrabajados' aquí se refiere a los días trabajados en el periodo de cálculo para Bono 14/Aguinaldo (ej: si un empleado entró a mitad de año para Bono 14)
   // La lógica real de Bono 14/Aguinaldo es más compleja (proporcionalidad por tiempo trabajado en el período de cálculo).

  async calcularBono14Proporcional(salarioMensual, diasTrabajadosAnio) {
      const salarioDiario = await this.calcularSalarioDiario(salarioMensual);
      // 365 o 366 días en el año para cálculo proporcional legal
      return parseFloat(((salarioDiario * diasTrabajadosAnio) / 365).toFixed(2)); // Asumiendo 365 días
  }

  async calcularAguinaldoProporcional(salarioMensual, diasTrabajadosSemestre) {
       const salarioDiario = await this.calcularSalarioDiario(salarioMensual);
       // 180 o 184 días en el semestre para cálculo proporcional legal (depende si semestre es de Jul-Dic o Ene-Jun)
       // Simplificando a 182.5 días (365 / 2) para el semestre promedio
       return parseFloat(((salarioDiario * diasTrabajadosSemestre) / 182.5).toFixed(2));
  }


  async calcularHorasExtras(salarioMensual, horasExtras) {
    const salarioDiario = await this.calcularSalarioDiario(salarioMensual);
    const salarioHora = parseFloat((salarioDiario / 8).toFixed(2)); // Jornada de 8 horas
    return parseFloat((salarioHora * horasExtras * 1.5).toFixed(2)); // 50% de recargo
  }
}

module.exports = CalculosService;