import { NavLink } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import "../styles/navbar.css";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo / Home */}
        <NavLink to="/" className="navbar__logo">
        <img src="/logoSinF.png" alt="Logo empresa"className="navbar__logo-img"/>
        <span className="navbar__logo-text">
          Guardias
        </span>
        </NavLink>

        {/*Hamburguesa*/}
        <button
        className="navbar__toggle"
        onClick={() => setOpen(!open)}
        >
          ☰
        </button>


      <div className={`navbar__menu ${open ? "is-open" : ""}`}>
          {/* Links */}
          <nav className="navbar__links">
            <NavLink to="/trabajos" className="navbar__link" onClick={()=> setOpen(false)}>
              Trabajos
            </NavLink>

            <NavLink to="/noticias" className="navbar__link" onClick={()=> setOpen(false)}>
              Noticias
            </NavLink>

            {usuario?.role === "admin" && (
              <>
                <NavLink to="/crear-trabajo" className="navbar__link" onClick={()=> setOpen(false)}>
                  + Trabajo
                </NavLink>

                <NavLink to="/crear-noticia" className="navbar__link" onClick={()=> setOpen(false)}>
                  + Noticia
                </NavLink>
              </>
            )}
          </nav>

          {/* Auth */}
          <div className="navbar__auth">
            {!usuario ? (
              <NavLink to="/login" className="btn btn--primary" onClick={()=> setOpen(false)}>
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
      </div>
    </header>
  );
};

export default Navbar;
