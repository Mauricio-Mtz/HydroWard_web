import React from 'react';
import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import GlobalContext from './config/GlobalContext';
import { Catalogue, Login, Register, Profile, History, Product, Cart, Pago, Admin, Administradores, Clientes, Estanques, Alimentos, Suplementos, Reportes, GrafEstanques, Peces, EstanqueUsuario } from './pages/';
// const API_URL = 'http://localhost/HydroWardGod/hydroward_back';
const API_URL = 'http://dtai.uteq.edu.mx/~maumar214/hydroward_back';

function App() {
  return (
    <Router>
      <GlobalContext.Provider value={{ API_URL }}>
        <Routes>
          <Route path="/:search?" element={<Catalogue />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/History" element={<History />} />
          <Route path="/Product/:id" element={<Product />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Pago/:tipoCompra/:objeto/:cantidad" element={<Pago />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Administradores" element={<Administradores />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/Estanques" element={<Estanques />} />
          <Route path="/Alimentos" element={<Alimentos />} />
          <Route path="/Suplementos" element={<Suplementos />} />
          <Route path="/Reportes/:accion" element={<Reportes />} />
          <Route path="/EstanqueUsuario" element={<EstanqueUsuario />} />
          <Route path="/GrafEstanques" element={<GrafEstanques />} />
          <Route path="/Peces" element={<Peces />} />
          <Route path="*" element={<h1 className='text-center'>Not Found</h1>} />
        </Routes>
      </GlobalContext.Provider>
    </Router>
  );
}

export default App;
