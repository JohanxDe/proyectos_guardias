import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NoticiasForm from "../components/NoticiasForm";
import { API_ENDPOINTS } from "../config/api";
import "../styles/form.css"

const EditarNoticia = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("Noticias"); 
    const [imagenUrl, setImagenUrl] = useState(""); 
    const [error, setError] = useState("");

    // Cargar noticia para editar
    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.NOTICIAS}/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Error al cargar la noticia");
                    return;
                }

                // Seteamos los valores que vienen de la DB
                setTitulo(data.titulo);
                setDescripcion(data.descripcion);
                setCategoria(data.categoria || "Noticias"); // Cargamos la categoría guardada
                setImagenUrl(data.imagen_url || "");
            } catch {
                setError("Error de conexión");
            }
        };

        fetchNoticia();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API_ENDPOINTS.NOTICIAS}/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    // ENVIAMOS la categoría al backend actualizado
                    body: JSON.stringify({ 
                        titulo, 
                        descripcion, 
                        categoria, 
                        imagen_url: imagenUrl 
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }
            navigate("/noticias");
        } catch (err) {
            setError(err.message || "No se puede editar la noticia");
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                <h1 className="form-title">Editar noticia</h1>

                <NoticiasForm
                    titulo={titulo}
                    setTitulo={setTitulo}
                    descripcion={descripcion}
                    setDescripcion={setDescripcion}
                    categoria={categoria}        
                    setCategoria={setCategoria}  
                    imagenUrl={imagenUrl}        
                    setImagenUrl={setImagenUrl}  
                    onSubmit={handleSubmit}
                    textoBoton="Guardar Cambios"
                    error={error}
                />
            </div>
        </div>
    );
};

export default EditarNoticia;