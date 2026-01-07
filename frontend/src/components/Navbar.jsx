import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/navbar.css";

const Navbar = () => {
  const { usuario, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo / Home */}
        <NavLink to="/" className="navbar__logo">
          Guardias
        </NavLink>

        {/* Links */}
        <nav className="navbar__links">
          <NavLink to="/trabajos" className="navbar__link">
            Trabajos
          </NavLink>

          <NavLink to="/noticias" className="navbar__link">
            Noticias
          </NavLink>

          {usuario?.role === "admin" && (
            <>
              <NavLink to="/crear-trabajo" className="navbar__link">
                + Trabajo
              </NavLink>

              <NavLink to="/crear-noticia" className="navbar__link">
                + Noticia
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth */}
        <div className="navbar__auth">
          {!usuario ? (
            <NavLink to="/login" className="btn btn--primary">
              Ingresar
            </NavLink>
          ) : (
            <>
              <span className="navbar__user">
                {usuario.role === "admin" ? "Admin" : "Usuario"}
              </span>

              <button onClick={logout} className="btn btn--logout">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
