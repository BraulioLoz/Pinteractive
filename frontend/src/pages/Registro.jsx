import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

export default function Registro() {
  //usamos useNavigate para cambiar de página después del registro 
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    name: "",
    username:"",
    email:"",
    password:"",
  });

  const [error, setError] = useState("");

  //guardamos los datos del formulario en el estado
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  }

  const handleRegistro = (e) => {
    e.preventDefault(); //evitamos que se recargue la página
    // Validamos que el correo tenga lo mínimo necesario
    if(!form.email.includes("@") || !form.email.includes(".")) {
      return setError("Ingresa un correo válido.");
    }
    // Validamos que el usuario tenga al menos 3 carácteres
    if(form.username.trim().length < 3) {
      return setError("El nombre de usuario debe tener al menos 3 caracteres.");
    }
    // Validamos que la contraseña tenga al menos 6 carácteres
    if(form.password.trim().length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }
    // Leer usuarios guardados en localStorage, si no hay nada nos regresa un arreglo vacío
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // Verificamos que no exista otro usuario con el mismo correo
    const existsEmail = users.find((u) => u.email === form.email);
    const existsUserName = users.find((u) => u.username === form.username);

    if(existsEmail) {
      return setError ("Ya existe una cuenta con este correo.");
    }
    if(existsUserName) {
      return setError ("El nombre de usuario no está disponible.");
    }
    // Si todo está bien, guardamos el nuevo usuario
    users.push(form);
    localStorage.setItem("users", JSON.stringify (users));
    // Redirigimos al usuario al login
    navigate ("/login");
  };
  return (
    <div className="registro-wrapper">
      <form className="registro-card" onSubmit={handleRegistro}>
        <h2 className="mb-4">Crear cuenta</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nombre completo"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nombre de usuario"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Correo electrónico"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Contraseña"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />  

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary w-100">
          Registrarme
        </button>
      </form>
    </div>
  );
}