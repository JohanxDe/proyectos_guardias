import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { API_ENDPOINTS } from "../config/api"
import "../styles/perfil.css"

const Perfil  = () => {

    const {usuario, token} = useAuth();
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchTrabajos = async() =>{
            try{
                const response = await fetch(API_ENDPOINTS.TRABAJOS);
                const data = await response.json();
                setTrabajos(data)
            }catch(error){
                console.error("Error:",error);
            }finally{
                setLoading(false)
            }
        };
        fetchTrabajos();
    }, []);

    const handleEliminar= async(id) => {
        if(!window.confirm("¿Seguro que quieres eliminar este trabajo?")) return;

        try{
            const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`,{
                method: "DELETE",
                headers: {Authorization: `Bearer${token}`}
            });
            if(response.ok){
                setTrabajos(trabajos.filter(t => t.id !==id));
            }
        }catch(error){
            alert("No se pudo eliminar")
        }
    };

    return(
        <div className="perfil-page">
            <div className="perfil-container">
                <header className="perfil-header">
                    <div>
                        <h1>Panel de control</h1>
                        <p className="perfil-subtitle">Gestiona las publicaciones de <strong>{usuario?.nombre}</strong></p>
                    </div>
                    {/*Boton de acceso rapido*/}
                    <button onClick={() => navigate("/publicar")} className="btn-add-fast">
                        + nuevo trabajo
                    </button>
                </header>
                <div className="perfil-stats">
                    <div className="stat-card">
                        <span className="stat-number">{trabajos.length}</span>
                        <span className="stat-label">Trabajos activos</span>
                    </div>
                </div>
                <div className="tabla-wrapper">
                    <table className="perfil-tabla">
                        <thead>
                            <tr>
                                <th>Cargo</th>
                                <th>Comuna</th>
                                <th>Sueldo</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trabajos.map(trabajo =>(
                                <tr key={trabajo.id}>
                                    <td className="td-titulo">{trabajo.titulo}</td>
                                    <td>{trabajo.ubicacion}</td>
                                    <td>${trabajo.sueldo?.toLocaleString('es-CL')}</td>
                                    <td>
                                        <div className="tabla-acciones">
                                            <button
                                            className="btn-action edit"
                                            onClick={()=>navigate(`/editar-trabajo/${trabajo.id}`)}
                                            title="editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                            className="btn-action delete"
                                            onClick={()=>handleEliminar(trabajo.id)}
                                            title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Perfil;