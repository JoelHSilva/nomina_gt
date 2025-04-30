module.exports = {
    formatoGuatemalteco(date = new Date()) {
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        timeZone: 'America/Guatemala'
      };
      return new Date(date).toLocaleDateString('es-GT', options);
    },
  
    formatoISO(date) {
      return new Date(date).toISOString().split('T')[0];
    },
  
    diferenciaDias(fechaInicio, fechaFin) {
      const diff = new Date(fechaFin) - new Date(fechaInicio);
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
  
    esDiaHabil(date = new Date()) {
      const day = new Date(date).getDay();
      return day !== 0; // En Guatemala se trabaja los sábados
    },
  
    sumarDiasHabiles(date, dias) {
      let result = new Date(date);
      let diasAgregados = 0;
      
      while (diasAgregados < dias) {
        result.setDate(result.getDate() + 1);
        if (this.esDiaHabil(result)) diasAgregados++;
      }
  
      return result;
    }
  };