import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { API_ENDPOINTS } from "../config/api";
import "../styles/trabajos.css"



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
        const response = await fetch(API_ENDPOINTS.TRABAJOS);

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
      `${API_ENDPOINTS.TRABAJOS}/${id}`,
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
  <main className="trabajos">
    <h1 className="trabajos__title">Trabajos</h1>

    {error && <p className="trabajos__error">{error}</p>}

    {trabajos.length === 0 && !error && (
      <p className="trabajos__empty">No hay trabajos</p>
    )}

    <section className="trabajos__grid">
      {trabajos.map((trabajo) => (
        <article className="trabajo-card" key={trabajo.id}>
          <div className="trabajo-card__content">
            <h3>{trabajo.titulo}</h3>
            <p>{trabajo.descripcion}</p>
          </div>

          {usuario?.role === "admin" && (
            <div className="trabajo-card__actions">
              <button
                className="btn btn--edit"
                onClick={() => handleEditar(trabajo.id)}
              >
                Editar
              </button>

              <button
                className="btn btn--delete"
                onClick={() => handleEliminar(trabajo.id)}
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

export default Trabajos;
