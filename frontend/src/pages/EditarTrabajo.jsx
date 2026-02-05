import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import TrabajoForm from "../components/trabajoForm";
import { API_ENDPOINTS } from "../config/api";
import "../styles/form.css";


const EditarTrabajo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sueldo, setSueldo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("")
  const [contacto_whatsapp, setContacto_whatsapp] = useState("");
  const [imagenUrl, setImagenUrl] = useState("")
  const [error, setError] = useState("");


  //Cargar trabajo
  useEffect(() => {

    const fetchTrabajos = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.TRABAJOS}/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error al cargar el trabajo");
          return;
        }

        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setSueldo(data.sueldo);
        setUbicacion(data.ubicacion);
        setLatitud(data.latitud);
        setLongitud(data.longitud);
        setContacto_whatsapp(data.contacto_whatsapp);
        setImagenUrl(data.imagenUrl);
      } catch {
        setError("Error de conexión");
      }
    };

    fetchTrabajos();
  }, [id]);


  //Editar trabajo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_ENDPOINTS.TRABAJOS}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            titulo, 
            descripcion,
            sueldo: parseInt(sueldo) || 0,
            ubicacion,
            latitud: parseFloat(latitud) || null,
            longitud: parseFloat(longitud) || null,
            contacto_whatsapp,
            imagenUrl: imagenUrl
           }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      navigate("/trabajos")
    } catch {
      setError("No se puede editar el trabajo")
    }
  };

  return (
    <>
      <div className="form-page">
        <div className="form-card">
          <h1 className="form-title">Editar trabajo</h1>

          <TrabajoForm
            titulo={titulo} setTitulo={setTitulo}
            descripcion={descripcion} setDescripcion={setDescripcion}
            sueldo={sueldo} setSueldo={setSueldo}
            ubicacion={ubicacion} setUbicacion={setUbicacion}
            latitud={latitud} setLatitud={setLatitud}
            longitud={longitud} setLongitud={setLongitud}
            contacto_whatsapp={contacto_whatsapp} setContacto_whatsapp={setContacto_whatsapp}
            imagenUrl={imagenUrl} setImagenUrl={setImagenUrl}
            onSubmit={handleSubmit}
            textoBoton="Guardar cambios"
            error={error}
          />
        </div>
      </div>
    </>
  );

};

export default EditarTrabajo;
