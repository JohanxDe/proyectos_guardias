import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "../styles/detalle.css";

const TrabajoDetalle = () => {
    const { id } = useParams(); // Captura el ID de la URL
    const navigate = useNavigate();
    const [trabajo, setTrabajo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`);
                const data = await response.json();
                setTrabajo(data);
            } catch (error) {
                console.error("Error al cargar detalle:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id]);

    if (loading) return <div className="loading">Cargando detalles...</div>;
    if (!trabajo) return <div className="error">Trabajo no encontrado</div>;

    return (
        <div className="detalle-page">
            <button onClick={() => navigate(-1)} className="btn-back">
                ← Volver atrás
            </button>

            <div className="detalle-card">
                <header className="detalle-header">
                    <h1>{trabajo.titulo}</h1>
                    <div className="detalle-meta">
                        <span>📍 {trabajo.ubicacion}</span>
                        <span>💰 ${trabajo.sueldo?.toLocaleString('es-CL')}</span>
                    </div>
                </header>

                <section className="detalle-cuerpo">
                    <h3>Descripción del puesto</h3>
                    <p className="descripcion-completa">{trabajo.descripcion}</p>
                </section>

                <footer className="detalle-footer">
                    <a 
                        href={`https://wa.me/TUNUMERO?text=Hola, me interesa el puesto de ${trabajo.titulo}`}
                        className="btn-ws-detalle"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Postular por WhatsApp
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default TrabajoDetalle;