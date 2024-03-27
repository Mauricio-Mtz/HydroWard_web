import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './../node_modules/bootstrap/css/stylesAdmin.css';
import './../node_modules/bootstrap/css/styles.css';
import 'bootstrap';

import './App.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='958356469777-tdc0rd9ap9rm21m82qdhao94v09lola3.apps.googleusercontent.com'>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
reportWebVitals();
