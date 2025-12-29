import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const EditarTrabajo = () =>{
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useAuth();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");

    //Cargar trabajo
    useEffect(() =>{
        const fetchTrabajos = async() => {
            try{
                const response = await fetch(
                    `http://localhost:5000/api/trabajos/${id}`
                );

                const data = await response.json();

                if (!response.ok){
                    setError(data.error || "Error al cargar el trabajo");
                    return;
                }

                setTitulo(data.titulo);
                setDescripcion(data.descripcion);
            }catch{
                setError("Error de conexion")
            }
        };

        fetchTrabajos();
    }, [id]);

    //Editar trabajo
    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{
            const response = await fetch(
                `http://localhost:5000/api/trabajos/${id}`,
                {
                    method: "PUT",
                    headers:{
                        "content-type" : "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ titulo, descripcion}),
                }
            );

            if (!response.ok){
                throw new Error();
            }
            navigate("/trabajos")
        }catch{
            setError("No se puede editar el trabajo")
        }
    };

    return(
        <>
            <h1>Editar trabajo</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Titulo"
                required
            />

                <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripcion"
                required
                />

                <button type="submit">Guardar Cambios</button>

            </form> 
        </>
    );

};

export default EditarTrabajo;
