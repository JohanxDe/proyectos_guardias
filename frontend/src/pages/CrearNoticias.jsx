import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CrearNoticia = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!titulo || !descripcion) {
      setError("Título y contenido son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/noticias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          imagen_url: imagenUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la noticia");
        return;
      }

      setMensaje("Noticia creada correctamente");

      setTitulo("");
      setDescripcion("");
      setImagenUrl("");

      setTimeout(() => {
        navigate("/noticias");
      }, 1000);

    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Crear Noticia</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="text"
          placeholder="Imagen URL (opcional)"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Noticia"}
        </button>
      </form>
    </>
  );
};

export default CrearNoticia;
