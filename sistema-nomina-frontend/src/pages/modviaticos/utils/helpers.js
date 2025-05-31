/**
 * Formatea una fecha a formato local
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada (ej: "15/03/2023")
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d.getTime()) 
    ? '' 
    : d.toLocaleDateString('es-GT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
};

/**
 * Formatea una cantidad monetaria
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: 'GTQ')
 * @returns {string} Cantidad formateada (ej: "Q1,250.50")
 */
export const formatCurrency = (amount, currency = 'GTQ') => {
  if (isNaN(amount)) return '';
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Valida si una cadena es una fecha válida
 * @param {string} dateString - Cadena con la fecha
 * @returns {boolean} True si es una fecha válida
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Valida si una fecha es futura (incluyendo hoy)
 * @param {string} dateString - Cadena con la fecha
 * @returns {boolean} True si es una fecha futura o hoy
 */
export const isFutureDate = (dateString) => {
  if (!isValidDate(dateString)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateString);
  return inputDate >= today;
};

/**
 * Calcula los días entre dos fechas
 * @param {string} startDate - Fecha de inicio
 * @param {string} endDate - Fecha de fin
 * @returns {number} Número de días entre las fechas
 */
export const calculateDaysBetween = (startDate, endDate) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Incluye ambos días
};

/**
 * Calcula los montos permitidos según políticas
 * @param {Array} politicas - Lista de políticas de viáticos
 * @param {Array} detalles - Detalles de viáticos solicitados
 * @returns {Object} { totalSolicitado, montosAprobados }
 */
export const calcularMontosPermitidos = (politicas, detalles) => {
  let totalSolicitado = 0;
  const montosAprobados = {};

  detalles.forEach(detalle => {
    const politica = politicas.find(p => p.id_tipo_viatico === detalle.id_tipo_viatico);
    const montoMaximo = politica?.monto_maximo_diario || Infinity;
    const montoAprobado = Math.min(detalle.monto, montoMaximo);
    
    montosAprobados[detalle.id_tipo_viatico] = montoAprobado;
    totalSolicitado += montoAprobado;
  });

  return { totalSolicitado, montosAprobados };
};

/**
 * Valida el formato de NIT guatemalteco
 * @param {string} nit - NIT a validar
 * @returns {boolean} True si el formato es válido
 */
export const isValidNIT = (nit) => {
  if (!nit) return true; // Opcional
  const regex = /^[0-9]+(-[0-9kK])?$/;
  return regex.test(nit);
};

/**
 * Calcula saldos de liquidación
 * @param {number} totalGastado - Total gastado
 * @param {number} montoAnticipo - Monto del anticipo
 * @returns {Object} { saldoFavorEmpresa, saldoFavorEmpleado }
 */
export const calcularSaldosLiquidacion = (totalGastado, montoAnticipo) => {
  const diferencia = totalGastado - montoAnticipo;
  return {
    saldoFavorEmpresa: Math.max(0, -diferencia),
    saldoFavorEmpleado: Math.max(0, diferencia)
  };
};

/**
 * Genera un nombre legible para el archivo de comprobante
 * @param {number} empleadoId - ID del empleado
 * @param {string} tipo - Tipo de comprobante
 * @returns {string} Nombre del archivo (ej: "viatico_45_alimentacion_20230315.jpg")
 */
export const generarNombreComprobante = (empleadoId, tipo) => {
  const now = new Date();
  const fecha = now.toISOString().split('T')[0].replace(/-/g, '');
  const hora = now.getHours().toString().padStart(2, '0') + 
               now.getMinutes().toString().padStart(2, '0');
  return `viatico_${empleadoId}_${tipo.toLowerCase()}_${fecha}_${hora}`;
};