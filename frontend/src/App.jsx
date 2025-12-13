import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar/NavbarLogin.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login";
import Registro from "./pages/Registro.jsx";

import PrivateRoute from "./routes/PrivateRoute";


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