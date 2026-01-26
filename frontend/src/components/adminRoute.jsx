import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {

  const { usuario, loading } = useAuth();

  if(loading){
    return <div>Cargando...</div>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
