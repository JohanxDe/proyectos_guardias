import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { API_ENDPOINTS } from "../config/api"
import "../styles/perfil.css"

const Perfil = () => {
    const { usuario, token } = useAuth();
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrabajos = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.TRABAJOS);
                const data = await response.json();
                setTrabajos(data)
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchTrabajos();
    }, []);

    // ✅ LÓGICA: Calculamos el total de visitas de todas las publicaciones
    const totalVisitas = trabajos.reduce((acc, t) => acc + (Number(t.visitas) || 0), 0);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este trabajo?")) return;

        try {
            const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setTrabajos(trabajos.filter(t => t.id !== id));
            }
        } catch (error) {
            alert("No se pudo eliminar")
        }
    };

    return (
        <div className="perfil-page">
            <div className="perfil-container">
                <header className="perfil-header">
                    <div>
                        <h1>Panel de control</h1>
                        <p className="perfil-subtitle">Gestiona las publicaciones de <strong>{usuario?.nombre}</strong></p>
                    </div>
                    <div className="perfil-actions-group">
                        <button onClick={() => navigate("/nuevo-admin")} className="btn-admin-config">
                            👤 + Admin
                        </button>
                        <button onClick={() => navigate("/crear-trabajo")} className="btn-add-fast">
                            + nuevo trabajo
                        </button>
                    </div>
                </header>

                <div className="perfil-stats">
                    <div className="stat-card">
                        <span className="stat-number">{trabajos.length}</span>
                        <span className="stat-label">Trabajos activos</span>
                    </div>
                    
                    {/* ✅ NUEVA TARJETA: Visitas Totales */}
                    <div className="stat-card stat-highlight">
                        <span className="stat-number">📈 {totalVisitas.toLocaleString()}</span>
                        <span className="stat-label">Visitas acumuladas</span>
                    </div>
                </div>

                <div className="tabla-wrapper">
                    <table className="perfil-tabla">
                        <thead>
                            <tr>
                                <th>Cargo</th>
                                <th>Comuna</th>
                                <th>Sueldo</th>
                                <th className="text-center">Visitas</th> {/* ✅ NUEVA COLUMNA */}
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trabajos.map(trabajo => (
                                <tr key={trabajo.id}>
                                    <td className="td-titulo">{trabajo.titulo}</td>
                                    <td>{trabajo.ubicacion}</td>
                                    <td>${trabajo.sueldo?.toLocaleString('es-CL')}</td>
                                    
                                    {/* ✅ CELDA DE VISITAS POR TRABAJO */}
                                    <td className="text-center">
                                        <span className="visitas-tag">
                                            👁️ {trabajo.visitas || 0}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="tabla-acciones">
                                            <button
                                                className="btn-action edit"
                                                onClick={() => navigate(`/editar-trabajo/${trabajo.id}`)}
                                                title="editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-action delete"
                                                onClick={() => handleEliminar(trabajo.id)}
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