import React from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function Slidebar({ onToggleSidebar, isSidebarToggled }) {
    return (
        <>
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <Link className="nav-link" to={"/Admin"}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            General
                        </Link>
                        <div className="sb-sidenav-menu-heading">Gestión</div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseUsuarios" aria-expanded="false" aria-controls="collapseUsuarios">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Usuarios
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseUsuarios" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={"/Administradores"}>Administradores</Link>
                                <Link className="nav-link" to={"/Clientes"}>Clientes</Link>
                            </nav>
                        </div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseProductos" aria-expanded="false" aria-controls="collapseProductos">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Productos
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseProductos" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={"/Estanques"}>Estanques</Link>
                                <Link className="nav-link" to={"/Alimentos"}>Alimentos</Link>
                                <Link className="nav-link" to={"/Suplementos"}>Suplementos</Link>
                                <Link className="nav-link" to={"/Peces"}>Peces</Link>
                            </nav>
                        </div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseSeguimiento" aria-expanded="false" aria-controls="collapseSeguimiento">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Seguimiento
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseSeguimiento" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to={"/GrafEstanques"}>Estanques</Link>
                            </nav>
                        </div>
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseReportes" aria-expanded="false" aria-controls="collapseReportes">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Reportes
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseReportes" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/Reportes/productos">Productos</Link>
                                <Link className="nav-link" to="/Reportes/clientes">clientes</Link>
                                <Link className="nav-link" to="/Reportes/ventas">Ventas</Link>
                            </nav>
                        </div>
                        <div className="sb-sidenav-menu-heading">Addons</div>
                        <a className="nav-link" href="charts.html">
                            <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                            Charts
                        </a>
                        <a className="nav-link" href="tables.html">
                            <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                            Tables
                        </a>
                    </div>
                </div>
                <div className="sb-sidenav-footer">
                    <div className="small">Logged in as:</div>
                    Start Bootstrap
                </div>
                <button style={{ position: 'absolute', left: '100%', zIndex: 2 }} className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={onToggleSidebar}>
                    {isSidebarToggled ? <FaArrowLeft /> : <FaArrowRight />}
                </button>
            </nav>
        </>
    );
}