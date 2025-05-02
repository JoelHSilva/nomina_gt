// services/index.js
const PrestamosService = require('./prestamos.service');
module.exports = {
  prestamosService: new PrestamosService() // Instancia única
};