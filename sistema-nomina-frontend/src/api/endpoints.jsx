// src/api/endpoints.jsx

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const ENDPOINTS = {
    // ... (La definición del objeto ENDPOINTS es la misma que antes) ...
    // Gestión General
    DEPARTAMENTOS: `${API_BASE_URL}/departamentos`,
    PUESTOS: `${API_BASE_URL}/puestos`,
    EMPLEADOS: `${API_BASE_URL}/empleados`,
    USUARIOS: `${API_BASE_URL}/usuarios`,
    LOGS_SISTEMA: `${API_BASE_URL}/logs-sistema`,

    // Configuración
    CONFIGURACION_FISCAL: `${API_BASE_URL}/configuracion-fiscal`,
    CONCEPTOS_PAGO: `${API_BASE_URL}/conceptos-pago`,

    // Nómina
    PERIODOS_PAGO: `${API_BASE_URL}/periodos-pago`,
    NOMINAS: `${API_BASE_URL}/nominas`,
    DETALLE_NOMINA: `${API_BASE_URL}/detalle-nomina`,
    CONCEPTOS_APLICADOS: `${API_BASE_URL}/conceptos-aplicados`,

    // Gestión de Empleados (adicionales)
    EMPLEADO_TOGGLE_STATUS: (id) => `${API_BASE_URL}/empleados/${id}/toggle-status`,
    HISTORIAL_SALARIOS: `${API_BASE_URL}/historial-salarios`,

    // Préstamos
    PRESTAMOS: `${API_BASE_URL}/prestamos`,
    PAGOS_PRESTAMOS: `${API_BASE_URL}/pagos-prestamos`,
    PRESTAMO_PROCESS_PAYMENT: (id) => `${API_BASE_URL}/prestamos/${id}/payments`,

    // Vacaciones y Ausencias
    VACACIONES: `${API_BASE_URL}/vacaciones`,
    AUSENCIAS: `${API_BASE_URL}/ausencias`,
    HORAS_EXTRAS: `${API_BASE_URL}/horas-extras`,

    // Viáticos
    TIPOS_VIATICOS: `${API_BASE_URL}/tipos-viaticos`,
    DESTINOS_VIATICOS: `${API_BASE_URL}/destinos-viaticos`,
    TARIFAS_DESTINO: `${API_BASE_URL}/tarifas-destino`,
    POLITICAS_VIATICOS_PUESTO: `${API_BASE_URL}/politicas-viaticos-puesto`,

    SOLICITUDES_VIATICOS: `${API_BASE_URL}/solicitudes-viaticos`,
    DETALLE_SOLICITUD_VIATICOS: `${API_BASE_URL}/detalle-solicitud-viaticos`,
    ANTICIPOS_VIATICOS: `${API_BASE_URL}/anticipos-viaticos`,
    LIQUIDACION_VIATICOS: `${API_BASE_URL}/liquidacion-viaticos`,
    DETALLE_LIQUIDACION_VIATICOS: `${API_BASE_URL}/detalle-liquidacion-viaticos`,

    // Acciones específicas de Nómina/Viáticos
    NOMINA_VERIFICAR: (id) => `${API_BASE_URL}/nominas/${id}/verificar`,
    NOMINA_APROBAR: (id) => `${API_BASE_URL}/nominas/${id}/aprobar`,
    NOMINA_PAGAR: (id) => `${API_BASE_URL}/nominas/${id}/pagar`,
    SOLICITUD_VIATICO_APROBAR: (id) => `${API_BASE_URL}/solicitudes-viaticos/${id}/aprobar`,
    SOLICITUD_VIATICO_REGISTRAR_ANTICIPO: (id) => `${API_BASE_URL}/solicitudes-viaticos/${id}/anticipos`,
    SOLICITUD_VIATICO_LIQUIDAR: (id) => `${API_BASE_URL}/solicitudes-viaticos/${id}/liquidar`,
};

// Funciones auxiliares para obtener URLs. Reciben la *clave string* del endpoint/acción.
export const getEntityUrl = (endpointKeyString, id = null) => {
    const url = ENDPOINTS[endpointKeyString]; // Buscar por la clave string
    if (!url || typeof url !== 'string') { // Verificar que la clave exista y sea una URL (string)
        console.error(`Error de configuración: Endpoint "${endpointKeyString}" no definido o no es una URL válida en ENDPOINTS.`);
        throw new Error(`Error de configuración: Endpoint "${endpointKeyString}" no definido.`);
    }
    return id ? `${url}/${id}` : url;
};

export const getActionUrl = (actionKeyString, id) => {
     const actionFn = ENDPOINTS[actionKeyString]; // Buscar por la clave string
     // Verificar que la clave exista y sea una función
     if (typeof actionFn !== 'function') {
         console.error(`Error de configuración: Acción "${actionKeyString}" no definida o no es una función en ENDPOINTS.`);
         throw new Error(`Error de configuración: Acción "${actionKeyString}" no definida o no es una función.`);
     }
     return actionFn(id); // Llamar a la función con el ID
};