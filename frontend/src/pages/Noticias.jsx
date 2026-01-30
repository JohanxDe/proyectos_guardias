import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
import "../styles/noticas.css"

const Noticias = () => {
    const [noticia, setNoticias] = useState([]);
    const [error, setError] = useState("");

    const{token, usuario} = useAuth();
    const navigate = useNavigate();

    const {loading, setLoading} = useLoading();

    useEffect(() =>{
        const fetchNoticias = async () => {
            try{
                setLoading(true)
                const response = await fetch(API_ENDPOINTS.NOTICIAS);

                const data = await response.json();

                if(!response.ok){
                    setError(data.error || "error al obtener noticias");
                    return;
                }

                setNoticias(data);
            }catch(err){
                setError("Error de conexion con el servidor");
            }finally{
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const handleEliminar = async (id) =>{
        const confirmar = window.confirm("¿Eliminar esta noticia?")

        if(!confirmar) return
        console.log("iD a Eliminar", id)
        console.log("Token", token)

        try{
            const response = await fetch(
                `${API_ENDPOINTS.NOTICIAS}/${id}`,
                {
                    method: "DELETE",
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                }
            
            )

            if(!response.ok){
                throw new Error();
            }
            setNoticias(noticia.filter((n)=> n.id !==id))
        }catch(err){
            alert("No se puede eliminar la noticia")
        }
    }

    const handleEditar = (id) => {
        navigate(`/editar-noticia/${id}`)
    }
    return(
        <>
  <main className="noticias">
    <h1 className="noticias__title">Noticias</h1>

    {error && <p className="noticias__error">{error}</p>}

    {noticia.length === 0 && !error && (
      <p className="noticias__empty">No hay noticias</p>
    )}

    <section className="noticias__grid">
      {noticia.map((n) => (
        <article className="noticia-card" key={n.id}>
          <div className="noticia-card__content">
            <h3>{n.titulo}</h3>
            <p>{n.descripcion}</p>
          </div>

          {usuario?.role === "admin" && (
            <div className="noticia-card__actions">
              <button
                className="btn btn--edit"
                onClick={() => handleEditar(n.id)}
              >
                Editar
              </button>

              <button
                className="btn btn--delete"
                onClick={() => handleEliminar(n.id)}
              >
                Eliminar
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  </main>
</>
    );
};

export default Noticias;