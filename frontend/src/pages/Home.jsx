import useAuth from "../hooks/useAuth";
import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const { usuario } = useAuth();

  return (
    <div className="home">
      {/* HERO SECTION - Enfoque Profesional */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">Especialistas en Seguridad Privada</span>
          <h1 className="hero__title">
            Tu próximo destino como <span className="text-gradient">Guardia de Seguridad</span>
          </h1>
          <p className="hero__subtitle">
            Accede a las mejores ofertas laborales del sector y mantente informado con las últimas normativas y noticias de seguridad.
          </p>
          <div className="hero__actions">
            <Link to="/trabajos" className="btn-primary">Explorar Ofertas</Link>
            <Link to="/noticias" className="btn-secondary">Ver Noticias</Link>
          </div>
        </div>
        <div className="hero__glow"></div>
      </section>

      {/* SECCIÓN DE ACCESO RÁPIDO */}
      <section className="quick-access">
        <div className="access-card">
          <h3>Bolsa de Trabajo</h3>
          <p>Encuentra vacantes para retail, eventos, condominios y seguridad industrial.</p>
          <Link to="/trabajos/" className="access-link">Ver vacantes →</Link>
        </div>
        <div className="access-card">
          <h3>Portal de Noticias</h3>
          <p>Actualizaciones sobre el curso OS-10, leyes de seguridad privada y consejos tácticos.</p>
          <Link to="/noticias/" className="access-link">Leer más →</Link>
        </div>
      </section>

      {/* SECCIÓN INFORMATIVA / VALORES */}
      <section className="trust-section">
        <div className="trust-content">
          <h2>¿Por qué elegir nuestra plataforma?</h2>
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">🛡️</div>
              <h4>Empresas Verificadas</h4>
              <p>Solo publicamos ofertas de empresas con acreditación vigente.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📄</div>
              <h4>Gestión de OS-10</h4>
              <p>Información clave sobre cursos y renovaciones de credenciales.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">💼</div>
              <h4>Soporte para Guardias</h4>
              <p>Facilitamos el contacto directo entre el profesional y la vacante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE O CTA FINAL */}
      {!usuario && (
        <section className="admin-cta">
          <p>¿Eres reclutador? <Link to="/login">Inicia sesión aquí</Link> para publicar.</p>
        </section>
      )}
    </div>
  );
};

export default Home;