import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import "../styles/detalle.css";

const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Recientemente";
    
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diferenciaEnSegundos = Math.floor((ahora - fecha) / 1000);
    
    // Cálculos de tiempo
    const minutos = Math.floor(diferenciaEnSegundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Publicado hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    if (horas > 0) return `Publicado hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    if (minutos > 0) return `Publicado hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    
    return "Publicado hace un momento";
};

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

    const handleCompartir = () => {
        const urlCompartir = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: `Servicio JG - ${trabajo.titulo}`,
                text: `Revisa esta oferta laboral: ${trabajo.titulo} en ${trabajo.ubicacion}`,
                url: urlCompartir,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(urlCompartir);
            alert("Enlace copiado al portapapeles");
        }
    };

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
                        <span className="fecha-tag">🕒 {formatearFecha(trabajo.fecha_publicacion)}</span>
                    </div>
                </header>

                <section className="detalle-cuerpo">
                    <h3>Descripción del puesto</h3>
                    <p className="descripcion-completa">{trabajo.descripcion}</p>
                </section>

                {/* Footer único y limpio */}
                <footer className="detalle-card__footer">
                    <button onClick={handleCompartir} className="btn-compartir">
                        🔗 Compartir vacante
                    </button>

                    <a
                        href={`https://wa.me/${trabajo.contacto_whatsapp}?text=${encodeURIComponent(`Hola, me interesa el puesto de ${trabajo.titulo} que vi en Servicio JG`)}`}
                        className="btn-detalle-ws"
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