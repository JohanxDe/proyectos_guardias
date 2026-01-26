import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {API_ENDPOINTS} from "../config/api"
import "../styles/login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      login(data.token); // ✅ ACTUALIZA CONTEXTO + NAVBAR
      navigate("/trabajos");

    } catch (error) {
      setError("Error de conexión con el servidor");
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
  <main className="login">
    <div className="login__card">
      <h1>Login</h1>

      {error && <p className="login__error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="login__field">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login__field">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPasword(e.target.value)}
          />
        </div>

        <button type="submit" className="login__button" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  </main>
</>
  );
};

export default Login;
