import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../config/GlobalContext';
import GrafEstanques from './../../components/GrafEstanques';
import MapEstanques from '../../components/MapEstanques';

export default function EstanqueUsuario() {
    const { API_URL } = useContext(GlobalContext);
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [showGrafica, setShowGrafica] = useState(false);
    const [showMapas, setShowMapas] = useState(false);
    const [estanques, setEstanques] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    const obtenerUsuarios = () => {
        axios
            .get(`${API_URL}/Estanques/obtenerUsuariosConEstanques`)
            .then(response => {
                if (response.data.success) {
                    const cliente = response.data.usuarios.map(usuario => ({
                        id: usuario.id,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        correo: usuario.correo,
                        telefono: usuario.telefono,
                        estanques: usuario.estanques
                    }));
                    setUsuarios(cliente);

                    const columns = [
                        {
                            Header: 'ID',
                            accessor: 'id',
                        },
                        {
                            Header: 'NOMBRE',
                            accessor: 'nombre',
                        },
                        {
                            Header: 'APELLIDO',
                            accessor: 'apellido',
                        },
                        {
                            Header: 'CORREO',
                            accessor: 'correo',
                        },
                        {
                            Header: 'TELÉFONO',
                            accessor: 'telefono',
                        },
                        {
                            Header: 'OPCIONES',
                            Cell: row => (
                                <div className='d-flex justify-content-between'>
                                    <button className='btn btn-info w-100' onClick={() => handleGrafica(row.row.original)}>Graficas</button>
                                    <button className='btn btn-warning w-100 ms-1' onClick={() => handleMapa(row.row.original)}>Mapas</button>
                                </div>
                            ),
                        },
                    ];

                    setColumnas(columns);
                } else {
                    console.error('Error al obtener usuarios:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener usuario:', error);
            });
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const handleGrafica = (estanque) => {
        // Obtener los IDs y nombres de los estanques del usuario actual
        const estanques = estanque.estanques.map(estanque => ({
            id: estanque.id,
            nombre: estanque.nombre
        }));
        setEstanques(estanques)
        setShowGrafica(true)
    };
    const handleMapa = (estanque) => {
        // Obtener los IDs y nombres de los estanques del usuario actual
        const estanques = estanque.estanques.map(estanque => ({
            id: estanque.id,
            nombre: estanque.nombre,
            latitud: estanque.latitud,
            longitud: estanque.longitud
        }));
        setEstanques(estanques)
        setShowMapas(true)
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
                                <h1 className="mt-4">Gestión de estanques por cliente</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        Clientes Registrados
                                    </div>
                                    <div className="card-body">
                                        <Tabla data={usuarios} columns={columnas} />

                                        <GrafEstanques
                                            onHideGrafica={() => setShowGrafica(false)}
                                            show={showGrafica}
                                            idEstanques={estanques}
                                        />
                                        <MapEstanques
                                            onHideGrafica={() => setShowMapas(false)}
                                            show={showMapas}
                                            idEstanques={estanques}
                                        />
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
