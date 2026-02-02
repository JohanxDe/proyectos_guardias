import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import TrabajoForm from "../components/trabajoForm";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
import "../styles/form.css";

const CrearTrabajo = () => {
  const { token, usuario } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [sueldo, setSueldo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [contacto_whatsapp, setContacto_whatsapp] = useState("56992757448");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  
  const {loading, setLoading} = useLoading();

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

        const response = await fetch(API_ENDPOINTS.TRABAJOS, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            titulo,
            descripcion,
            imagen_url: imagenUrl || null,
            sueldo: parseInt(sueldo) || 0,
            ubicacion,
            latitud: parseFloat(latitud) || null,
            longitud: parseFloat(longitud) || null,
            contacto_whatsapp: contacto_whatsapp
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
        setSueldo("");
        setUbicacion("");
        setLatitud("");
        setLongitud("")

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
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Crear Trabajo</h1>

          <TrabajoForm
          titulo={titulo} setTitulo={setTitulo}
          descripcion={descripcion} setDescripcion={setDescripcion}
          imagenUrl={imagenUrl} setImagenUrl={setImagenUrl}
          sueldo={sueldo} setSueldo={setSueldo}
          ubicacion={ubicacion} setUbicacion={setUbicacion}
          latitud={latitud} setLatitud={setLatitud}
          longitud={longitud} setLongitud={setLongitud}
          contacto_whatsapp={contacto_whatsapp} setContacto_whatsapp={setContacto_whatsapp}
          onSubmit={handleSubmit}
          textoBoton="Crear trabajo"
          error={error}
          mensaje={mensaje}
          loading={loading}
        /> 
      </div>
    </div>
    </>
  );
};

export default CrearTrabajo;
