import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import GlobalContext from '../config/GlobalContext';

export default function Product() {
  const { API_URL } = useContext(GlobalContext);
  const { id } = useParams();
  const sesion = JSON.parse(localStorage.getItem('userData'));
  const [cantidad, setCantidad] = useState(1);
  const [prod, setProd] = useState(null);
  const [index, setIndex] = useState(0);
  const productoString = encodeURIComponent(JSON.stringify(prod));

  useEffect(() => {
    if (id) fetchProducto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProducto = () => {
    axios
      .get(`${API_URL}/catalogo/producto/${id}`)
      .then(response => {
        if (response.data.success) {
          setProd(response.data.producto);
        } else {
          console.error(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }

  const handleNextImage = () => {
    setIndex(prevIndex => (prevIndex + 1) % prod.imagenes.length);
  };

  const handlePrevImage = () => {
    setIndex(prevIndex => (prevIndex - 1 + prod.imagenes.length) % prod.imagenes.length);
  };

  const handleExcedeCantidad = () => {
    alert("La cantidad excede al stock");
    setCantidad(prod.stock);
  }

  const handleComprar = () => {
    if (cantidad > prod.stock) {
      handleExcedeCantidad();
    } else {
      // Redireccionar a la página de pago solo si la cantidad es válida
      window.location.href = `/Pago/producto/${productoString}/${cantidad}`;
    }
  }

  const handleChangeCantidad = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= prod.stock) {
      setCantidad(value);
    }
  }

  const agregarCarrito = (cantidad, idProd, idUser) => {
    let formData = new FormData();
    formData.append('idProducto', idProd);
    formData.append('idUsuario', idUser);
    formData.append('cantidad', cantidad);
    axios({
      method: 'post',
      url: `${API_URL}/catalogo/agregar`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(response => {
        alert("producto agregado")
      })
      .catch(error => {
        console.error('Error al agregar producto al carrito:', error);
      });
  }

  return (
    <>
      <Navbar />
      <section className="py-5 mt-5">
        <div className="container position-relative">
          {prod && (
            <div className="row p-4 bg-primary bg-opacity-50 rounded d-flex align-items-stretch">
              <div className="col-lg-7 d-flex align-items-center position-relative">
                <div className="container">
                  {prod && prod.imagenes && prod.imagenes.length > 0 ? (
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <figure className="mb-4 mx-auto text-center">
                            <img className="img-fluid rounded" src={`${API_URL}/static/images/${prod?.imagenes[index]?.nombre}`} alt={prod?.nombre_producto} style={{ width: '100%', maxHeight: '500px' }} />
                          </figure>
                        </div>
                      </div>
                      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" onClick={handlePrevImage}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      </button>
                      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" onClick={handleNextImage}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      </button>
                    </div>
                  ) : (
                    <img
                      className="img-fluid rounded"
                      src={process.env.PUBLIC_URL + "/images/notFound.png"}
                      alt="Not Found"
                      style={{ width: '100%', maxHeight: '500px' }}
                    />
                  )}
                </div>
              </div>
              <div className="col-lg-5 d-flex flex-column">
                <div className="card w-100 bg-primary flex-grow-1">
                  <div className="card-header">Detalles</div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0 text-dark">
                      <li><h3>{prod.nombre}</h3></li>
                      <li className='d-flex justify-content-between'>
                        <h4>${prod.precio}</h4>
                        {prod.descuento !== null && (
                          <>
                            <h4 className='text-danger'>-{prod.descuento}%</h4>
                            <h4 className='text-warning'>${(prod.precio - ((prod.precio / 100) * prod.descuento)).toFixed(2)}</h4>
                          </>
                        )}
                      </li>
                      <li>{prod.descripcion}</li>
                      <li className='text-end'><strong>Stock: </strong>{prod.stock} {prod.stock > 1 ? "unidades" : "unidad"}</li>
                    </ul>
                  </div>
                  <div className='card-footer text-end border-top-0 bg-transparent'>
                    <div className="d-grid mt-1">
                      {prod.tipo !== "estanques" && (
                        <div className='d-flex mb-2 justify-content-between'>
                          <input className="rounded border-0 me-2 w-25" type="number" min="1" max={prod.stock} value={cantidad} onChange={handleChangeCantidad} />
                          <button className='btn btn-secondary w-75' disabled={!sesion || (sesion && sesion.tipo !== "cliente")} onClick={() => agregarCarrito(cantidad, prod.id, sesion.id)}>Agregar al carrito</button>
                        </div>
                      )}
                      <Link
                        className="btn btn-secondary"
                        to={sesion && sesion.tipo === "cliente" ? `/Pago/producto/${productoString}/${cantidad}` : '#'}
                        onClick={event => {
                          if (!sesion || (sesion && sesion.tipo !== "cliente")) {
                            event.preventDefault();
                            alert("No tienes la sesión adecuada para realizar compras.");
                          }
                        }}
                      >
                        Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
