import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"; // Importamos BrowserRouter que nos permite usar rutas para navegar entre paginas
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //Importamos el js de boostrap para que nos funcione la hamburguesa


// Get base path from environment variable or default to /Pinteractive for GitHub Pages
const basePath = import.meta.env.VITE_BASE_PATH || '/Pinteractive';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basePath}>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
)