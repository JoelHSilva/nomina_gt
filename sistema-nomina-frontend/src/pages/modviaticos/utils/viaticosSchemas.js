import * as Yup from 'yup';
import { isValidDate, isFutureDate } from './helpers';

// Esquema base para validación de fechas
const fechaSchema = Yup.string()
  .test('is-valid-date', 'Fecha inválida', value => isValidDate(value))
  .required('La fecha es requerida');

// Esquema para tipo de viático
const tipoViaticoSchema = Yup.object().shape({
  id_tipo_viatico: Yup.number()
    .required('El tipo de viático es requerido')
    .positive('ID inválido'),
  nombre: Yup.string().required('El nombre es requerido'),
  monto_maximo: Yup.number().nullable()
});

// Esquema para detalle de solicitud
const detalleSolicitudSchema = Yup.object().shape({
  id_tipo_viatico: Yup.number()
    .required('El tipo de viático es requerido')
    .positive('ID inválido'),
  descripcion: Yup.string()
    .required('La descripción es requerida')
    .max(200, 'Máximo 200 caracteres'),
  monto: Yup.number()
    .required('El monto es requerido')
    .positive('El monto debe ser positivo')
    .max(100000, 'El monto máximo es Q100,000')
});

// Esquema para detalle de liquidación
const detalleLiquidacionSchema = Yup.object().shape({
  id_tipo_viatico: Yup.number()
    .required('El tipo de viático es requerido')
    .positive('ID inválido'),
  fecha_gasto: fechaSchema
    .test('is-future-date', 'La fecha debe ser futura', value => isFutureDate(value)),
  descripcion: Yup.string()
    .required('La descripción es requerida')
    .max(200, 'Máximo 200 caracteres'),
  monto: Yup.number()
    .required('El monto es requerido')
    .positive('El monto debe ser positivo')
    .max(100000, 'El monto máximo es Q100,000'),
  numero_factura: Yup.string()
    .when('tiene_factura', {
      is: true,
      then: Yup.string()
        .required('El número de factura es requerido')
        .max(50, 'Máximo 50 caracteres')
    }),
  tiene_factura: Yup.boolean().default(true),
  nit_proveedor: Yup.string()
    .matches(/^[0-9]+(-[0-9kK])?$/, 'Formato de NIT inválido')
});

// Esquema principal para solicitud de viáticos
export const solicitudViaticoSchema = Yup.object().shape({
  id_empleado: Yup.number()
    .required('El empleado es requerido')
    .positive('ID inválido'),
  fecha_inicio_viaje: fechaSchema
    .test('is-future-date', 'La fecha debe ser futura', value => isFutureDate(value)),
  fecha_fin_viaje: fechaSchema
    .test('is-after-start', 'La fecha fin debe ser posterior a inicio', function(value) {
      return !value || !this.parent.fecha_inicio_viaje || new Date(value) >= new Date(this.parent.fecha_inicio_viaje);
    }),
  destino: Yup.string()
    .required('El destino es requerido')
    .max(200, 'Máximo 200 caracteres'),
  motivo: Yup.string()
    .required('El motivo es requerido')
    .min(10, 'Mínimo 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  detalles: Yup.array()
    .of(detalleSolicitudSchema)
    .min(1, 'Debe agregar al menos un detalle')
    .required('Los detalles son requeridos')
});

// Esquema para aprobación de solicitud
export const aprobacionSolicitudSchema = Yup.object().shape({
  aprobado: Yup.boolean().required('El estado de aprobación es requerido'),
  montoAprobado: Yup.number()
    .when('aprobado', {
      is: true,
      then: Yup.number()
        .required('El monto aprobado es requerido')
        .positive('El monto debe ser positivo')
        .max(100000, 'El monto máximo es Q100,000')
    }),
  observaciones: Yup.string().max(500, 'Máximo 500 caracteres')
});

// Esquema para registro de anticipo
export const anticipoSchema = Yup.object().shape({
  solicitudId: Yup.number()
    .required('La solicitud es requerida')
    .positive('ID inválido'),
  monto: Yup.number()
    .required('El monto es requerido')
    .positive('El monto debe ser positivo')
    .max(100000, 'El monto máximo es Q100,000'),
  metodoPago: Yup.string()
    .required('El método de pago es requerido')
    .oneOf(['Efectivo', 'Transferencia', 'Cheque'], 'Método inválido'),
  referencia: Yup.string()
    .when('metodoPago', {
      is: metodo => metodo !== 'Efectivo',
      then: Yup.string()
        .required('La referencia es requerida')
        .max(100, 'Máximo 100 caracteres')
    })
});

// Esquema para liquidación de viáticos
export const liquidacionSchema = Yup.object().shape({
  solicitudId: Yup.number()
    .required('La solicitud es requerida')
    .positive('ID inválido'),
  anticipoId: Yup.number()
    .required('El anticipo es requerido')
    .positive('ID inválido'),
  gastos: Yup.array()
    .of(detalleLiquidacionSchema)
    .min(1, 'Debe agregar al menos un gasto')
    .required('Los gastos son requeridos')
});

// Esquema para aprobación de liquidación
export const aprobacionLiquidacionSchema = Yup.object().shape({
  aprobado: Yup.boolean().required('El estado de aprobación es requerido'),
  observaciones: Yup.string().max(500, 'Máximo 500 caracteres')
});