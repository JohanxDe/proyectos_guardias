import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} <strong>JG Service</strong> - Todos los derechos reservados.
        </p>
        
        <nav className="footer-nav">
          <div className="footer-links-group">
            <Link to="/quienes-somos" className="footer-link">Quiénes Somos</Link>
            <span className="footer-divider">|</span>
            <Link to="/terminos" className="footer-link">Términos y Condiciones</Link>
          </div>

          <span className="footer-divider desktop-only">|</span>
          
          <p className="footer-disclaimer">
            JG Service actúa únicamente como intermediario independiente entre postulantes y empresas.
          </p>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;