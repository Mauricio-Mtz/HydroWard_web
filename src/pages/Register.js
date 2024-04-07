import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GlobalContext from '../config/GlobalContext';

export default function Register() {
    const { API_URL } = useContext(GlobalContext);
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };
    
    useEffect(() => {
        if (sesion) {
            navigate("/")   
        }
    }, [])

    const register = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('name', nombre);
        data.append('lastName', apellido);
        data.append('number', telefono);
        data.append('email', correo);
        data.append('password', contrasena);

        axios({
            method: 'post',
            url: `${API_URL}/Login/signIn`,
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                if (response.data.success) {
                    alert(response.data.message)
                    navigate("/Login");
                } else {
                    console.error('Error al agregar al usuario:', response.data.message);
                    alert("Alguno de los datos enviados es incorrecto");
                }
            })
            .catch(error => {
                console.error('Informacion no enviada:', error);
                alert("Error del servidor");
            });
    }

    return (
        <>
            <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
                <div className='bg-primary rounded p-3' style={{ maxWidth: "350px", width: "100%", maxHeight: "500px", height: "100%" }}>
                    <div className="intro-text text-center custom-container p-2" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <h3>Registro</h3>
                        <form onSubmit={(event) => register(event)} className='d-grid align-items-end ' style={{ height: "100%" }} >
                            <div className='d-grid'>
                                <div className="inputBox mb-2">
                                    <input onChange={(event) => { setNombre(event.target.value); }} type="text" className="form-control" id="nombre" value={nombre} name='nombre' required />
                                    <span>Usuario</span>
                                </div>
                                <div className="inputBox mb-2">
                                    <input onChange={(event) => { setApellido(event.target.value); }} type="text" className="form-control" id="apellido" value={apellido} name='apellido' required />
                                    <span>Apellido(s)</span>
                                </div>
                                <div className="inputBox mb-2">
                                    <input onChange={(event) => { setTelefono(event.target.value); }} type="number" className="form-control" id="telefono" value={telefono} name='telefono' required />
                                    <span>Teléfono</span>
                                </div>
                                <div className="inputBox mb-2">
                                    <input onChange={(event) => { setCorreo(event.target.value); }} type="email" className="form-control" id="correo" value={correo} name='correo' required />
                                    <span>Correo</span>
                                </div>
                                <div className="inputBox input-group">
                                    <input onChange={(event) => { setContrasena(event.target.value); }} type={mostrarContrasena ? "text" : "password"} className="form-control" id="password" value={contrasena} name='pass' required />
                                    <span>Contraseña</span>
                                    <button className="btn btn-light" type="button" onClick={toggleMostrarContrasena}>{mostrarContrasena ? <FaEye /> : <FaEyeSlash />}</button>
                                </div>
                            </div>
                            <div className='d-grid'>
                                <button className="btn btn-success">Registrarse</button>
                            </div>
                        </form>
                        <a href='/' className="text-info text-center mt-1">Regresar a la tienda</a>
                    </div>
                </div>
            </div>
        </>
    )
}
