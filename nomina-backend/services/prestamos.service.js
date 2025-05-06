// services/prestamos.service.js
const db = require('../models'); // Asegúrate de que la ruta a tus modelos sea correcta

class PrestamosService {
  constructor() {
    this.models = db;
  }

  async crearPrestamo(datosPrestamo) {
    // Usa una transacción para asegurar la atomicidad
     const t = await this.models.sequelize.transaction();
     try {
        // Extraer solo los campos que se esperan del frontend al CREAR un préstamo
        // El frontend modificado ya no envía saldo_pendiente, cuotas_pagadas, fecha_fin_estimada en CREACIÓN
        const { id_empleado, monto_total, cantidad_cuotas, fecha_inicio, motivo, estado } = datosPrestamo;

        // Validaciones básicas
        if (!id_empleado) {
             await t.rollback();
             throw new Error('ID de empleado es requerido.');
        }
        const empleado = await this.models.Empleado.findByPk(id_empleado, { transaction: t });
        if (!empleado) {
             await t.rollback();
             throw new Error('Empleado no encontrado');
        }

        if (monto_total === undefined || monto_total <= 0) {
             await t.rollback();
             throw new Error('Monto total debe ser mayor a cero.');
        }

        if (cantidad_cuotas === undefined || cantidad_cuotas <= 0) {
             await t.rollback();
             throw new Error('La cantidad de cuotas debe ser mayor a cero');
        }

        if (!fecha_inicio) {
             await t.rollback();
             throw new Error('La fecha de inicio es requerida');
        }

        // Calcular la cuota mensual
        const cuotaMensual = parseFloat((monto_total / cantidad_cuotas).toFixed(2));

        // --- LÓGICA PARA CALCULAR fecha_fin_estimada ---
        try {
            const fechaInicioDate = new Date(fecha_inicio);
            // Clonar la fecha para no modificar la original si se usa en otro lugar
            const fechaFinEstimadaDate = new Date(fechaInicioDate); 
            // Sumar la cantidad de cuotas (meses)
            fechaFinEstimadaDate.setMonth(fechaFinEstimadaDate.getMonth() + cantidad_cuotas);

            // Ajuste para manejar el caso en que el día del mes original no existe en el mes resultante
            const diaOriginal = fechaInicioDate.getDate();
            if (fechaFinEstimadaDate.getDate() < diaOriginal) {
                 fechaFinEstimadaDate.setDate(0); // Ir al último día del mes anterior (el mes correcto)
            }
            // Formatear a 'YYYY-MM-DD' para la base de datos
            const fecha_fin_estimada = fechaFinEstimadaDate.toISOString().split('T')[0];

             // --- FIN LÓGICA PARA CALCULAR fecha_fin_estimada ---

            // Crear el registro en la base de datos con los valores inicializados por el backend
            const nuevoPrestamo = await this.models.Prestamo.create({
                // Campos recibidos del frontend
                id_empleado,
                monto_total,
                cantidad_cuotas,
                fecha_inicio,
                motivo: motivo || null, // Asegurar null si es vacío
                estado: estado || 'Aprobado', // Usar el estado si vino, o el default

                // Campos inicializados/calculados por el backend
                saldo_pendiente: monto_total, // Inicializar saldo pendiente
                cuota_mensual: cuotaMensual, // Usar la cuota calculada
                cuotas_pagadas: 0, // Inicializar cuotas pagadas
                fecha_fin_estimada: fecha_fin_estimada, // <-- Usar la fecha calculada
                // activo y fecha_creacion usan los DEFAULT de la BD
            }, { transaction: t });

            await t.commit();
            return nuevoPrestamo;

        } catch (dateError) {
            // Manejar errores específicos del cálculo de la fecha
             await t.rollback();
             console.error("Error calculando fecha fin estimada o creando préstamo:", dateError);
             throw new Error('Error al calcular la fecha de fin estimada o crear el préstamo: ' + dateError.message);
        }


     } catch (error) {
         await t.rollback();
         console.error("Error en servicio crearPrestamo:", error); // Log más específico
         // Relanzar errores controlados o lanzar un error genérico si es inesperado
          if (error.message.includes('Empleado no encontrado') || error.message.includes('mayor a cero') || error.message.includes('requerida')) {
             throw error; // Relanza errores de validación conocidos
          } else {
             // Otros errores, quizás de Sequelize o BD
             console.error("Detalle del error:", error);
             throw new Error('Error interno al procesar la creación del préstamo.');
          }
     }
  }

  // --- Método para procesar pagos de préstamos ---
   // Este método parece correcto para su propósito básico de registrar un pago manual o de nómina.
   // La lógica de actualizar saldo y cuotas pagadas está presente.
   async procesarPagoPrestamo(idPrestamo, montoPago, tipoPago = 'Manual', idDetalleNomina = null, transaction = null) {
      // Permite pasar una transacción existente (útil si se llama desde un proceso de nómina)
      const options = transaction ? { transaction } : {};

      const prestamo = await this.models.Prestamo.findByPk(idPrestamo, options);
      if (!prestamo) {
          throw new Error('Préstamo no encontrado');
      }

      if (prestamo.saldo_pendiente <= 0) {
        throw new Error('Este préstamo ya está pagado');
      }

      // Usa una transacción si no se pasó una
      const t = transaction || await this.models.sequelize.transaction();
      try {

          // Validación adicional aquí si es necesario (ej: montoPago no excede saldo pendiente)

          const pago = await this.models.PagoPrestamo.create({
            id_prestamo: idPrestamo,
            monto_pagado: montoPago,
            fecha_pago: new Date(), // Fecha del registro del pago
            tipo_pago: tipoPago,
            id_detalle_nomina: idDetalleNomina,
            activo: true // Asumimos que el registro de pago está activo
          }, { transaction: t });

          // Actualizar saldo pendiente
          const nuevoSaldo = parseFloat((prestamo.saldo_pendiente - montoPago).toFixed(2));
          
          // Recalcular cuotas pagadas. Ojo: la simplificación de +1 por cada pago podría no ser precisa
          // si los pagos son irregulares o por montos distintos a la cuota mensual.
          // Podrías considerar recalcular `cuotas_pagadas` basado en `monto_total - nuevoSaldo` dividido por `cuota_mensual`
          // o mantenerlo solo informativo y enfocarte en el `saldo_pendiente`.
          const nuevasCuotasPagadas = prestamo.cuotas_pagadas + 1; 

          await prestamo.update({
            saldo_pendiente: Math.max(0, nuevoSaldo), // Asegura que el saldo no sea negativo
            cuotas_pagadas: nuevasCuotasPagadas,
            estado: nuevoSaldo <= 0 ? 'Pagado' : 'En Curso' // Actualiza el estado
          }, { transaction: t });

          // Si se creó una transacción aquí, commit
          if (!transaction) await t.commit();

          return { pago, prestamoActualizado: prestamo }; // Devuelve el registro de pago y el préstamo actualizado

      } catch (error) {
          // Si se creó una transacción aquí, rollback
          if (!transaction) await t.rollback();
          console.error("Error procesando pago de préstamo en servicio:", error); // Log más específico
          throw error; // Relanza el error
      }
   }

   // Método para obtener préstamos pendientes de un empleado (útil para nómina)
    async obtenerPrestamosPendientesEmpleado(idEmpleado, fechaFinPeriodo) {
        return await this.models.Prestamo.findAll({
            where: {
                id_empleado: idEmpleado,
                estado: 'En Curso', // Solo préstamos en curso
                fecha_inicio: {
                    [this.models.Sequelize.Op.lte]: fechaFinPeriodo // Iniciados antes o en la fecha fin del periodo
                },
                saldo_pendiente: {
                    [this.models.Sequelize.Op.gt]: 0 // Que aún tengan saldo pendiente
                }
            }
            // Opcionalmente incluir PagosPrestamos si necesitas verificar pagos recientes no aplicados en nómina anterior
        });
    }

    // Puedes añadir otros métodos (ej: obtenerPagosPorPrestamoId)
}

module.exports = PrestamosService;