import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import "../styles/notfound.css";

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <ShieldAlert size={80} className="notfound-icon" />
                <h1 className="notfound-title">404</h1>
                <h2 className="notfound-subtitle">Área no encontrada</h2>
                <p className="notfound-text">
                    Lo sentimos, la página que buscas no existe o ha sido movida. 
                    Verifica la dirección o vuelve al panel principal.
                </p>
                <Link to="/" className="notfound-btn">
                    <Home size={20} />
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFound;