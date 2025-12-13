import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./Login.css";

// Componente de Login
export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Obtenemos el usuario y la función de login desde el contexto
  const { user, login } = useUser();
  // Si ya hay un usuario logueado, redirigimos al feed
  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]); //cambia si user o navigate cambian

  const handleLogin = (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      return setError("Completa todos los campos.");
    }

    // Leer usuarios guardados en localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find((u) => u.email === identifier || u.username === identifier);

    if (!foundUser) {
      return setError("Usuario o correo no encontrado.");
    }

    if (foundUser.password !== password) {
      return setError("Contraseña incorrecta.");
    }

    // Crear sesión
    login(foundUser);
    // Ahora si entramos al feed
    navigate("/feed");
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="mb-4">Iniciar sesión</h2>

        <input
          placeholder="Correo electrónico o usuario"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
