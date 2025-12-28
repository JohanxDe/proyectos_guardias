import { useEffect, useState } from "react";

const Noticias = () => {
    const [noticia, setNoticias] = useState([]);
    const [error, setError] = useState("");

    useEffect(() =>{
        const fetchNoticias = async () => {
            try{
                const response = await fetch("http://localhost:5000/api/noticias");

                const data = await response.json();

                if(!response.ok){
                    setError(data.error || "error al obtener noticias");
                    return;
                }

                setNoticias(data);
            }catch(err){
                setError("Error de conexion con el servidor");
            }
        };
        fetchNoticias();
    }, [])
    return(
        <>
            <h1>noticias</h1>

            {error && <p>{error}</p>}

            {noticia.length === 0 && !error && <p>no hay noticias</p>}

            {noticia.map((noticia)=>(
                <div key={noticia.id}>
                    <h3>{noticia.titulo}</h3>
                    <p>{noticia.descripcion}</p>
                </div>
            ))}
        </>
    );
};

export default Noticias;