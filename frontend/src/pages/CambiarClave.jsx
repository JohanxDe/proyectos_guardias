import { useState } from "react";
import {useNavigate} from "react-router-dom"
import useAuth from "../hooks/useAuth";


const CambiarClave = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ actual: "", nueva: "", confirmar: "" });
    const [statusMsg, setStatusMsg] = useState({ texto: "", tipo: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.nueva !== passwords.confirmar) {
            return setStatusMsg({ texto: "Las contraseñas nuevas no coinciden", tipo: "error" });
        }

        if (passwords.nueva.length < 8) {
            return setStatusMsg({ texto: "La nueva contraseña debe tener al menos 8 caracteres", tipo: "error" });
        }
        const tieneNumero = /\d/.test(passwords.nueva);
        if (!tieneNumero) {
            return setStatusMsg({ texto: "La contraseña debe incluir al menos un número", tipo: "error" });
        }

        try {
            const response = await fetch("https://proyectos-guardias.onrender.com/api/auth/cambiarClave", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    passwordActual: passwords.actual,
                    passwordNueva: passwords.nueva
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMsg({ texto: "Exito cerrando sesion...", tipo: "exito" })
                setTimeout(() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }, 2000);
            } else {
                setStatusMsg({ texto: data.error || "Error al cambiar clave", tipo: "error" })
            }
        } catch (error) {
            setStatusMsg({ texto: "Error de conexion", tipo: "Error" })
        }
    }

    return (
        <div className="clave-page-container">
            <div className="clave-card">
                <header className="clave-header">
                    <h1>Seguridad</h1>
                    <p className="perfil-subtitle">Actualiza tu contraseña de acceso</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="clave-form-group">
                        <label>Contraseña actual</label>
                        <input
                            type="password"
                            className="input-dark"
                            value={passwords.actual}
                            onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })}
                            required
                        />
                    </div>

                    <div className="clave-form-group">
                        <label>Nueva contraseña</label>
                        <input
                            type="password"
                            className="input-dark"
                            value={passwords.nueva}
                            onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
                            required
                        />
                    </div>

                    <div className="clave-form-group">
                        <label>Confirmar nueva contraseña</label>
                        <input
                            type="password"
                            className="input-dark"
                            value={passwords.confirmar}
                            onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
                            required
                        />
                    </div>

                    {statusMsg.texto && (
                        <div className={`status-alert alert-${statusMsg.tipo}`}>
                            {statusMsg.texto}
                        </div>
                    )}

                    <div className="btn-group">
                        <button type="button" onClick={() => navigate("/perfil")} className="btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-confirmar">
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CambiarClave;