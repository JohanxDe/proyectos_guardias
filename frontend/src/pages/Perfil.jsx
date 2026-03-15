import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { API_ENDPOINTS } from "../config/api";
import {
  Lock,
  UserPlus,
  PlusCircle,
  TrendingUp,
  Briefcase,
  Eye,
  Pencil,
  Trash2,
  LayoutDashboard,
  Star,
} from "lucide-react";
import "../styles/perfil.css";

const Perfil = () => {
  const { usuario, token } = useAuth();
  const navigate = useNavigate();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrabajos();
  }, []);

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

  const toggleDestacado = async (id, estadoActual) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destacado: !estadoActual }),
      });

      if (response.ok) {
        setTrabajos(
          trabajos.map((t) =>
            t.id === id ? { ...t, destacado: !estadoActual } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error al actualizar destacado:", error);
    }
  };

  const totalVisitas = trabajos.reduce(
    (acc, t) => acc + (Number(t.visitas) || 0),
    0,
  );

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este trabajo?")) return;
    try {
      const response = await fetch(`${API_ENDPOINTS.TRABAJOS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setTrabajos(trabajos.filter((t) => t.id !== id));
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
            <h1 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <LayoutDashboard size={32} color="#3b82f6" /> Panel de control
            </h1>
            <p className="perfil-subtitle">
              Gestiona las publicaciones de <strong>{usuario?.nombre}</strong>
            </p>
          </div>
          <div className="perfil-actions-group">
            <button
              onClick={() => navigate("/cambiarClave")}
              className="btn-admin-config"
            >
              <Lock size={16} /> Seguridad
            </button>
            <button
              onClick={() => navigate("/nuevo-admin")}
              className="btn-admin-config"
            >
              <UserPlus size={16} /> + Admin
            </button>
            <button
              onClick={() => navigate("/crear-trabajo")}
              className="btn-add-fast"
            >
              <PlusCircle size={18} /> nuevo trabajo
            </button>
          </div>
        </header>

        <div className="perfil-stats">
          <div className="stat-card">
            <div className="stat-icon-bg">
              <Briefcase size={24} color="#3b82f6" />
            </div>
            <div>
              <span className="stat-number">{trabajos.length}</span>
              <span className="stat-label">Trabajos activos</span>
            </div>
          </div>
          <div className="stat-card stat-highlight">
            <div className="stat-icon-bg">
              <TrendingUp size={24} color="#60a5fa" />
            </div>
            <div>
              <span className="stat-number">
                {totalVisitas.toLocaleString()}
              </span>
              <span className="stat-label">Visitas acumuladas</span>
            </div>
          </div>
        </div>

        <div className="tabla-wrapper">
          <table className="perfil-tabla">
            <thead>
              <tr>
                <th>Cargo</th>
                <th className="text-center">Destacado</th> {/* Nueva columna */}
                <th>Comuna</th>
                <th>Sueldo</th>
                <th className="text-center">Visitas</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trabajos.map((trabajo) => (
                <tr
                  key={trabajo.id}
                  className={trabajo.destacado ? "row-destacada" : ""}
                >
                  <td className="td-titulo">
                    {trabajo.destacado && (
                      <Star
                        size={14}
                        fill="#ef4444"
                        color="#ef4444"
                        style={{ marginRight: "5px" }}
                      />
                    )}
                    {trabajo.titulo}
                  </td>
                  <td className="text-center">
                    {/* Switch Deslizante */}
                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        checked={trabajo.destacado || false}
                        onChange={() =>
                          toggleDestacado(trabajo.id, trabajo.destacado)
                        }
                      />
                      <span className="admin-slider"></span>
                    </label>
                  </td>
                  <td>{trabajo.ubicacion}</td>
                  <td>${trabajo.sueldo?.toLocaleString("es-CL")}</td>
                  <td className="text-center">
                    <span className="visitas-tag">
                      <Eye size={14} /> {trabajo.visitas || 0}
                    </span>
                  </td>
                  <td>
                    <div className="tabla-acciones">
                      <button
                        className="btn-action edit"
                        onClick={() =>
                          navigate(`/editar-trabajo/${trabajo.id}`)
                        }
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
