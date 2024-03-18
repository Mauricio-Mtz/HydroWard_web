import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../config/GlobalContext';
import Modal from './../../components/Modal';

export default function Peces() {
    const { API_URL } = useContext(GlobalContext);
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [peces, setPeces] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [pez, setPez] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const fieldTypes = {
        "nombre": "text",
        "alimentacion": "text",
        "tiempo_no_alim": "number",
        "tiempo_si_alim": "number",
        "temperatura_min": "number",
        "temperatura_max": "number",
        "ph_min": "number",
        "ph_max": "number",
        "status": "number"
    };


    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    const obtenerPez = () => {
        axios
            .get(`${API_URL}/Peces/obtener_peces`)
            .then(response => {
                if (response.data.success) {
                    setPeces(response.data.peces);

                    const columnNames = Object.keys(response.data.peces[0]);

                    const columns = [
                        ...columnNames.map(name => ({
                            Header: name.toUpperCase(),
                            accessor: name,
                        })),
                        {
                            Header: 'OPCIONES',
                            Cell: row => (
                                <div className='d-flex justify-content-between'>
                                    <button className='btn btn-success w-100' onClick={() => handleEditar(row.row.original)}>Editar</button>
                                    {row.row.original.status === "0" ? (
                                        <button className='btn btn-info ms-2 w-100' onClick={() => handleEliminar(row.row.original.id, 1)}>Activar</button>
                                    ) : (
                                        <button className='btn btn-danger ms-2 w-100' onClick={() => handleEliminar(row.row.original.id, 0)}>Eliminar</button>
                                    )}
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
                console.error('Error al eliminar usuario:', error);
            });
    };

    useEffect(() => {
        obtenerPez();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditar = (usuario) => {
        setName("Editar Administrador")
        setType("editar")
        const { status, ...rest } = usuario;
        setPez(rest);
        setIsModalOpen(true);
        obtenerPez();
    };

    const handleEliminar = (id, action) => {
        let formData = new FormData();
        formData.append('id', id);
        formData.append('action', action);

        axios({
            method: 'post',
            url: `${API_URL}/Peces/eliminar_pez`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                if (response.data.success) {
                    obtenerPez();
                } else {
                    console.error('Error al modificar status del usuario:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error al modificar status del usuario:', error);
            });
    };

    const handleAgregar = () => {
        setName("Agregar Administrador")
        setType("agregar")
        const usuarioVacio = Object.keys(fieldTypes).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {});
        const { tipo, ...rest } = usuarioVacio;
        setPez(rest);
        setIsModalOpen(true);
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
                                <h1 className="mt-4">Gestión de Peces</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        Peces registrados
                                    </div>
                                    <div className="card-body">
                                        <div className='text-center'>
                                            <button className='btn btn-info w-100' onClick={handleAgregar}>Agregar</button>
                                        </div>
                                        <Tabla data={peces} columns={columnas} />
                                    </div>
                                </div>
                            </div>
                            <Modal
                                object={pez}
                                isOpen={isModalOpen}
                                closeModal={() => setIsModalOpen(false)}
                                fieldTypes={fieldTypes}
                                name={name}
                                type={type}
                                recarga={obtenerPez}
                                categoria={"peces"}
                            />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
