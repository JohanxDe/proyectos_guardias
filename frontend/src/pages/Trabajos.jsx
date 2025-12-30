import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";



const Trabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState("");

  const {token, usuario} =useAuth();
  const navigate =useNavigate();
    
  const {loading, setLoading} = useLoading();

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {

        setLoading(true)
        const response = await fetch("http://localhost:5000/api/trabajos");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error al obtener trabajos");
          return;
        }

        setTrabajos(data);
      } catch (err) {
        setError("Error de conexión con el servidor");
      }finally{
        setLoading(false);
      }
    };

    fetchTrabajos();
  }, []);

  const handleEliminar = async (id) =>{
    const confirmar = window.confirm("¿Eliminar este trabajo?");

    if(!confirmar) return;

    console.log("UD a Eliminar", id);
    console.log("TOKEN", token)

    try{
      const response = await fetch(
      `http://localhost:5000/api/trabajos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
      )

      if(!response.ok){
        throw new Error();
      }

      setTrabajos(trabajos.filter((t) => t.id !== id))
    }catch (err){
      alert("no se pudo eliminar el trabajo")
      console.error(err)
    }
  }

  const handleEditar = (id) =>{
    navigate(`/editar-trabajo/${id}`)
  }

  return (
    <>
      <h1>Trabajos</h1>

      {error && <p>{error}</p>}

      {trabajos.length === 0 && !error && <p>No hay trabajos</p>}

      {trabajos.map((trabajo) => (
        <div key={trabajo.id}>
          <h3>{trabajo.titulo}</h3>
          <p>{trabajo.descripcion}</p>

          {usuario?.role === "admin" && (
            <>
              <button onClick={()=> handleEditar(trabajo.id)}>
                editar
              </button>

              <button onClick={()=> handleEliminar(trabajo.id)}>
                eliminar
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default Trabajos;
