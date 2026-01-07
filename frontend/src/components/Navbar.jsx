import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/navbar.css";

const Navbar = () => {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__links">
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
      </div>

      <div className="navbar__actions">
        {!usuario ? (
          <Link to="/login" className="navbar__login">Login</Link>
        ) : (
          <button onClick={logout} className="navbar__logout">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;