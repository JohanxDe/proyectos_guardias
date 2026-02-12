import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import useAuth from "../hooks/useAuth";
import { 
  ChevronLeft, 
  MapPin, 
  CircleDollarSign, 
  Clock, 
  Share2, 
  MessageCircle, 
  TrendingUp,
  Loader2
} from "lucide-react";
import "../styles/detalle.css";

const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Recientemente";
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diferenciaEnSegundos = Math.floor((ahora - fecha) / 1000);
    const minutos = Math.floor(diferenciaEnSegundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Publicado hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    if (horas > 0) return `Publicado hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    if (minutos > 0) return `Publicado hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    return "Publicado hace un momento";
};

const TrabajoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [trabajo, setTrabajo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`);
                const data = await response.json();
                setTrabajo(data);

                fetch(`${API_ENDPOINTS.TRABAJOS}/${id}/visita`, { 
                    method: 'POST' 
                }).catch(err => console.error("Error al registrar visita:", err));

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

    if (loading) return (
        <div className="detalle-loading">
            <Loader2 className="spinner" size={40} />
            <p>Cargando detalles...</p>
        </div>
    );
    
    if (!trabajo) return <div className="error">Trabajo no encontrado</div>;

    return (
        <div className="detalle-page">
            <button onClick={() => navigate(-1)} className="btn-back">
                <ChevronLeft size={20} /> Volver atrás
            </button>

            <div className="detalle-card">
                <header className="detalle-header">
                    <div className="header-flex">
                        <h1>{trabajo.titulo}</h1>
                        {usuario?.role === "admin" && (
                            <span className="badge-visitas">
                                <TrendingUp size={14} /> {trabajo.visitas || 0} visitas
                            </span>
                        )}
                    </div>
                    
                    <div className="detalle-meta">
                        <span><MapPin size={18} color="#3b82f6" /> {trabajo.ubicacion}</span>
                        <span><CircleDollarSign size={18} color="#22c55e" /> ${trabajo.sueldo?.toLocaleString('es-CL')}</span>
                        <span className="fecha-tag">
                            <Clock size={16} /> {formatearFecha(trabajo.fecha_publicacion)}
                        </span>
                    </div>
                </header>

                <section className="detalle-cuerpo">
                    <h3>Descripción del puesto</h3>
                    <p className="descripcion-completa">{trabajo.descripcion}</p>
                </section>

                <footer className="detalle-card__footer">
                    <button onClick={handleCompartir} className="btn-compartir">
                        <Share2 size={18} /> Compartir vacante
                    </button>

                    <a
                        href={`https://wa.me/${trabajo.contacto_whatsapp}?text=${encodeURIComponent(
                            `Hola! Me interesa la vacante de ${trabajo.titulo}.\n\nLink de la oferta: ${window.location.href}`
                        )}`}
                        className="btn-detalle-ws"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <MessageCircle size={18} /> Postular por WhatsApp
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default TrabajoDetalle;