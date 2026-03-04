import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import "../styles/navbar.css";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false);

  
  const [isLight, setIsLight] = useState(localStorage.getItem('theme') === 'light');

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo / Home */}
        <NavLink to="/" className="navbar__logo">
          <img src="/logoSinF.png" alt="Logo empresa" className="navbar__logo-img"/>
          <span className="navbar__logo-text">JG Service</span>
        </NavLink>

        {/* Hamburguesa */}
        <button className="navbar__toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <div className={`navbar__menu ${open ? "is-open" : ""}`}>
          <nav className="navbar__links">
            <NavLink to="/trabajos" className="navbar__link" onClick={()=> setOpen(false)}>
              Trabajos
            </NavLink>
            <NavLink to="/noticias" className="navbar__link" onClick={()=> setOpen(false)}>
              Noticias
            </NavLink>

            {usuario?.role === "admin" && (
              <>
                <NavLink to="/perfil" className="navbar__link navbar__link--admin" onClick={() => setOpen(false)}>
                  Administracion
                </NavLink>
                <NavLink to="/crear-trabajo" className="navbar__link" onClick={()=> setOpen(false)}>
                  + Trabajo
                </NavLink>
                <NavLink to="/crear-noticia" className="navbar__link" onClick={()=> setOpen(false)}>
                  + Noticia
                </NavLink>
              </>
            )}
          </nav>

          {/* Sección de Auth y el Botón de Modo */}
          <div className="navbar__auth" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* BOTÓN MODO CLARO/OSCURO */}
            <button 
              onClick={() => setIsLight(!isLight)}
              className="theme-toggle-btn"
              title="Cambiar modo de color"
            >
              {isLight ? '🌙' : '☀️'}
            </button>

            {!usuario ? (
              <NavLink to="/login" className="btn btn--primary" onClick={()=> setOpen(false)}>
                Ingresar
              </NavLink>
            ) : (
              <button onClick={logout} className="btn btn--logout">
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;