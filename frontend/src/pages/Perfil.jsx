import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { API_ENDPOINTS } from "../config/api";
import "../styles/perfil.css";

const Perfil = () => {
    const { usuario, token } = useAuth();
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el cambio de clave
    const [passwords, setPasswords] = useState({ actual: "", nueva: "", confirmar: "" });
    const [statusMsg, setStatusMsg] = useState({ texto: "", tipo: "" });

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

    // ✅ NUEVA LÓGICA: Enviar cambio de clave
    const handleCambiarClave = async (e) => {
        e.preventDefault();
        if (passwords.nueva !== passwords.confirmar) {
            return setStatusMsg({ texto: "Las nuevas contraseñas no coinciden", tipo: "error" });
        }

        try {
            const response = await fetch("https://proyectos-guardias.onrender.com/api/auth/cambiarClave", {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    passwordActual: passwords.actual,
                    passwordNueva: passwords.nueva
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMsg({ texto: "✅ Contraseña actualizada. Cerrando sesión...", tipo: "exito" });
                setPasswords({ actual: "", nueva: "", confirmar: "" });

                // 🚪 LÓGICA DE CIERRE DE SESIÓN
                setTimeout(() => {
                    localStorage.removeItem("token"); // O la función de logout que tengas en tu hook useAuth
                    // Si tu useAuth tiene una función logout, úsala: logout();
                    window.location.href = "/login"; // Redirección forzada para limpiar estados
                }, 2500); // 2.5 segundos para que alcance a leer el mensaje de éxito

            } else {
                setStatusMsg({ texto: data.error || "Error al cambiar clave", tipo: "error" });
            }
        } catch (error) {
            setStatusMsg({ texto: "Error de conexión con el servidor", tipo: "error" });
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
                                        <span className="visitas-tag">👁️ {trabajo.visitas || 0}</span>
                                    </td>
                                    <td>
                                        <div className="tabla-acciones">
                                            <button className="btn-action edit" onClick={() => navigate(`/editar-trabajo/${trabajo.id}`)}>✏️</button>
                                            <button className="btn-action delete" onClick={() => handleEliminar(trabajo.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- ✅ SECCIÓN DE SEGURIDAD AL FINAL --- */}
                <div className="perfil-security-section" style={{ marginTop: '40px', borderTop: '1px solid #334155', paddingTop: '30px' }}>
                    <h2 style={{ marginBottom: '20px', color: '#3b82f6' }}>🔒 Seguridad de la cuenta</h2>
                    
                    <form onSubmit={handleCambiarClave} className="form-cambio-clave" style={{ maxWidth: '400px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Contraseña actual</label>
                            <input 
                                type="password" 
                                className="input-form" // Usa las clases que ya tienes en crear-trabajo
                                value={passwords.actual}
                                onChange={(e) => setPasswords({...passwords, actual: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Nueva contraseña</label>
                            <input 
                                type="password" 
                                className="input-form"
                                value={passwords.nueva}
                                onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Confirmar nueva contraseña</label>
                            <input 
                                type="password" 
                                className="input-form"
                                value={passwords.confirmar}
                                onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }}
                            />
                        </div>

                        {statusMsg.texto && (
                            <div style={{ 
                                padding: '10px', 
                                borderRadius: '5px', 
                                marginBottom: '15px', 
                                fontSize: '0.85rem',
                                backgroundColor: statusMsg.tipo === 'error' ? '#ef444422' : '#22c55e22',
                                color: statusMsg.tipo === 'error' ? '#f87171' : '#4ade80',
                                border: `1px solid ${statusMsg.tipo === 'error' ? '#ef4444' : '#22c55e'}`
                            }}>
                                {statusMsg.texto}
                            </div>
                        )}

                        <button type="submit" className="btn-add-fast" style={{ width: '100%' }}>
                            Actualizar contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Perfil;