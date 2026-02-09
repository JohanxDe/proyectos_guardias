import { Link } from "react-router-dom";
import "../styles/footer.css"; // Asegúrate de crear este CSS

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} <strong>Servicio JG</strong> - Todos los derechos reservados.
        </p>
        
        <nav className="footer-nav">
          <Link to="/terminos" className="footer-link">Términos y Condiciones</Link>
          <span className="footer-divider">|</span>
          <p className="footer-disclaimer">
            Servicio JG actúa únicamente como intermediario entre postulantes y empresas.
          </p>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;