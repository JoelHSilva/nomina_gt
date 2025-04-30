// services/prestamos.service.js
const db = require('../models');

class PrestamosService {
  constructor() {
    this.models = db;
  }

  async crearPrestamo(datosPrestamo) {
    // Usa una transacción para asegurar la atomicidad si creas otras cosas o actualizas saldos iniciales
     const t = await this.models.sequelize.transaction();
     try {
        const { id_empleado, monto_total, cantidad_cuotas } = datosPrestamo;

        const empleado = await this.models.Empleado.findByPk(id_empleado, { transaction: t });
        if (!empleado) {
             await t.rollback();
             throw new Error('Empleado no encontrado');
        }

        if (cantidad_cuotas <= 0) {
             await t.rollback();
             throw new Error('La cantidad de cuotas debe ser mayor a cero');
        }

        const cuotaMensual = parseFloat((monto_total / cantidad_cuotas).toFixed(2));

        const nuevoPrestamo = await this.models.Prestamo.create({
          ...datosPrestamo,
          saldo_pendiente: monto_total, // Inicializar saldo pendiente
          cuota_mensual: cuotaMensual, // Calcular y guardar cuota mensual
          estado: 'Aprobado', // Estado inicial
          cuotas_pagadas: 0 // Inicializar cuotas pagadas
        }, { transaction: t });

        await t.commit();
        return nuevoPrestamo;

     } catch (error) {
         await t.rollback();
         console.error("Error creando préstamo:", error);
         throw error; // Relanza el error
     }
  }

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

         const pago = await this.models.PagoPrestamo.create({
           id_prestamo: idPrestamo,
           monto_pagado: montoPago,
           fecha_pago: new Date(), // Fecha del registro del pago
           tipo_pago: tipoPago,
           id_detalle_nomina: idDetalleNomina,
           activo: true // Asumimos que el registro de pago está activo
         }, { transaction: t });

         const nuevoSaldo = parseFloat((prestamo.saldo_pendiente - montoPago).toFixed(2));
         // Recalcular cuotas pagadas. Ojo: puede haber imprecisiones por decimales.
         // Un enfoque alternativo es contar cuántos pagos se han registrado o restar monto_pagado de monto_total hasta saldo=0.
         // Usando el cálculo basado en cuota mensual es aproximado.
         // const nuevasCuotasPagadas = Math.floor((prestamo.monto_total - nuevoSaldo) / prestamo.cuota_mensual); // Floor es más seguro?
         // O simplemente incrementar cuotas pagadas si el monto_pagado es igual a la cuota mensual esperada para ese pago.
         // Asumiremos que este montoPago es la cuota esperada o un abono.
         const nuevasCuotasPagadas = prestamo.cuotas_pagadas + 1; // Simplificación: asumir que cada registro de pago es una cuota

         await prestamo.update({
           saldo_pendiente: Math.max(0, nuevoSaldo), // Asegura que el saldo no sea negativo
           cuotas_pagadas: nuevasCuotasPagadas,
           estado: nuevoSaldo <= 0 ? 'Pagado' : 'En Curso'
         }, { transaction: t });

         // Si se creó una transacción aquí, commit
         if (!transaction) await t.commit();

         return { pago, prestamo }; // Devuelve el registro de pago y el préstamo actualizado

     } catch (error) {
         // Si se creó una transacción aquí, rollback
         if (!transaction) await t.rollback();
         console.error("Error procesando pago de préstamo:", error);
         throw error; // Relanza el error
     }
  }

   // La función aplicarPagosNomina que tenías parece que intentaba iterar nóminas para aplicar pagos.
   // Un enfoque más desacoplado es que la NominaService o el proceso de cálculo de nómina
   // sea quien determine los descuentos por préstamos y quizás cree los registros de PagoPrestamo.
   // Luego, la lógica para actualizar el saldo del Préstamo principal podría estar en un hook afterCreate
   // del modelo PagoPrestamo, o ser llamada explícitamente por el proceso que crea el PagoPrestamo.

   // Si necesitas un método en PrestamosService para obtener préstamos pendientes de un empleado para un periodo:
   async obtenerPrestamosPendientesEmpleado(idEmpleado, fechaFinPeriodo) {
       return await this.models.Prestamo.findAll({
           where: {
               id_empleado: idEmpleado,
               estado: 'En Curso',
               fecha_inicio: {
                   [this.models.Sequelize.Op.lte]: fechaFinPeriodo // Préstamo debe haber iniciado antes o en la fecha fin del periodo
               },
               saldo_pendiente: {
                   [this.models.Sequelize.Op.gt]: 0 // Que tenga saldo pendiente
               }
           }
           // Opcionalmente incluir PagosPrestamos para ver si la cuota del periodo ya fue cubierta manualmente
       });
   }

   // Puedes añadir otros métodos para obtener historial de pagos, etc.
}

module.exports = PrestamosService;