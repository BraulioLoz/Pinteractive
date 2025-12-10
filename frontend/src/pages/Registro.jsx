import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./Registro.css";

export default function Registro() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validación de correo
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return setError("Correo inválido.");
    }

    // Simulamos guardar en una "base de datos" en localStorage temporal 
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Ver si ya existe el correo
    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      return setError("Este correo ya está registrado.");
    }

    // Guardamos el usuario
    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));

    // Creamos la sesión
    login(form.email); // TU CHAMBA BRAULIO: aquí harías un token

    navigate("/feed");
  };

  return (
    <div className="register-wrapper">
      <form className="register-card" onSubmit={handleRegister}>
        <h2 className="mb-4">Crear cuenta</h2>

        <input
          className="form-control mb-3"
          type="text"
          name="name"
          placeholder="Tu nombre"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary w-100 mt-3">
          Registrarme
        </button>
      </form>
    </div>
  );
}
