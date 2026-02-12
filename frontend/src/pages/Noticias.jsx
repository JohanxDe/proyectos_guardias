import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
import "../styles/noticas.css"; 

const Noticias = () => {
    const [noticia, setNoticias] = useState([]);
    const [error, setError] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filtroTexto, setFiltroTexto] = useState("");

    const { token, usuario } = useAuth();
    const navigate = useNavigate();
    const { setLoading } = useLoading();

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.NOTICIAS);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Error al obtener noticias");
                setNoticias(data);
            } catch (err) {
                setError(err.message || "Error de conexión");
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar esta noticia?")) return;
        try {
            const response = await fetch(`${API_ENDPOINTS.NOTICIAS}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error();
            setNoticias(noticia.filter((n) => n.id !== id));
        } catch (err) {
            alert("No se puede eliminar la noticia");
        }
    };

    // Filtrado lógico
    const noticiasFiltradas = noticia.filter(n => 
        n.titulo.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    return (
        <main className="noticias-container">
            <div className="noticias__header-box">
                <h1 className="noticias__title">Actualidad y Noticias</h1>
                
                {/* Botón que activa el filtro */}
                <button 
                    className="btn-filter-trigger" 
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? "✕ Cerrar Buscador" : "🔍 Buscar Noticias"}
                </button>

                {/* Acordeón de filtros */}
                <div className={`noticias__filters-accordion ${showFilters ? "open" : ""}`}>
                    <input 
                        type="text" 
                        placeholder="Escribe el título de la noticia..." 
                        value={filtroTexto}
                        onChange={(e) => setFiltroTexto(e.target.value)}
                        className="filter-input"
                    />
                </div>
            </div>

            {error && <p className="noticias__error">{error}</p>}

            <section className="noticias__list-wide">
                {noticiasFiltradas.map((n) => (
                    <article className="noticia-card-wide" key={n.id}>
                        <div className="noticia-card__top">
                            {/* Fecha arriba como pediste */}
                            <span className="noticia-card__date">
                                📅 {new Date(n.fecha_publicacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="noticia-card__category">{n.categoria}</span>
                        </div>

                        <div className="noticia-card__body">
                            <h2 className="noticia-card__title">{n.titulo}</h2>
                            <p className="noticia-card__desc">{n.descripcion}</p>
                        </div>

                        {usuario?.role === "admin" && (
                            <div className="noticia-card__admin-actions">
                                <button className="btn--edit" onClick={() => navigate(`/editar-noticia/${n.id}`)}>✏️ Editar</button>
                                <button className="btn--delete" onClick={() => handleEliminar(n.id)}>🗑️ Eliminar</button>
                            </div>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
};

export default Noticias;