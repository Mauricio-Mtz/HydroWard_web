import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingCart, FaCog, FaBook } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
    const sesion = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1000);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const cerrarSesion = () => {
        localStorage.clear();
        alert("Hasta luego " + sesion.nombre);
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-primary rounded-bottom fixed-top" style={{ zIndex: 1039 }}>
            <div className="container-fluid d-flex justify-content-between">
                <div className="d-flex justify-content-start flex-grow-1">
                    <button className="navbar-brand btn btn-link" onClick={() => navigate("/")}>HydroWard</button>
                    <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                {(isOpen || isLargeScreen) && (
                    <>
                        <div className="d-flex justify-content-center flex-grow-1">
                            <form className="d-flex w-100">
                                <div className="input-group" style={{ width: "100%" }} >
                                    <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-light" type="submit">
                                        <FaSearch />
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="d-flex justify-content-end flex-grow-1">
                            <ul className="navbar-nav mb-lg-0">
                                <li className="nav-item px-lg-2 d-flex align-items-center">
                                    {sesion && (
                                        sesion && sesion.tipo === "administrador" ? (
                                            <Link className="nav-link" to={"/Admin"}>
                                                <FaCog />
                                            </Link>
                                        ) : (
                                            <Link className="nav-link" to={"/Cart"}>
                                                <FaShoppingCart />
                                            </Link>
                                        )
                                    )}
                                </li>
                                <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <FaUser />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end bg-secondary" aria-labelledby="navbarDropdown">
                                        <li>
                                            {sesion && (
                                                <Link className='dropdown-item' to={"/Profile"}>PERFIL</Link>
                                            )}
                                            {sesion && sesion.tipo === "cliente" && (
                                                <Link className='dropdown-item' to={"/History"}>HISTORIAL</Link>
                                            )}
                                        </li>
                                        <li>
                                            {sesion === null && (
                                                <Link className='dropdown-item text-info' to={"/login"}>INICIAR SESION</Link>
                                            )}
                                            {sesion && (
                                                <Link to={"/"} className='dropdown-item text-danger' onClick={cerrarSesion}>CERRAR SESION</Link>
                                            )}
                                        </li>
                                        {sesion === null && (
                                            <li>
                                                <Link className='dropdown-item text-warning' to={"/Register"}>REGISTRARSE</Link>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
