import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { CreatePostModal } from "../Post";
import "./NavbarLogIn.css";
import logo from "../../assets/logoPinteractive.png";

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4 fixed-top">
        <div className="container-fluid">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2"
            style={{ textDecoration: "none" }}
          >
            <img src={logo} alt="Logo" className="nav-logo" />
            <span className="fw-bold brand-text">Pinteractive</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarContent"
          >
            {user ? (
              // Usuario logueado
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="text-muted d-none d-md-inline">
                  Hola, <strong>{user.username || user.email}</strong>
                </span>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Crear Post
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </div>
            ) : (
              // Usuario no logueado
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-outline-primary px-4">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn btn-primary px-4">
                  Regístrate
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de crear post */}
      <CreatePostModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={() => {
          setShowCreateModal(false);
          // El feed se actualizará automáticamente cuando se recargue
          window.location.reload();
        }}
      />
    </>
  );
}
