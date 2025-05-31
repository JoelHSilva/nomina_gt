import { useContext } from 'react';
import { ViaticosContext } from '../context/ViaticosContext';
import { useCallback } from 'react';
import { useState } from 'react';
import viaticosService from '../services/viaticosService';

export const useViaticos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { state, dispatch } = useContext(ViaticosContext);

  const fetchSolicitudes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.getSolicitudes(params);
      dispatch({ type: 'SET_SOLICITUDES', payload: data });
    } catch (err) {
      console.error('Error fetching solicitudes:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchSolicitudById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.getSolicitudById(id);
      dispatch({ type: 'SET_SOLICITUD', payload: data });
      return data;
    } catch (err) {
      console.error('Error fetching solicitud:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchAnticipos = useCallback(async (solicitudId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.getAnticipos(solicitudId);
      dispatch({ type: 'SET_ANTICIPOS', payload: data });
    } catch (err) {
      console.error('Error fetching anticipos:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchLiquidaciones = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.getLiquidaciones(params);
      dispatch({ type: 'SET_LIQUIDACIONES', payload: data });
    } catch (err) {
      console.error('Error fetching liquidaciones:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchTiposViatico = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.getTiposViatico();
      dispatch({ type: 'SET_TIPOS_VIATICO', payload: data });
    } catch (err) {
      console.error('Error fetching tipos viatico:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createSolicitud = useCallback(async (solicitudData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.createSolicitud(solicitudData);
      dispatch({ type: 'ADD_SOLICITUD', payload: data });
      return data;
    } catch (err) {
      console.error('Error creating solicitud:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateSolicitud = useCallback(async (id, solicitudData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.updateSolicitud(id, solicitudData);
      dispatch({ type: 'UPDATE_SOLICITUD', payload: data });
      return data;
    } catch (err) {
      console.error('Error updating solicitud:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createAnticipo = useCallback(async (anticipoData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.createAnticipo(anticipoData);
      dispatch({ type: 'ADD_ANTICIPO', payload: data });
      // Actualizar estado de la solicitud relacionada
      dispatch({ 
        type: 'UPDATE_SOLICITUD', 
        payload: { 
          id_solicitud: data.id_solicitud, 
          estado: 'En proceso' 
        } 
      });
      return data;
    } catch (err) {
      console.error('Error creating anticipo:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createLiquidacion = useCallback(async (liquidacionData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await viaticosService.createLiquidacion(liquidacionData);
      dispatch({ type: 'ADD_LIQUIDACION', payload: data });
      // Actualizar estado de la solicitud relacionada
      dispatch({ 
        type: 'UPDATE_SOLICITUD', 
        payload: { 
          id_solicitud: data.id_solicitud, 
          estado: 'Liquidada' 
        } 
      });
      return data;
    } catch (err) {
      console.error('Error creating liquidacion:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    loading,
    error,
    solicitudes: state.solicitudes,
    anticipos: state.anticipos,
    liquidaciones: state.liquidaciones,
    tiposViatico: state.tiposViatico,
    fetchSolicitudes,
    fetchSolicitudById,
    fetchAnticipos,
    fetchLiquidaciones,
    fetchTiposViatico,
    createSolicitud,
    updateSolicitud,
    createAnticipo,
    createLiquidacion,
  };
};