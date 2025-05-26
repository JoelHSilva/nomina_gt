// src/api/endpoints.jsx

const API_BASE_URL = ''; // Removemos la URL base ya que se maneja en api.jsx

export const ENDPOINTS = {
    // Gestión General
    DEPARTAMENTOS: `/departamentos`,
    PUESTOS: `/puestos`,
    EMPLEADOS: `/empleados`,
    USUARIOS: `/usuarios`,
    LOGS_SISTEMA: `/logs-sistema`,

    // Configuración
    CONFIGURACION_FISCAL: `/configuracion-fiscal`,
    CONCEPTOS_PAGO: `/conceptos-pago`,

    // Nómina
    PERIODOS_PAGO: `/periodos-pago`,
    NOMINAS: `/nominas`,
    DETALLE_NOMINA: `/detalle-nomina`,
    CONCEPTOS_APLICADOS: `/conceptos-aplicados`,
    LIQUIDACIONES: `${API_BASE_URL}/liquidaciones`,
    LIQUIDACIONES_DETALLE: `${API_BASE_URL}/liquidaciones-detalle`,

    // Reportes de Nómina
    REPORTE_PAGOS: `/reportes/pagos`,
    REPORTE_PAGOS_DETALLE: (id) => `/reportes/pagos/${id}/detalle`,

    // Gestión de Empleados (adicionales)
    EMPLEADO_TOGGLE_STATUS: (id) => `/empleados/${id}/toggle-status`,
    HISTORIAL_SALARIOS: `/historial-salarios`,

    // Préstamos
    PRESTAMOS: `/prestamos`,
    PAGOS_PRESTAMOS: `/pagos-prestamos`,
    PRESTAMO_PROCESS_PAYMENT: (id) => `/prestamos/${id}/payments`,

    // Vacaciones y Ausencias
    VACACIONES: `/vacaciones`,
    AUSENCIAS: `/ausencias`,
    HORAS_EXTRAS: `/horas-extras`,

    // Viáticos
    TIPOS_VIATICOS: `/tipos-viaticos`,
    DESTINOS_VIATICOS: `/destinos-viaticos`,
    TARIFAS_DESTINO: `/tarifas-destino`,
    POLITICAS_VIATICOS_PUESTO: `/politicas-viaticos-puesto`,

    SOLICITUDES_VIATICOS: `/solicitudes-viaticos`,
    DETALLE_SOLICITUD_VIATICOS: `/detalle-solicitud-viaticos`,
    ANTICIPOS_VIATICOS: `/anticipos-viaticos`,
    LIQUIDACION_VIATICOS: `/liquidacion-viaticos`,
    DETALLE_LIQUIDACION_VIATICOS: `/detalle-liquidacion-viaticos`,

    // Acciones específicas de Nómina/Viáticos
    NOMINA_VERIFICAR: (id) => `/nominas/${id}/verificar`,
    NOMINA_APROBAR: (id) => `/nominas/${id}/aprobar`,
    NOMINA_PAGAR: (id) => `/nominas/${id}/pagar`,
    SOLICITUD_VIATICO_APROBAR: (id) => `/solicitudes-viaticos/${id}/aprobar`,
    SOLICITUD_VIATICO_REGISTRAR_ANTICIPO: (id) => `/solicitudes-viaticos/${id}/anticipos`,
    SOLICITUD_VIATICO_LIQUIDAR: (id) => `/solicitudes-viaticos/${id}/liquidar`,
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