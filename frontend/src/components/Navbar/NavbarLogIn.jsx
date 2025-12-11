import LoginControl from "../User/LoginControl";
import "./NavbarLogIn.css";
import logo from "../../assets/logoPinteractive.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4 fixed-top">
      <div className="container-fluid">

        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img src={logo} alt="Logo" className="nav-logo" />
          <span className="fw-bold brand-text">Pinteractive</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div className="d-flex gap-3">

            <Link to="/login" className="btn btn-outline-primary px-4">
              Iniciar sesión
            </Link>

            <Link to="/registro" className="btn btn-primary px-4">
              Regístrate
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}