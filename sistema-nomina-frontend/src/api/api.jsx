// src/api/api.jsx
import axios from 'axios';
// Importa getEntityUrl y getActionUrl - Asegúrate de la extensión .jsx
// También necesitas importar ENDPOINTS si getActionUrl o getEntityUrl lo usan internamente para validación
import { getEntityUrl, getActionUrl, ENDPOINTS } from './endpoints.jsx'; // Importa ENDPOINTS si es necesario en getActionUrl/getEntityUrl

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones CRUD Genéricas (Usando Axios y Key String) ---

// Ahora recibe la *clave string* (ej: 'DEPARTAMENTOS') y un objeto de configuración opcional
export const getAll = async (endpointKeyString, config = {}) => {
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString);
    try {
        const response = await api.get(url, config);
        // Return the data directly since axios wraps it in response.data
        return response.data;
    } catch (error) {
        console.error(`Error al obtener ${endpointKeyString}:`, error.response?.data || error.message);
        throw error;
    }
};

// Ahora recibe la *clave string*
export const getById = async (endpointKeyString, id) => {
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString, id);
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener ${endpointKeyString} con ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Ahora recibe la *clave string*
export const create = async (endpointKeyString, data) => {
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString);
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        console.error(`Error al crear ${endpointKeyString}:`, error.response?.data || error.message);
        throw error;
    }
};

// Ahora recibe la *clave string*
export const update = async (endpointKeyString, id, data) => {
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString, id);
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar ${endpointKeyString} con ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Ahora recibe la *clave string*
export const remove = async (endpointKeyString, id) => {
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString, id);
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar ${endpointKeyString} con ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// --- Funciones para Acciones Específicas (Usando Axios y Key String) ---

export const toggleEmpleadoStatus = async (empleadoId) => {
    // Pasa la clave string 'EMPLEADO_TOGGLE_STATUS' a getActionUrl
    const url = getActionUrl('EMPLEADO_TOGGLE_STATUS', empleadoId);
    try {
        const response = await api.put(url);
        return response.data;
    } catch (error) {
        console.error(`Error al cambiar estado del empleado ${empleadoId}:`, error.response?.data || error.message);
        throw error;
    }
};

// Función específica para procesar pagos de préstamos - Implementada
export const processLoanPayment = async (loanId, paymentData) => {
    // Pasa la clave string 'PRESTAMO_PROCESS_PAYMENT' a getActionUrl
    const url = getActionUrl('PRESTAMO_PROCESS_PAYMENT', loanId);
    try {
        // Tu backend debe esperar paymentData (monto, fecha, tipo, etc.) en el body para POST
        const response = await api.post(url, paymentData);
        return response.data;
    } catch (error) {
        console.error(`Error al procesar pago del préstamo ${loanId}:`, error.response?.data || error.message);
        throw error;
    }
};

// --- Función genérica para disparar acciones ---
// AHORA acepta un parámetro 'method' para especificar el tipo de petición HTTP (POST, PUT, etc.)
export const triggerAction = async (actionKeyString, id, data = {}, method = 'POST') => { // Añade 'method = 'POST''
    const url = getActionUrl(actionKeyString, id);
    try {
        // Usa la instancia de axios con el método especificado
        // Permite que se envíe data en el body, incluso si es POST o PUT
        const response = await api({ // Usar el objeto de configuración de axios
            method: method.toLowerCase(), // Asegurarse de que el método esté en minúsculas
            url: url,
            data: data, // Envía la data en el body
        });
        return response.data;
    } catch (error) {
        console.error(`Error al disparar acción "${actionKeyString}" usando ${method.toUpperCase()} para ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};
// --------------------------------------------------------------------


// Exportar todas las funciones
export default {
    getAll,
    getById,
    create,
    update,
    remove,
    toggleEmpleadoStatus,
    processLoanPayment,
    triggerAction, // <--- Exporta la nueva función
    // ... otras funciones específicas si las añades
};