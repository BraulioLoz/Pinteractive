import { useState } from 'react'
import LoginControl from './components/User/LoginControl' // Importar el control
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mt-5"> {/* Container de Bootstrap */}
      
      {/* Barra superior temporal */}
      <nav className="d-flex justify-content-between align-items-center mb-5 p-3 bg-dark rounded">
        <h1 className="h4 text-white m-0">Pinteractive</h1>
        <LoginControl /> {/* Aquí está tu componente de usuario */}
      </nav>

      <div className="card text-center p-5">
        <h2>Contenido del sitio</h2>
        <p>Aquí irán los posts más adelante.</p>
        {/* El resto de tu código por defecto de Vite... */}
        <div className="card-body">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App