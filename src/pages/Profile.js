import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import axios from 'axios';
import GlobalContext from '../config/GlobalContext';
import Modal from '../components/Modal';

export default function Profile() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const id = sesion.id;
    const tipo = sesion.tipo;
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

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
                    const { correo, contrasena, nombre, apellido, telefono } = response.data.usuario;
                    setCorreo(correo);
                    setContrasena(contrasena);
                    setNombre(nombre);
                    setApellido(apellido);
                    setTelefono(telefono);
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
                            <FaUser className='circle-icon p-4' style={{ fontSize: "100px", color: "" }} />
                        </div>
                        <div className="col-md-5 d-flex flex-column mb-2">
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Nombre:</strong>
                                <p>{nombre} {apellido}</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Teléfono:</strong>
                                <p>{telefono}</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Correo:</strong>
                                <p>{correo}</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Contraseña:</strong>
                                <div className='d-flex'>
                                    <p>{mostrarContrasena ? contrasena : '********'}</p>
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
                                <p>{nombre} {apellido}</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Ciudad:</strong>
                                <p>{telefono}</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Estado:</strong>
                                <p>{correo}</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <strong>Codigo Postal:</strong>
                                <div className='d-flex'>
                                    <p>{mostrarContrasena ? contrasena : '********'}</p>
                                    <button className="btn btn-link" onClick={toggleMostrarContrasena}>
                                        {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={handleEditarPerfil}>Editar direccion</button>
                        </div>
                    </div>
                </section>
            <Modal
                isOpen={modalOpen}
                closeModal={closeModal}
                object={{ id, nombre, apellido, telefono, correo, contrasena, tipo }}
                fieldTypes={{ correo: 'email', contrasena: 'password', nombre: 'text', apellido: 'text', telefono: 'number' }}
                name="Editar Perfil"
                type="editPerf"
                recarga={obtenerDatos}
                categoria="usuarios"
            />
        </>
    );
}
