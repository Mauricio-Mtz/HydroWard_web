import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import GlobalContext from '../config/GlobalContext';

export default function Login() {
    const { API_URL } = useContext(GlobalContext);
    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const login = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('email', correo);
        formData.append('password', contrasena);

        axios
            .post(`${API_URL}/back/login`, formData)
            .then(response => {
                if (response.data.success) {
                    localStorage.setItem('userData', JSON.stringify(response.data.usuario));
                    navigate("/")
                } else {
                    console.error(response.data.message);
                    alert(response.data.message)
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
            });
    };


    return (
        <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
            <div className='bg-primary rounded p-3' style={{ maxWidth: "350px", width: "100%", maxHeight: "500px", height: "100%" }}>
                <div className="intro-text text-center custom-container p-2" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                    <h3>Iniciar sesión</h3>
                    <form onSubmit={login} className='d-grid align-items-end' style={{ height: "100%" }} >
                        <div>
                            <div className="inputBox">
                                <input onChange={(event) => { setCorreo(event.target.value); }} type="" className="form-control" id="email" value={correo} name='email' required />
                                <span>Correo</span>
                            </div>
                            <div className="inputBox input-group mb-3">
                                <input onChange={(event) => { setContrasena(event.target.value); }} type={mostrarContrasena ? "text" : "password"} className="form-control" id="password" value={contrasena} name='pass' required />
                                <span>Contraseña</span>
                                <button
                                    className="btn btn-light"
                                    type="button"
                                    onClick={toggleMostrarContrasena}
                                >
                                    {mostrarContrasena ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            <a href='/Register' className="text-info text-center mt-1">¿No tienes cuenta? Crea una</a>
                        </div>
                        <div className='d-grid'>
                            <button className="btn btn-success">Inicio de Sesión</button>
                        </div>
                    </form>
                    <a href='/' className="text-info text-center mt-1">Regresar a la tienda</a>
                </div>
            </div>
        </div>
    );
}
