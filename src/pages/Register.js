import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
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

    const register = () => {
        navigate("Login");
    }

    return (
        <>
            <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
                <div className='bg-primary rounded p-3' style={{ maxWidth: "350px", width: "100%", maxHeight: "500px", height: "100%" }}>
                    <div className="intro-text text-center custom-container p-2" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                        <h3>Registro</h3>
                        <form onSubmit={register} className='d-grid align-items-end ' style={{ height: "100%" }} >
                            <div className='d-grid'>
                                <div className="inputBox">
                                    <input onChange={(event) => { setNombre(event.target.value); }} type="text" className="form-control" id="nombre" value={nombre} name='nombre' required />
                                    <span>Usuario</span>
                                </div>
                                <div className="inputBox">
                                    <input onChange={(event) => { setApellido(event.target.value); }} type="text" className="form-control" id="apellido" value={apellido} name='apellido' required />
                                    <span>Apellido(s)</span>
                                </div>
                                <div className="inputBox">
                                    <input onChange={(event) => { setTelefono(event.target.value); }} type="number" className="form-control" id="telefono" value={telefono} name='telefono' required />
                                    <span>Teléfono</span>
                                </div>
                                <div className="inputBox">
                                    <input onChange={(event) => { setCorreo(event.target.value); }} type="email" className="form-control" id="correo" value={correo} name='correo' required />
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
