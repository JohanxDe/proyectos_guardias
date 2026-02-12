import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
// Importamos los iconos
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Pencil, 
  Trash2, 
  MessageCircle, 
  Eye, 
  Map 
} from "lucide-react";
import "../styles/trabajos.css"

const Trabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState(""); 

  const { token, usuario } = useAuth();
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        setLoading(true)
        const response = await fetch(API_ENDPOINTS.TRABAJOS);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Error al obtener trabajos");
          return;
        }
        setTrabajos(data);
      } catch (err) {
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchTrabajos();
  }, []);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Eliminar este trabajo?");
    if (!confirmar) return;
    try {
      const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setTrabajos(trabajos.filter((t) => t.id !== id))
    } catch (err) {
      alert("no se pudo eliminar el trabajo")
    }
  }

  const handleEditar = (id) => navigate(`/editar-trabajo/${id}`);

  const trabajosFiltrados = trabajos.filter(t =>
    t.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="trabajos">
      <h1 className="trabajos__title">Trabajos Disponibles</h1>

      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar por cargo o comuna..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="trabajos__error">{error}</p>}
      {trabajosFiltrados.length === 0 && !loading && (
        <p className="trabajos__empty">No se encontraron resultados.</p>
      )}

      <section className="trabajos__grid">
        {trabajosFiltrados.map((trabajo) => {
          const urlTrabajo = `${window.location.origin}/trabajo/${trabajo.id}`;

          return (
            <article className="trabajo-card" key={trabajo.id}>
              <div className="trabajo-card__content">
                <h3>{trabajo.titulo}</h3>

                <div className="trabajo-card__info">
                  <span><MapPin size={16} color="#3b82f6" /> {trabajo.ubicacion}</span>
                  <span><DollarSign size={16} color="#22c55e" /> {trabajo.sueldo?.toLocaleString('es-CL')}</span>
                </div>

                <p className="trabajo-card__description">
                  {trabajo.descripcion.substring(0, 100)}...
                </p>

                <button
                  className="btn-details"
                  onClick={() => navigate(`/trabajo/${trabajo.id}`)}
                >
                  <Eye size={18} /> Ver oferta completa
                </button>

                <div className="trabajo-card__public-links">
                  <a
                    href={`https://wa.me/${trabajo.contacto_whatsapp}?text=${encodeURIComponent(
                      `Hola! Me interesa la vacante de ${trabajo.titulo}.\n\nLink: ${urlTrabajo}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-public btn--whatsapp"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </a>

                  {trabajo.latitud && trabajo.longitud && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${trabajo.latitud},${trabajo.longitud}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-public btn--maps"
                    >
                      <Map size={18} /> Mapa
                    </a>
                  )}
                </div>
              </div>

              {usuario?.role === "admin" && (
                <div className="trabajo-card__actions">
                  <button className="btn-admin btn--edit" onClick={() => handleEditar(trabajo.id)}>
                    <Pencil size={16} />
                  </button>
                  <button className="btn-admin btn--delete" onClick={() => handleEliminar(trabajo.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default Trabajos;