import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalContext from './config/GlobalContext';
import { Catalogue, Login, Register, Profile, History, Product, Cart, Pago, Admin, Administradores, Clientes, Estanques, Alimentos, Suplementos, Reportes, GrafEstanques, Peces, EstanqueUsuario } from './pages/';
const API_URL = 'http://localhost/HydroWardGod/hydroward_back';

function App() {
  return (
    <Router>
      <GlobalContext.Provider value={{ API_URL }}>
        <Routes>
          <Route path="/" element={<Catalogue />} />
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

// import React, { useState, useEffect } from 'react';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';

// function App() {
//     const [ user, setUser ] = useState([]);
//     const [ profile, setProfile ] = useState([]);

//     const login = useGoogleLogin({
//         onSuccess: (codeResponse) => setUser(codeResponse),
//         onError: (error) => console.log('Login Failed:', error)
//     });

//     useEffect(
//         () => {
//             if (user) {
//                 axios
//                     .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
//                         headers: {
//                             Authorization: `Bearer ${user.access_token}`,
//                             Accept: 'application/json'
//                         }
//                     })
//                     .then((res) => {
//                         setProfile(res.data);
//                     })
//                     .catch((err) => console.log(err));
//             }
//         },
//         [ user ]
//     );

//     const logOut = () => {
//         googleLogout();
//         setProfile(null);
//     };

//     console.log("setUser", user)
//     console.log("setProfile", profile)

//     return (
//         <div>
//             <h2>React Google Login</h2>
//             <br />
//             <br />
//             {profile ? (
//                 <div>
//                     <img src={profile.picture} alt="user image" />
//                     <h3>User Logged in</h3>
//                     <p>Name: {profile.name}</p>
//                     <p>Email Address: {profile.email}</p>
//                     <br />
//                     <br />
//                     <button onClick={logOut}>Log out</button>
//                 </div>
//             ) : (
//                 <button onClick={login}>Sign in with Google 🚀 </button>
//             )}
//         </div>
//     );
// }
// export default App;
