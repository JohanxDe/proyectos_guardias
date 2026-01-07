import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 CLAVE

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
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

        <button type="submit" className="login__button">
          Ingresar
        </button>
      </form>
    </div>
  </main>
</>
  );
};

export default Login;
