// src/api/api.jsx
import axios from 'axios';
// Importa getEntityUrl y getActionUrl - Asegúrate de la extensión .jsx
import { getEntityUrl, getActionUrl } from './endpoints.jsx';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones CRUD Genéricas (Usando Axios y Key String) ---

// Ahora recibe la *clave string* (ej: 'DEPARTAMENTOS') y un objeto de configuración opcional
export const getAll = async (endpointKeyString, config = {}) => { // <--- Añadir config = {}
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString);
    try {
        const response = await api.get(url, config); // <--- Pasar config a axios.get
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


// Exportar todas las funciones
export default {
    getAll,
    getById,
    create,
    update,
    remove,
    toggleEmpleadoStatus,
    processLoanPayment, // <-- Exporta la nueva función
    // ... otras funciones específicas si las añades
};






/* // src/api/api.jsx
import axios from 'axios';
// Importa getEntityUrl y getActionUrl
import { getEntityUrl, getActionUrl } from './endpoints'; // Asegúrate de que la importación sea de .jsx

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones CRUD Genéricas (Usando Axios y Key String) ---

// Ahora recibe la *clave string* (ej: 'DEPARTAMENTOS')
export const getAll = async (endpointKeyString) => {
    // Pasa la clave string a getEntityUrl
    const url = getEntityUrl(endpointKeyString);
    try {
        const response = await api.get(url);
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

// --- Funciones para Acciones Específicas (Ejemplos usando Axios y Key String) ---

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




// Exportar las funciones
export default {
    getAll,
    getById,
    create,
    update,
    remove,
    toggleEmpleadoStatus,
    // ... otras funciones específicas ...
};*/