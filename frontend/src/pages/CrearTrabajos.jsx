import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CrearTrabajo = () => {
  const { token, usuario } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    

    if (usuario?.role !== "admin") {
      setError("No tienes permisos para crear trabajos");
      return;
    }

    if(!titulo || !descripcion){
        setError("titulo y descripcion son obligatorios");
        return;
    }

    try {
        setLoading(true);

        const token = localStorage.getItem("token")

        const response = await fetch("http://localhost:5000/api/trabajos", {
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
            setError(data.error || "Error al crear trabajo");
            return;
        }

        setMensaje("Trabajo creado correctamente")

        //Limpiar formulario
        setMensaje("Trabajo creado correctamente");
        setTitulo("");
        setDescripcion("");
        setImagenUrl("");

        // opcional: redirigir
        setTimeout(() => {
            navigate("/trabajos");
        }, 1000);

    } catch (err) {
      setError("Error de conexión con el servidor");
    }finally{
        setLoading(false);
    }
  };

  return (
    <>
      <h1>Crear Trabajo</h1>

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
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL de imagen (opcional)"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
        />

        <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Crear Trabajo"}
        </button>
      </form>
    </>
  );
};

export default CrearTrabajo;
