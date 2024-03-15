import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../context/GlobalContext';
import { useParams } from 'react-router-dom';

export default function GrafEstanques() {
    const { API_URL } = useContext(GlobalContext);
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [reporteData, setReporteData] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const { accion } = useParams();

    useEffect(() => {
        const obtenerReporte = async () => {
            // try {
            //     const response = await axios.get(`${API_URL}/Reportes/${accion}/2024-01-13/2024-04-12`);
            //     if (response.data.success) {
            //         setReporteData(response.data.reporte);
            //         const columnNames = Object.keys(response.data.reporte[0]);
            //         const columns = [
            //             ...columnNames.map(name => ({
            //                 Header: name.toUpperCase(),
            //                 accessor: name,
            //             }))
            //         ];
            //         setColumnas(columns);
            //     } else {
            //         console.error('Error al obtener el reporte:', response.data.message);
            //     }
            // } catch (error) {
            //     console.error('Error al obtener el reporte:', error);
            // }
        };

        obtenerReporte();
    }, [API_URL, accion]);

    console.log(reporteData)
    console.log(columnas)

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    return (
        <>
            <Navbar />
            <div className={`sb-nav-fixed ${isSidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        <SlideBar onToggleSidebar={toggleSidebar} isSidebarToggled={isSidebarToggled} />
                    </div>
                    <div id="layoutSidenav_content">
                        <main className='p-3'>
                            <div className="container-fluid px-4">
                                <h1>Estanques de los usuarios</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        Muestra informacion visual sobre los estanques del usuario seleccionado
                                    </div>
                                    <div className="card-body">
                                        {/* Aquí se renderiza la tabla con los datos del reporte */}
                                        {/* <Tabla data={reporteData} columns={columnas} /> */}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
