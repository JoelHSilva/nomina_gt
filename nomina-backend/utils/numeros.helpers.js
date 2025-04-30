module.exports = {
    formatoMoneda(valor, moneda = 'GTQ') {
      return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: moneda,
        minimumFractionDigits: 2
      }).format(valor);
    },
  
    redondear(valor, decimales = 2) {
      return parseFloat(valor.toFixed(decimales));
    },
  
    porcentaje(valor, total) {
      return this.redondear((valor / total) * 100);
    },
  
    esNumero(valor) {
      return !isNaN(parseFloat(valor)) && isFinite(valor);
    },
  
    generarCodigo(longitud = 8) {
      const chars = '0123456789';
      let result = '';
      for (let i = 0; i < longitud; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  };