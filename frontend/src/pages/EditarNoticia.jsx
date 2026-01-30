import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NoticiasForm from "../components/NoticiasForm";
import { API_ENDPOINTS } from "../config/api";
import "../styles/form.css"

const EditarNoticia = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useAuth();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("")

    //Cargar noticias
    useEffect(() => {
        const fetchNoticias = async() => {
            try{
                const response = await fetch(
                    `${API_ENDPOINTS.NOTICIAS}/${id}`
                );

                const data = await response.json();

                if(!response.ok){
                    setError(data.error || "Error al cargar la noticia")
                    return;
                }

                setTitulo(data.titulo);
                setDescripcion(data.descripcion);
            }catch{
                setError("Error de conexion")
            }
        };

        fetchNoticias();
    }, [id]);

    //Editar noticia
    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{
            const response = await fetch(
                `${API_ENDPOINTS.NOTICIAS}/${id}`,
                {
                    method: "PUT",
                    headers:{
                        "content-type" : "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({titulo, descripcion}),
                }
            );

            if(!response.ok){
                throw new Error();
            }
            navigate("/noticias")
        }catch{
            setError("No se puede editar la noticia")
        }
    };

    return(
        <>
        <div className="form-page">
            <div className="form-card">
                <h1 className="form-title">Editar noticia</h1>

                <NoticiasForm
                titulo={titulo}
                setTitulo={setTitulo}
                descripcion={descripcion}
                setDescripcion={setDescripcion}
                onSubmit={handleSubmit}
                textoBoton="Guardar Cambios"
                error={error}
                />
            </div>
        </div>
        </>
    )
};

export default EditarNoticia;