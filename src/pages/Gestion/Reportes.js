import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../config/GlobalContext';
import { useParams } from 'react-router-dom';

export default function Reportes() {
    const { API_URL } = useContext(GlobalContext);
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [reporteData, setReporteData] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(''); // Estado de la fecha de inicio
    const [fechaFin, setFechaFin] = useState(''); // Estado de la fecha de fin
    const { accion } = useParams();

    useEffect(() => {
        const obtenerReporte = async () => {
            try {
                const response = await axios.get(`${API_URL}/Reportes/${accion}/${fechaInicio}/${fechaFin}`);
                if (response.data.success) {
                    setReporteData(response.data.reporte);
                    const columnNames = Object.keys(response.data.reporte[0]);
                    const columns = [
                        ...columnNames.map(name => ({
                            Header: name.toUpperCase(),
                            accessor: name,
                        }))
                    ];
                    setColumnas(columns);
                } else {
                    console.error('Error al obtener el reporte:', response.data.message);
                }
            } catch (error) {
                console.error('Error al obtener el reporte:', error);
            }
        };

        if (fechaInicio !== '' && fechaFin !== '') {
            obtenerReporte();
        }
    }, [API_URL, accion, fechaInicio, fechaFin]);

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
                                <h1 className='mt-4'>{accion === "productos" ? "Reporte de productos" : accion === "clientes" ? "Reporte de clientes" : accion === "ventas" ? "Reporte de ventas" : "Reporte"}</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        {accion === "productos" ? "Productos más vendidos" : accion === "clientes" ? "Clientes que más han comprado" : accion === "ventas" ? "Días con más ventas" : ""}
                                    </div>
                                    <div className="card-body">
                                        <div className='d-flex justify-content-center flex-wrap'>
                                            <div className='p-2'>
                                                <label className="form-label">Fecha de inicio:</label>
                                                <input type="date" className="form-control" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                            </div>
                                            <div className='p-2'>
                                                <label className="form-label">Fecha de fin:</label>
                                                <input type="date" className="form-control" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                            </div>
                                        </div>
                                        <Tabla data={reporteData} columns={columnas} />
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
