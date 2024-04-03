import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from 'axios';
import GlobalContext from '../config/GlobalContext';
import Modal from '../components/Modal';

export default function Profile() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const [perfil, setPerfil] = useState({});
    const [direccion, setDireccion] = useState({});
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [obj, setObj] = useState({})
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const fieldTypes = {
        "nombre": "text",
        "apellido": "text",
        "telefono": "number",
        "correo": "email",
        "contrasena": "text",
        "cp": "number",
    }

    useEffect(() => {
        obtenerDatos();
    }, []);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const obtenerDatos = () => {
        axios
            .get(`${API_URL}/Usuarios/obtener_usuario/${sesion.id}`)
            .then(response => {
                if (response.data.success) {
                    setPerfil({
                        id: response.data.usuario.id,
                        nombre: response.data.usuario.nombre,
                        apellido: response.data.usuario.apellido,
                        telefono: response.data.usuario.telefono,
                        correo: response.data.usuario.correo,
                        contrasena: response.data.usuario.contrasena,
                        imagen: response.data.usuario.imagen,
                    });
                    setDireccion({
                        id: response.data.usuario.id,
                        direccion: response.data.usuario.direccion,
                        ciudad: response.data.usuario.ciudad,
                        estado: response.data.usuario.estado,
                        cp: response.data.usuario.cp,
                    });
                } else {
                    console.error(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error al obtener datos de perfil:', error);
            });
    };

    const handleEditarPerfil = () => {
        setModalOpen(true);
        setObj(perfil);
        setName(`Editar perfil de ${perfil.nombre}`)
        setType("editPerf")
    };

    const handleEditarDireccion = () => {
        setModalOpen(true);
        setObj(direccion);
        setName(`Editar dirección de ${perfil.nombre}`)
        setType("editDir")
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    return (
        <>
            <Navbar />
            <section className="container-fluid d-flex align-items-center justify-content-center vh-100">
                <div className="row bg-primary bg-opacity-50 rounded p-4">
                    <h2 className="text-center">PERFIL</h2>
                    <div className="col-md-2 d-flex align-items-center justify-content-center mb-2">
                        {perfil.imagen === null ? (
                            <FaUser className='circle-icon p-4' style={{ fontSize: "100px", color: "" }} />
                        ) : (
                            <img className='circle-icon' src={`${API_URL}/static/usuarios/${perfil.imagen}`} alt={perfil.imagen} style={{ height: "100px", color: "" }} />
                        )}
                    </div>
                    <div className="col-md-5 d-flex flex-column mb-2">
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Nombre:</strong>
                            <p>{perfil.nombre} {perfil.apellido}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Teléfono:</strong>
                            <p>{perfil.telefono}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Correo:</strong>
                            <p>{perfil.correo}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Contraseña:</strong>
                            <div className='d-flex'>
                                <p>{mostrarContrasena ? perfil.contrasena : '********'}</p>
                                <button className="btn btn-link" onClick={toggleMostrarContrasena}>
                                    {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={handleEditarPerfil}>Editar perfil</button>
                    </div>
                    <div className="col-md-5 d-flex flex-column mb-0">
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Direccion:</strong>
                            <p>{direccion.direccion}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Ciudad:</strong>
                            <p>{direccion.ciudad}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Estado:</strong>
                            <p>{direccion.estado}</p>
                        </div>
                        <div className="mb-3 d-flex justify-content-between">
                            <strong>Codigo Postal:</strong>
                            <p>{direccion.cp}</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleEditarDireccion}>Editar direccion</button>
                    </div>
                </div>
            </section>
            <Modal
                object={obj}
                isOpen={modalOpen}
                closeModal={closeModal}
                fieldTypes={fieldTypes}
                name={name}
                type={type}
                recarga={obtenerDatos}
                categoria="perfil"
            />
        </>
    );
}
