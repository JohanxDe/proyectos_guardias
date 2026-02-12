import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import { API_ENDPOINTS } from "../config/api";

const CrearNoticia = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [categoria, setCategoria] = useState("Noticias"); 
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!titulo || !descripcion) {
      setError("Título y descripción son obligatorios");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(API_ENDPOINTS.NOTICIAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          imagen_url: imagenUrl || null,
          categoria, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la noticia");
        return;
      }

      setMensaje("Noticia creada correctamente");

      setTimeout(() => {
        navigate("/noticias");
      }, 1000);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Crear Noticia</h1>

        {error && <div className="form-error">{error}</div>}
        {mensaje && <div className="form-success">{mensaje}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              type="text"
              placeholder="Ej: Nueva normativa de seguridad"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="Noticias">Noticias</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Capacitación">Capacitación</option>
              <option value="Eventos">Eventos</option>
              <option value="os10">OS10</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              placeholder="Escribe el contenido de la noticia..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL de la Imagen</label>
            <input
              type="text"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
            />
          </div>

          <button className="form-button" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Publicar Noticia"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearNoticia;