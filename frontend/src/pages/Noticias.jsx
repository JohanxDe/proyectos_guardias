import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";

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
                const response = await fetch("http://localhost:5000/api/noticias");

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
                `http://localhost:5000/api/noticias/${id}`,
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
    return(
        <>
            <h1>noticias</h1>

            {error && <p>{error}</p>}

            {noticia.length === 0 && !error && <p>no hay noticias</p>}

            {noticia.map((noticia)=>(
                <div key={noticia.id}>
                    <h3>{noticia.titulo}</h3>
                    <p>{noticia.descripcion}</p>
                    {usuario?.role === "admin" &&(
                        <>
                            <button onClick={()=> handleEliminar(noticia.id)}>
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            ))}
        </>
    );
};

export default Noticias;