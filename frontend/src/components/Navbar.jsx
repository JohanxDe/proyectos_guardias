import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const {usuario, logout} = useAuth();
    console.log("Navbar usuario:", usuario);

    return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/trabajos">Trabajos</Link>
      <Link to="/noticias">Noticias</Link>

      {usuario?.role === "admin" && (
        <>
          <Link to="/crear-trabajo">Agregar Trabajo</Link>
          <Link to="/crear-noticia">Agregar Noticia</Link>
          <Link to="/perfil">Perfil</Link>
        </>
      )}

      {!usuario ? (
        <Link to="/login">Login</Link>
      ) : (
        <button onClick={logout}>Cerrar sesión</button>
      )}
    </nav>
  );
};

export default Navbar;