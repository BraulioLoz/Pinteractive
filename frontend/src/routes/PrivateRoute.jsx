import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Componente de ruta privada para que solo usuarios logueados accedan
export default function PrivateRoute({ children }) {
  const { user } = useUser();

  // Si no hay usuario, redirigimos al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si hay usuario, renderizamos el componente hijo
  return children;
}