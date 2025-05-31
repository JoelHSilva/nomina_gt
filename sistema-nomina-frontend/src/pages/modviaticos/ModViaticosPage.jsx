import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useViaticosContext } from './context/ViaticosContext';
import ViaticosList from './components/ViaticosList';
import ViaticoForm from './components/ViaticoForm';
import AnticipoModal from './components/AnticipoModal';
import LiquidacionForm from './components/LiquidacionForm';
import './ModViaticosPage.css';

const ModViaticosPage = () => {
  const { state, actions } = useViaticosContext();
  const [showForm, setShowForm] = useState(false);
  const [showAnticipoModal, setShowAnticipoModal] = useState(false);
  const [showLiquidacionForm, setShowLiquidacionForm] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'liquidacion'

  // Cargar solicitudes iniciales solo una vez al montar el componente.
  // La dependencia `actions.fetchSolicitudes` debe ser estable debido a `useCallback` en el contexto.
  // Si la función `fetchSolicitudes` no cambiara, un array vacío `[]` también funcionaría,
  // pero incluirla explícitamente es una buena práctica si te aseguras de su estabilidad.
  useEffect(() => {
    // Definimos una función interna para ejecutar la acción asíncrona.
    // Esto es común cuando tu efecto necesita ser asíncrono.
    const loadSolicitudes = async () => {
      try {
        await actions.fetchSolicitudes();
      } catch (error) {
        console.error('Error al cargar solicitudes en ModViaticosPage:', error);
      }
    };
    loadSolicitudes();
  }, [actions.fetchSolicitudes]); // <-- Dependencia clave: solo se ejecuta si la función fetchSolicitudes cambia.
                                  // Ya la hicimos estable con useCallback en el contexto.


  // Manejadores de eventos - Envolvemos con useCallback para estabilidad
  // Esto es importante si estos handlers se pasan como props a componentes hijos,
  // ya que evita re-renders innecesarios de los hijos.
  const handleNewSolicitud = useCallback(() => {
    setSelectedSolicitud(null);
    setShowForm(true);
    setViewMode('form');
  }, []);

  const handleViewSolicitud = useCallback((solicitud) => {
    setSelectedSolicitud(solicitud);
    setViewMode('detail');
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedSolicitud(null);
    setViewMode('list');
    actions.fetchSolicitudes(); // Volver a cargar la lista para asegurar datos actualizados
  }, [actions.fetchSolicitudes]); // Dependencia: actions.fetchSolicitudes

  const handleCreateAnticipo = useCallback((solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowAnticipoModal(true);
  }, []);

  const handleCreateLiquidacion = useCallback((solicitud) => {
    setSelectedSolicitud(solicitud);
    setViewMode('liquidacion');
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    setShowForm(false);
    setViewMode('list');
    actions.fetchSolicitudes(); // Refrescar lista después de crear/actualizar
  }, [actions.fetchSolicitudes]);

  const handleAnticipoSuccess = useCallback(() => {
    setShowAnticipoModal(false);
    actions.fetchSolicitudes(); // Refrescar lista principal
    if (selectedSolicitud) {
      // Si estamos en el detalle de una solicitud y se crea un anticipo para ella,
      // podríamos querer actualizar sus anticipos específicos
      actions.fetchAnticipos(selectedSolicitud.id_solicitud);
    }
  }, [actions.fetchSolicitudes, actions.fetchAnticipos, selectedSolicitud]);

  const handleLiquidacionSuccess = useCallback(() => {
    setViewMode('detail'); // Volver al detalle después de liquidar
    actions.fetchSolicitudes(); // Refrescar lista principal
    if (selectedSolicitud) {
      // Actualizar liquidaciones de la solicitud específica si es necesario
      actions.fetchLiquidaciones({ solicitudId: selectedSolicitud.id_solicitud });
    }
  }, [actions.fetchSolicitudes, actions.fetchLiquidaciones, selectedSolicitud]);

  // Renderizar contenido según el modo de vista
  const renderContent = () => {
    switch (viewMode) {
      case 'form':
        return (
          <ViaticoForm
            solicitud={selectedSolicitud}
            onSuccess={handleSubmitSuccess}
            onCancel={handleBackToList}
          />
        );

      case 'detail':
        // Asegurarse de que selectedSolicitud no sea null antes de renderizar detalles
        if (!selectedSolicitud) {
          return <p>Cargando detalles de la solicitud...</p>; // O redirigir a la lista
        }
        return (
          <div className="solicitud-detail">
            <h2>Detalle de Solicitud #{selectedSolicitud.id_solicitud}</h2>
            <div className="detail-info">
              <p><strong>Empleado:</strong> {selectedSolicitud.Empleado?.nombre} {selectedSolicitud.Empleado?.apellido}</p>
              <p><strong>Destino:</strong> {selectedSolicitud.destino}</p>
              <p><strong>Fechas:</strong> {new Date(selectedSolicitud.fecha_inicio_viaje).toLocaleDateString()} - {new Date(selectedSolicitud.fecha_fin_viaje).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> <span className={`status ${selectedSolicitud.estado?.toLowerCase()}`}>{selectedSolicitud.estado}</span></p>
              <p><strong>Monto Solicitado:</strong> Q{selectedSolicitud.monto_solicitado?.toFixed(2)}</p>
              <p><strong>Monto Aprobado:</strong> Q{selectedSolicitud.monto_aprobado?.toFixed(2)}</p>
            </div>

            <div className="detail-actions">
              {selectedSolicitud.estado === 'Aprobada' && (
                <button 
                  className="btn-anticipo"
                  onClick={() => handleCreateAnticipo(selectedSolicitud)}
                >
                  Registrar Anticipo
                </button>
              )}

              {selectedSolicitud.estado === 'En proceso' && (
                <button 
                  className="btn-liquidacion"
                  onClick={() => handleCreateLiquidacion(selectedSolicitud)}
                >
                  Registrar Liquidación
                </button>
              )}

              <button className="btn-back" onClick={handleBackToList}>
                Volver al listado
              </button>
            </div>
          </div>
        );

      case 'liquidacion':
        // Asegurarse de que selectedSolicitud no sea null antes de renderizar LiquidacionForm
        if (!selectedSolicitud) {
          return <p>Error: No hay solicitud seleccionada para liquidar.</p>; // O redirigir
        }
        return (
          <LiquidacionForm
            solicitud={selectedSolicitud}
            onSuccess={handleLiquidacionSuccess}
            onCancel={() => setViewMode('detail')}
          />
        );

      default: // 'list'
        return (
          <>
            <div className="header-actions">
              <h1>Gestión de Viáticos</h1>
              <button className="btn-new" onClick={handleNewSolicitud}>
                Nueva Solicitud
              </button>
            </div>

            {state.loading ? (
              <p>Cargando solicitudes...</p>
            ) : state.error ? (
              <p className="error-message">Error: {state.error}</p>
            ) : (
              <ViaticosList 
                solicitudes={state.solicitudes} // Pasar solicitudes del estado global
                onViewDetail={handleViewSolicitud}
                onCreateAnticipo={handleCreateAnticipo}
                onCreateLiquidacion={handleCreateLiquidacion}
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="mod-viaticos-page">
      {renderContent()}

      {/* Modal de Anticipo (se muestra sobre cualquier vista) */}
      {showAnticipoModal && selectedSolicitud && (
        <AnticipoModal
          solicitud={selectedSolicitud}
          onClose={() => setShowAnticipoModal(false)}
          onSuccess={handleAnticipoSuccess}
        />
      )}
    </div>
  );
};

export default ModViaticosPage;