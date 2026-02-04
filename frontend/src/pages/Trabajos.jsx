import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
import "../styles/trabajos.css"

const Trabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState("");
  // ✅ CORRECCIÓN 1: Inicializar el estado
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

  // Lógica de filtrado
  const trabajosFiltrados = trabajos.filter(t =>
    t.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <main className="trabajos">
        <h1 className="trabajos__title">Trabajos Disponibles</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar por cargo o comuna..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {error && <p className="trabajos__error">{error}</p>}
        {trabajosFiltrados.length === 0 && !loading && (
          <p className="trabajos__empty">No se encontraron resultados.</p>
        )}

        <section className="trabajos__grid">
          {/* ✅ CORRECCIÓN 2: Un solo map usando trabajosFiltrados */}
          {trabajosFiltrados.map((trabajo) => (
            <article className="trabajo-card" key={trabajo.id}>
              <div className="trabajo-card__content">
                <h3>{trabajo.titulo}</h3>
                
                {/* Mostramos los nuevos datos */}
                <div className="trabajo-card__info">
                   <span>📍 {trabajo.ubicacion}</span>
                   <span>💰 ${trabajo.sueldo?.toLocaleString('es-CL')}</span>
                </div>

                <p>{trabajo.descripcion}</p>

                {/* BOTÓN DE WHATSAPP AUTOMÁTICO */}
                <a 
                  href={`https://wa.me/${trabajo.contacto_whatsapp}?text=Hola! Me interesa la vacante de ${encodeURIComponent(trabajo.titulo)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--whatsapp"
                >
                  Postular por WhatsApp
                </a>
              </div>

              {usuario?.role === "admin" && (
                <div className="trabajo-card__actions">
                  <button className="btn btn--edit" onClick={() => handleEditar(trabajo.id)}>Editar</button>
                  <button className="btn btn--delete" onClick={() => handleEliminar(trabajo.id)}>Eliminar</button>
                </div>
              )}
            </article>
          ))}
        </section>
      </main>
    </>
  );
};

export default Trabajos;