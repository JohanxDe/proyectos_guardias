import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { API_ENDPOINTS } from "../config/api";
// Importamos la artillería de iconos para el panel
import { 
  Lock, 
  UserPlus, 
  PlusCircle, 
  TrendingUp, 
  Briefcase, 
  Eye, 
  Pencil, 
  Trash2,
  LayoutDashboard
} from "lucide-react";
import "../styles/perfil.css";

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
                setTrabajos(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrabajos();
    }, []);

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
            alert("No se pudo eliminar");
        }
    };

    return (
        <div className="perfil-page">
            <div className="perfil-container">
                <header className="perfil-header">
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <LayoutDashboard size={32} color="#3b82f6" /> Panel de control
                        </h1>
                        <p className="perfil-subtitle">Gestiona las publicaciones de <strong>{usuario?.nombre}</strong></p>
                    </div>
                    <div className="perfil-actions-group">
                        <button onClick={() => navigate("/cambiarClave")} className="btn-admin-config">
                            <Lock size={16} /> Seguridad
                        </button>
                        <button onClick={() => navigate("/nuevo-admin")} className="btn-admin-config">
                            <UserPlus size={16} /> + Admin
                        </button>
                        <button onClick={() => navigate("/crear-trabajo")} className="btn-add-fast">
                            <PlusCircle size={18} /> nuevo trabajo
                        </button>
                    </div>
                </header>

                <div className="perfil-stats">
                    <div className="stat-card">
                        <div className="stat-icon-bg"><Briefcase size={24} color="#3b82f6" /></div>
                        <div>
                            <span className="stat-number">{trabajos.length}</span>
                            <span className="stat-label">Trabajos activos</span>
                        </div>
                    </div>
                    <div className="stat-card stat-highlight">
                        <div className="stat-icon-bg"><TrendingUp size={24} color="#60a5fa" /></div>
                        <div>
                            <span className="stat-number">{totalVisitas.toLocaleString()}</span>
                            <span className="stat-label">Visitas acumuladas</span>
                        </div>
                    </div>
                </div>

                <div className="tabla-wrapper">
                    <table className="perfil-tabla">
                        <thead>
                            <tr>
                                <th>Cargo</th>
                                <th>Comuna</th>
                                <th>Sueldo</th>
                                <th className="text-center">Visitas</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trabajos.map(trabajo => (
                                <tr key={trabajo.id}>
                                    <td className="td-titulo">{trabajo.titulo}</td>
                                    <td>{trabajo.ubicacion}</td>
                                    <td>${trabajo.sueldo?.toLocaleString('es-CL')}</td>
                                    <td className="text-center">
                                        <span className="visitas-tag">
                                            <Eye size={14} /> {trabajo.visitas || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="tabla-acciones">
                                            <button 
                                                className="btn-action edit" 
                                                onClick={() => navigate(`/editar-trabajo/${trabajo.id}`)}
                                                title="Editar"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                className="btn-action delete" 
                                                onClick={() => handleEliminar(trabajo.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
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