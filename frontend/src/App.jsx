import Navbar from "./components/Navbar/NavbarLogIn";
import Landing from "./pages/Landing.jsx";
import { Routes, Route } from "react-router-dom";
import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}