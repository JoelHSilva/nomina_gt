// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\frontend\src\context\ViaticosContext.js

import React, { createContext, useReducer, useContext, useEffect, useCallback, useMemo } from 'react'; // Importa useCallback y useMemo
import viaticosService from '../services/viaticosService';

// Estado inicial
const initialState = {
    solicitudes: [], // Siempre inicializado como array vacío
    anticipos: [],
    liquidaciones: [],
    tiposViatico: [], // Siempre inicializado como array vacío
    selectedSolicitud: null,
    loading: false,
    error: null
};

// Tipos de acciones
const actionTypes = {
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
    SET_SOLICITUDES: 'SET_SOLICITUDES',
    SET_SOLICITUD: 'SET_SOLICITUD',
    ADD_SOLICITUD: 'ADD_SOLICITUD',
    UPDATE_SOLICITUD: 'UPDATE_SOLICITUD',
    SET_ANTICIPOS: 'SET_ANTICIPOS',
    ADD_ANTICIPO: 'ADD_ANTICIPO',
    SET_LIQUIDACIONES: 'SET_LIQUIDACIONES',
    ADD_LIQUIDACION: 'ADD_LIQUIDACION',
    SET_TIPOS_VIATICO: 'SET_TIPOS_VIATICO',
    RESET: 'RESET'
};

// Reducer
const viaticosReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.FETCH_START:
            return { ...state, loading: true, error: null };

        case actionTypes.FETCH_SUCCESS:
            return { ...state, loading: false };

        case actionTypes.FETCH_ERROR:
            // Asegúrate de que el payload sea un string de error o una representación
            return { ...state, loading: false, error: action.payload };

        case actionTypes.SET_SOLICITUDES:
            // action.payload es { success: true, data: [...] }
            // Necesitas acceder a action.payload.data
            return { 
                ...state, 
                solicitudes: Array.isArray(action.payload?.data) ? action.payload.data : [] 
            };

        case actionTypes.SET_SOLICITUD:
            // Asumiendo que getSolicitudById también devuelve { success: true, data: { ... } }
            // Entonces, action.payload.data es el objeto de la solicitud
            const selectedSol = action.payload?.data || null;
            return { 
                ...state, 
                selectedSolicitud: selectedSol,
                solicitudes: state.solicitudes.map(sol => 
                  sol.id_solicitud === selectedSol?.id_solicitud ? selectedSol : sol
                )
            };

        case actionTypes.ADD_SOLICITUD:
            // Asumiendo que createSolicitud también devuelve { success: true, data: { ... } }
            return { 
                ...state, 
                solicitudes: [action.payload?.data, ...state.solicitudes] 
            };

        case actionTypes.UPDATE_SOLICITUD:
            // Asumiendo que updateSolicitud también devuelve { success: true, data: { ... } }
            const updatedSol = action.payload?.data;
            return {
                ...state,
                solicitudes: state.solicitudes.map(sol =>
                    sol.id_solicitud === updatedSol?.id_solicitud ? updatedSol : sol
                ),
                selectedSolicitud: 
                    state.selectedSolicitud?.id_solicitud === updatedSol?.id_solicitud 
                    ? updatedSol 
                    : state.selectedSolicitud
            };

        case actionTypes.SET_ANTICIPOS:
            // Asumiendo que getAnticipos también devuelve { success: true, data: [...] }
            return { 
                ...state, 
                anticipos: Array.isArray(action.payload?.data) ? action.payload.data : [] 
            };

        case actionTypes.ADD_ANTICIPO:
            // Asumiendo que createAnticipo también devuelve { success: true, data: { ... } }
            return { 
                ...state, 
                anticipos: [action.payload?.data, ...state.anticipos] 
            };

        case actionTypes.SET_LIQUIDACIONES:
            // Asumiendo que getLiquidaciones también devuelve { success: true, data: [...] }
            return { 
                ...state, 
                liquidaciones: Array.isArray(action.payload?.data) ? action.payload.data : [] 
            };

        case actionTypes.ADD_LIQUIDACION:
            // Asumiendo que createLiquidacion también devuelve { success: true, data: { ... } }
            return { 
                ...state, 
                liquidaciones: [action.payload?.data, ...state.liquidaciones] 
            };

        case actionTypes.SET_TIPOS_VIATICO:
            // action.payload es { success: true, data: [...] }
            // Necesitas acceder a action.payload.data
            return { 
                ...state, 
                tiposViatico: Array.isArray(action.payload?.data) ? action.payload.data : [] 
            };

        case actionTypes.RESET:
            return initialState;

        default:
            return state;
    }
};

// Creación del contexto
const ViaticosContext = createContext();

// Proveedor del contexto
export const ViaticosProvider = ({ children }) => {
    const [state, dispatch] = useReducer(viaticosReducer, initialState);

    // Cargar tipos de viático al iniciar
    useEffect(() => {
        const fetchTiposViatico = async () => {
            try {
                dispatch({ type: actionTypes.FETCH_START });
                // viaticosService.getTiposViatico() devuelve { success: true, data: [...] }
                const response = await viaticosService.getTiposViatico(); 
                // Envía el objeto de respuesta completo como payload
                dispatch({ type: actionTypes.SET_TIPOS_VIATICO, payload: response }); 
                dispatch({ type: actionTypes.FETCH_SUCCESS });
            } catch (error) {
                // El servicio ya lanza un error con .message
                dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message }); 
            }
        };

        fetchTiposViatico();
    }, []); // Array de dependencias vacío, se ejecuta solo una vez al montar

    // --- Acciones memorizadas con useCallback ---
    // Usamos useCallback para que estas funciones sean estables entre renders.
    // Solo se recrearán si 'dispatch' cambia, lo cual no ocurre en React.
    const fetchSolicitudes = useCallback(async (params = {}) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.getSolicitudes(params);
            dispatch({ type: actionTypes.SET_SOLICITUDES, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error; 
        }
    }, [dispatch]);

    const fetchSolicitudById = useCallback(async (id) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.getSolicitudById(id);
            dispatch({ type: actionTypes.SET_SOLICITUD, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
            return response.data; 
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const createSolicitud = useCallback(async (solicitudData) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.createSolicitud(solicitudData);
            dispatch({ type: actionTypes.ADD_SOLICITUD, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
            return response.data;
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const updateSolicitud = useCallback(async (id, solicitudData) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.updateSolicitud(id, solicitudData);
            dispatch({ type: actionTypes.UPDATE_SOLICITUD, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
            return response.data;
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const fetchAnticipos = useCallback(async (solicitudId) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.getAnticipos(solicitudId);
            dispatch({ type: actionTypes.SET_ANTICIPOS, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const createAnticipo = useCallback(async (anticipoData) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.createAnticipo(anticipoData);
            dispatch({ type: actionTypes.ADD_ANTICIPO, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
            return response.data;
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const fetchLiquidaciones = useCallback(async (params = {}) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.getLiquidaciones(params);
            dispatch({ type: actionTypes.SET_LIQUIDACIONES, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const createLiquidacion = useCallback(async (liquidacionData) => {
        try {
            dispatch({ type: actionTypes.FETCH_START });
            const response = await viaticosService.createLiquidacion(liquidacionData);
            dispatch({ type: actionTypes.ADD_LIQUIDACION, payload: response }); 
            dispatch({ type: actionTypes.FETCH_SUCCESS });
            return response.data;
        } catch (error) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
            throw error;
        }
    }, [dispatch]);

    const reset = useCallback(() => {
        dispatch({ type: actionTypes.RESET });
    }, [dispatch]);

    // --- Memorizar el objeto 'actions' completo con useMemo ---
    // Esto asegura que el objeto 'actions' solo cambie si alguna de sus funciones internas cambia.
    // Como las funciones internas ya están memorizadas con useCallback (dependiendo solo de dispatch, que es estable),
    // el objeto 'actions' también será estable.
    const actions = useMemo(() => ({
        fetchSolicitudes,
        fetchSolicitudById,
        createSolicitud,
        updateSolicitud,
        fetchAnticipos,
        createAnticipo,
        fetchLiquidaciones,
        createLiquidacion,
        reset,
        // No incluyas fetchTiposViatico aquí si ya lo llamas en un useEffect dentro del proveedor.
        // Si lo necesitas en un componente, tendrías que memorizarlo también y añadirlo.
    }), [
        fetchSolicitudes, 
        fetchSolicitudById, 
        createSolicitud, 
        updateSolicitud, 
        fetchAnticipos, 
        createAnticipo, 
        fetchLiquidaciones, 
        createLiquidacion, 
        reset
    ]);

    return (
        <ViaticosContext.Provider value={{ state, actions }}>
            {children}
        </ViaticosContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useViaticosContext = () => {
    const context = useContext(ViaticosContext);
    if (!context) {
        throw new Error('useViaticosContext debe usarse dentro de un ViaticosProvider');
    }
    return context;
};

export { ViaticosContext };