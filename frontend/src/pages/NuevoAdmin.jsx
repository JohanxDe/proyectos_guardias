import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import "../styles/nuevoAdmin.css";

const NuevoAdmin = () => {
    const [datos, setDatos] = useState({ nombre: "", email: "", password: "" });
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.email)) {
            setMensaje({ tipo: "error", texto: "El correo no tiene un formato válido." });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.REGISTRO_ADMIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                setMensaje({ tipo: "success", texto: "Admin creado. Se ha enviado el correo de notificación." });
                setDatos({ nombre: "", email: "", password: "" });
            } else {
                setMensaje({ tipo: "error", texto: "Error al crear el administrador." });
            }
        } catch (error) {
            setMensaje({ tipo: "error", texto: "Error de conexión con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-form-card">
                <h2>Registrar Administrador</h2>
                <p className="admin-desc">Se enviará un correo automático con los accesos al nuevo usuario.</p>

                {mensaje.texto && (
                    <div className={`alerta ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={datos.nombre} 
                            onChange={handleChange} 
                            placeholder="Ej: Gonzalo Perez" 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={datos.email} 
                            onChange={handleChange} 
                            placeholder="admin@jgservice.cl" 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña Temporal</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={datos.password} 
                            onChange={handleChange} 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-admin" disabled={loading}>
                        {loading ? "Procesando..." : "Crear y Notificar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NuevoAdmin;