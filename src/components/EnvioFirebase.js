import React, { useState, useEffect, useContext } from 'react';
import GlobalContext from '../config/GlobalContext';
import axios from 'axios';

export default function EnvioFirebase() {
    const { API_URL } = useContext(GlobalContext);
  const [idEstanque, setIdEstanque] = useState('');
  const [alimentacion, setAlimentacion] = useState(false);
  const [conteo, setConteo] = useState('');
  const [ph, setPh] = useState('');
  const [temperatura, setTemperatura] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append('id_estanque', idEstanque);
    data.append('alimentacion', alimentacion);
    data.append('conteo', conteo);
    data.append('ph', ph);
    data.append('temperatura', temperatura);

    try {
      const response = await axios.post(`${API_URL}/Firebase/test`, data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-3">
          <label htmlFor="idEstanque" className="form-label">ID Estanque:</label>
          <input type="text" className="form-control" id="idEstanque" value={idEstanque} onChange={e => setIdEstanque(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="alimentacion" className="form-label">Alimentación:</label>
          <input type="checkbox" className="form-check-input" id="alimentacion" checked={alimentacion} onChange={e => setAlimentacion(e.target.checked)} />
        </div>
        <div className="mb-3">
          <label htmlFor="conteo" className="form-label">Conteo:</label>
          <input type="text" className="form-control" id="conteo" value={conteo} onChange={e => setConteo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="ph" className="form-label">PH:</label>
          <input type="text" className="form-control" id="ph" value={ph} onChange={e => setPh(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="temperatura" className="form-label">Temperatura:</label>
          <input type="text" className="form-control" id="temperatura" value={temperatura} onChange={e => setTemperatura(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
};
