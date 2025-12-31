import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import TrabajoForm from "../components/trabajoForm";


const EditarTrabajo = () =>{
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useAuth();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState("");

    //Cargar trabajo
useEffect(() => {
  const fetchTrabajos = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trabajos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al cargar el trabajo");
        return;
      }

      setTitulo(data.titulo);
      setDescripcion(data.descripcion);
    } catch {
      setError("Error de conexión");
    }
  };

  fetchTrabajos();
}, [id, token]);


    //Editar trabajo
    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{
            const response = await fetch(
                `http://localhost:5000/api/trabajos/${id}`,
                {
                    method: "PUT",
                    headers:{
                        "Content-type" : "application/json",
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

           <TrabajoForm
           titulo={titulo}
           setTitulo={setTitulo}
           descripcion={descripcion}
           setDescripcion={setDescripcion}
           onsubmit={handleSubmit}
           textoBoton="Guardar cambios"
           error={error}
           /> 
        </>
    );

};

export default EditarTrabajo;
