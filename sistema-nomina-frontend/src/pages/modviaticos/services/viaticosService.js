import axios from 'axios';
//import { API_BASE_URL } from '../config';
import config from '/src/pages/modviaticos/config.js';
const API_BASE_URL = config.API_BASE_URL;
// Configuración básica de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para manejar errores globalmente
 * Nota: En un caso real, aquí podrías manejar redirección a login si hay error 401
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error.config.url, error.response?.data);
    return Promise.reject(error);
  }
);

const viaticosService = {
  /**
   * Obtiene listado de solicitudes de viáticos
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise<Array>} Lista de solicitudes
   */
  async getSolicitudes(params = {}) {
    try {
      const response = await api.get('/viaticos/solicitudes', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener solicitudes');
    }
  },

  /**
   * Obtiene una solicitud específica por ID
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object>} Datos de la solicitud
   */
  async getSolicitudById(id) {
    try {
      const response = await api.get(`/viaticos/solicitudes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener solicitud ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener solicitud');
    }
  },

  /**
   * Crea una nueva solicitud de viáticos
   * @param {Object} solicitudData - Datos de la solicitud
   * @returns {Promise<Object>} Solicitud creada
   */
  async createSolicitud(solicitudData) {
    try {
      const response = await api.post('/viaticos/solicitudes', solicitudData);
      return response.data;
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      throw new Error(error.response?.data?.message || 'Error al crear solicitud');
    }
  },

  /**
   * Actualiza una solicitud existente
   * @param {number} id - ID de la solicitud
   * @param {Object} solicitudData - Datos a actualizar
   * @returns {Promise<Object>} Solicitud actualizada
   */
  async updateSolicitud(id, solicitudData) {
    try {
      const response = await api.put(`/viaticos/solicitudes/${id}/aprobar`, solicitudData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar solicitud ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar solicitud');
    }
  },

  /**
   * Obtiene los anticipos de una solicitud
   * @param {number} solicitudId - ID de la solicitud
   * @returns {Promise<Array>} Lista de anticipos
   */
  async getAnticipos(solicitudId) {
    try {
      const response = await api.get('/viaticos/anticipos', { params: { solicitudId } });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener anticipos para solicitud ${solicitudId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener anticipos');
    }
  },

  /**
   * Registra un nuevo anticipo de viáticos
   * @param {Object} anticipoData - Datos del anticipo
   * @returns {Promise<Object>} Anticipo creado
   */
  async createAnticipo(anticipoData) {
    try {
      const response = await api.post('/viaticos/anticipos', anticipoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear anticipo:', error);
      throw new Error(error.response?.data?.message || 'Error al crear anticipo');
    }
  },

  /**
   * Obtiene las liquidaciones de viáticos
   * @param {Object} params - Parámetros de filtrado (opcional)
   * @returns {Promise<Array>} Lista de liquidaciones
   */
  async getLiquidaciones(params = {}) {
    try {
      const response = await api.get('/viaticos/liquidaciones', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener liquidaciones:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener liquidaciones');
    }
  },

  /**
   * Registra una nueva liquidación de viáticos
   * @param {Object} liquidacionData - Datos de la liquidación
   * @returns {Promise<Object>} Liquidación creada
   */
  async createLiquidacion(liquidacionData) {
    try {
      const response = await api.post('/viaticos/liquidaciones', liquidacionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear liquidación:', error);
      throw new Error(error.response?.data?.message || 'Error al crear liquidación');
    }
  },

  /**
   * Obtiene los tipos de viáticos disponibles
   * @returns {Promise<Array>} Lista de tipos de viáticos
   */
  async getTiposViatico() {
    try {
      const response = await api.get('/viaticos/tipos-viaticos'); // Asume que existe este endpoint
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de viáticos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener tipos de viáticos');
    }
  },

  /**
   * Aprobar/Rechazar una liquidación
   * @param {number} id - ID de la liquidación
   * @param {Object} data - Datos de aprobación
   * @returns {Promise<Object>} Liquidación actualizada
   */
  async aprobarLiquidacion(id, data) {
    try {
      const response = await api.put(`/viaticos/liquidaciones/${id}/aprobar`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar liquidación ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al aprobar liquidación');
    }
  }
};

export default viaticosService;