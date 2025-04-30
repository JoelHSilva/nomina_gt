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
    let isrAnual = 0;

    // **Nota:** Tu script SQL tiene rangos de ISR en la tabla configuracion_fiscal,
    // pero la base imponible del ISR en Guatemala tiene exenciones (Q. 48,000 + IVA).
    // Este cálculo básico es un punto de partida, pero la lógica real de ISR es más compleja
    // y considera deducciones personales, IVA pagado, etc.

    // Asumiendo que los rangos en config son la base imponible anual
    const baseImponibleAnual = Math.max(0, salarioAnual - 48000); // Ejemplo básico de exención

    if (baseImponibleAnual > config.rango_isr_tramo1) { // Tramo 1 (ej: Q. 0 a 300,000 de base imponible)
      if (baseImponibleAnual <= config.rango_isr_tramo2) { // Base imponible dentro del Tramo 1 después de la exención
         // Cálculo para el primer tramo (si aplica después de exención)
        isrAnual = (baseImponibleAnual) * (config.porcentaje_isr_tramo1 / 100);
         // Nota: Tu lógica original usaba (salarioAnual - config.rango_isr_tramo1), lo cual sería si el rango_isr_tramo1 fuera la exención.
         // Si rango_isr_tramo1 es el límite del primer tramo (ej: 300000), la lógica cambia.
         // Basado en tu script SQL, rango_isr_tramo1 es 48000 (exento) y rango_isr_tramo2 es 300000 (límite primer tramo).
         // Ajustando cálculo a la lógica común de tramos ISR en Guatemala:
        if (baseImponibleAnual <= config.rango_isr_tramo2) { // Si la base imponible anual está en el tramo del 5%
             isrAnual = baseImponibleAnual * (config.porcentaje_isr_tramo1 / 100);
        } else { // Si la base imponible anual excede el primer tramo (pasa al 7%)
             // ISR sobre el primer tramo (hasta el límite del tramo 1)
             isrAnual = config.rango_isr_tramo2 * (config.porcentaje_isr_tramo1 / 100);
             // ISR sobre el excedente (segundo tramo)
             isrAnual += (baseImponibleAnual - config.rango_isr_tramo2) * (config.porcentaje_isr_tramo2 / 100);
        }

      } else { // Base imponible excede el Tramo 2 (si hubiera más tramos, que no es el caso en tu DB)
          // Tu script solo define 2 tramos relevantes para el cálculo porcentual.
          // Si salarioAnual > rango_isr_tramo2 (300000), se aplica el 7% al excedente sobre 300000.
           isrAnual = config.rango_isr_tramo2 * (config.porcentaje_isr_tramo1 / 100); // ISR del primer tramo completo
           isrAnual += (baseImponibleAnual - config.rango_isr_tramo2) * (config.porcentaje_isr_tramo2 / 100); // ISR del segundo tramo
      }
    }
    // Si baseImponibleAnual <= rango_isr_tramo1 (48000), isrAnual es 0.

    return {
      isrMensual: parseFloat((isrAnual / 12).toFixed(2)),
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