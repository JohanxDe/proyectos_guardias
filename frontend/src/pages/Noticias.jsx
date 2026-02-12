import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
import "../styles/noticas.css";
import { Calendar, Search, ChevronDown } from "lucide-react"

const Noticias = () => {
    const [noticia, setNoticias] = useState([]);
    const [error, setError] = useState("");

    // Estados para Dropdown de filtrado
    const [showDropdown, setShowDropdown] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

    const { token, usuario } = useAuth();
    const navigate = useNavigate();
    const { setLoading } = useLoading();

    // Lista de categorías 
    const categorias = ["Todas", "Seguridad", "Noticias", "Capacitación", "Eventos", "os10"];

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

    // Lógica de filtrado por categoría
    const noticiasFiltradas = noticia.filter(n =>
        categoriaSeleccionada === "Todas" ? true : n.categoria === categoriaSeleccionada
    );

    return (
        <main className="noticias-container">
            <div className="noticias__header-box">
                <h1 className="noticias__title">Actualidad y Noticias</h1>

                {/* Contenedor del Dropdown */}
                <div className="noticias__filter-wrapper">
                    <button
                        className="dropdown-button"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Search size={18} className="icon-blue" />
                            <span>
                                {categoriaSeleccionada === "Todas"
                                    ? "Filtrar por categoría"
                                    : `Categoría: ${categoriaSeleccionada}`}
                            </span>
                        </div>
                        <ChevronDown
                            size={18}
                            className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                        />
                    </button>

                    {/* Lista que baja */}
                    <ul className={`dropdown-list ${showDropdown ? 'show' : ''}`}>
                        {categorias.map((cat) => (
                            <li 
                                key={cat} 
                                className="dropdown-item"
                                onClick={() => {
                                    setCategoriaSeleccionada(cat);
                                    setShowDropdown(false);
                                }}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {error && <p className="noticias__error">{error}</p>}

            {noticiasFiltradas.length === 0 && !error && (
                <p className="noticias__empty">No hay noticias en esta categoría.</p>
            )}

            <section className="noticias__list-wide">
                {noticiasFiltradas.map((n) => (
                    <article className="noticia-card-wide" key={n.id}>
                        <div className="noticia-card__top">
                            {/* Fecha arriba resaltada */}
                            <span className="noticia-card__date">
                                <Calendar size={14} className="icon-blue" /> {new Date(n.fecha_publicacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="noticia-card__category-tag">{n.categoria}</span>
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