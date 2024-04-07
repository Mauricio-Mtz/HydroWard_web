import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SlideBar from '../components/Slidebar';
import Navbar from '../components/Navbar';
import Tabla from './../components/Tabla';
import GlobalContext from '../config/GlobalContext';

export default function Admin() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [columnas, setColumnas] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    useEffect(() => {
        handleUsuarios();
        if (sesion) {
            if (sesion.tipo === "cliente") {
                navigate("/")
            }
        } else{
            navigate('/')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUsuarios = () => {
        axios
            .get(`${API_URL}/Usuarios/obtener_usuarios`)
            .then(response => {
                if (response.data.success) {
                    setUsuarios(response.data.usuarios);
                    const columnNames = Object.keys(response.data.usuarios[0]);
                    const columns = columnNames.map(name => ({
                        Header: name,
                        accessor: name,
                    }));
                    setColumnas(columns);
                } else {
                    console.error('Error al obtener usuarios:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error del servidor:', error);
            });
    }

    return (
        <>
            <Navbar />
            <div className={`sb-nav-fixed ${isSidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        <SlideBar onToggleSidebar={toggleSidebar} isSidebarToggled={isSidebarToggled} />
                    </div>
                    <div id="layoutSidenav_content">
                        <main>
                            <div className="container-fluid px-4">
                                <h1 className="mt-4">Administracion general</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        Usuarios activos
                                    </div>
                                    <div className="card-body">
                                        <Tabla data={usuarios} columns={columnas} />
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
