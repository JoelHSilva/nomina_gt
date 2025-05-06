// src/pages/DetalleNominaListPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import Button from '../components/Common/Button.jsx'; // Si usas tu componente Button
import { Link } from 'react-router-dom'; // Importa Link para los enlaces a detalles

function DetalleNominaListPage() {
    const [detallesNomina, setDetallesNomina] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Columnas para la tabla de Detalles de Nómina - Debe incluir enlace a detalles
    const columns = [
        { key: 'id_detalle', title: 'ID Detalle' },
        // Puedes incluir columnas de relaciones aquí si tu getAll las carga (ya lo configuramos)
        { key: 'empleado.nombre', title: 'Nombre Empleado', render: (value, item) => item.empleado?.nombre || 'N/A' },
        { key: 'empleado.apellido', title: 'Apellido Empleado', render: (value, item) => item.empleado?.apellido || 'N/A' },
        { key: 'nomina.descripcion', title: 'Nómina', render: (value, item) => item.nomina?.descripcion || 'N/A' },
        { key: 'liquido_recibir', title: 'Líquido a Recibir' },
        // ... agrega aquí las columnas que necesites mostrar de la lista

        { // Columna de acciones con enlace al detalle
            key: 'actions',
            title: 'Acciones',
            render: (value, item) => {
                return (
                    // Enlace a la página de detalle, pasando el ID
                    <Link to={`/detalles-nomina/${item.id_detalle}`}>
                         {/* Puedes usar un botón o solo texto para el enlace */}
                        <Button className="app-button" style={{ marginRight: '5px' }}>
                            Ver Detalles
                        </Button>
                         {/* O solo texto: <Link to={`/detalles-nomina/${item.id_detalle}`}>Ver</Link> */}
                    </Link>
                );
            },
        },
    ];

    useEffect(() => {
        const fetchDetallesNomina = async () => {
            try {
                setLoading(true);
                setError(null);
                // Llama a la API para obtener la lista de detalles
                // Esto ahora cargará las relaciones Empleado y Nomina por defecto si descomentaste el include en getAll
                const data = await api.getAll('DETALLE_NOMINA');
                setDetallesNomina(data);
            } catch (err) {
                setError('Error al cargar la lista de detalles de nómina.');
                console.error("Error fetching detalles nomina list:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetallesNomina(); // Carga los datos al montar el componente
    }, []); // Se ejecuta solo una vez al montar

    if (loading) {
        return <LoadingSpinner />; // Muestra spinner mientras carga
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Muestra error si falla la carga
    }

    return (
        <div>
            <h2>Lista de Detalles de Nómina</h2>
             {/* Puedes añadir un botón para crear un nuevo detalle de nómina si aplica */}
             {/* <Button>Crear Nuevo Detalle</Button> */}
            <Table data={detallesNomina} columns={columns} />
        </div>
    );
}

export default DetalleNominaListPage;


