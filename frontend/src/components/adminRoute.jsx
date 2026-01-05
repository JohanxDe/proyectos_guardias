import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {

  const { usuario } = useAuth();

  
  console.log("adminRoute usuario", usuario)

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!usuario){
    return null;
  }

  if (usuario.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
