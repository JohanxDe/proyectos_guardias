import { useEffect, useState } from "react";

const Trabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/trabajos");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error al obtener trabajos");
          return;
        }

        setTrabajos(data);
      } catch (err) {
        setError("Error de conexión con el servidor");
      }
    };

    fetchTrabajos();
  }, []);

  return (
    <>
      <h1>Trabajos</h1>

      {error && <p>{error}</p>}

      {trabajos.length === 0 && !error && <p>No hay trabajos</p>}

      {trabajos.map((trabajo) => (
        <div key={trabajo.id}>
          <h3>{trabajo.titulo}</h3>
          <p>{trabajo.descripcion}</p>
        </div>
      ))}
    </>
  );
};

export default Trabajos;
