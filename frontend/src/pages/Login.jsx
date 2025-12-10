import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();

    // Validación básica
    if (!email.includes("@") || !email.includes(".")) {
      return setError("Ingresa un correo válido.");
    }

    // Leer usuarios guardados (simulación de BD)
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Verificar si existe
    const exists = users.find((u) => u.email === email);

    if (!exists) {
      return setError("No existe una cuenta con este correo.");
    }

    // Crear sesión
    login(email);

    /* 
       AQUI IRÍA TU BACKEND REAL:
       - Enviar correo/contraseña al servidor
       - Recibir token JWT
       - Guardarlo en sessionStorage
       - login(token)
    */

    navigate("/feed");
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="mb-4">Iniciar sesión</h2>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary w-100 mt-3">
          Entrar
        </button>
      </form>
    </div>
  );
}
