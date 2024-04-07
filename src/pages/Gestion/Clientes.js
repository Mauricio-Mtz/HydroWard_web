import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import SlideBar from '../../components/Slidebar';
import Navbar from '../../components/Navbar';
import Tabla from './../../components/Tabla';
import GlobalContext from '../../config/GlobalContext';
import Modal from './../../components/Modal';

export default function Clientes() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const fieldTypes = {
        "nombre": "text",
        "apellido": "text",
        "telefono": "number",
        "correo": "email",
        "contrasena": "text",
        "tipo": "text",
    };

    useEffect(() => {
        obtenerUsuarios();
        if (sesion) {
            if (sesion.tipo === "cliente") {
                navigate("/")
            }
        } else{
            navigate('/')
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarToggled(!isSidebarToggled);
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled);
    };

    const obtenerUsuarios = () => {
        axios
            .get(`${API_URL}/Usuarios/obtener_usuarios`)
            .then(response => {
                if (response.data.success) {
                    const administradores = response.data.usuarios.filter(usuario => usuario.tipo === 'cliente');
                    setUsuarios(administradores);

                    const columnNames = Object.keys(administradores[0]);

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

    const handleEditar = (usuario) => {
        setName("Editar Administrador")
        setType("editar")
        const { status, ...rest } = usuario;
        setUsuario(rest);
        setIsModalOpen(true);
        obtenerUsuarios();
    };

    const handleEliminar = (id, action) => {
        let formData = new FormData();
        formData.append('id', id);
        formData.append('action', action);

        axios({
            method: 'post',
            url: `${API_URL}/Usuarios/eliminar_usuario`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                if (response.data.success) {
                    obtenerUsuarios();
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
        setUsuario(rest);
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
                                <h1 className="mt-4">Gestión de Clientes</h1>
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <i className="fas fa-table me-1"></i>
                                        Clientes Registrados
                                    </div>
                                    <div className="card-body">
                                        <div className='text-center'>
                                            <button className='btn btn-info w-100' onClick={handleAgregar}>Agregar</button>
                                        </div>
                                        <Tabla data={usuarios} columns={columnas} />
                                    </div>
                                </div>
                            </div>
                            <Modal
                                object={usuario}
                                isOpen={isModalOpen}
                                closeModal={() => setIsModalOpen(false)}
                                fieldTypes={fieldTypes}
                                name={name}
                                type={type}
                                recarga={obtenerUsuarios}
                                categoria={"cliente"}
                            />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
