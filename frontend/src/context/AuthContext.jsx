import { createContext, useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true)

  // Al cargar la app (refresh)
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");

    if(tokenGuardado){
      try{
        const decode = jwtDecode(tokenGuardado)
        setUsuario(decode)
      }catch{
        localStorage.removeItem("token")
        setToken(null)
      }
    }

    setLoading(false)
  },[]);

   // if (tokenGuardado) {
     // setToken(tokenGuardado);

      //const decoded = jwtDecode(tokenGuardado);
      //setUsuario(decoded);
    //}
  //}, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);

    const decoded = jwtDecode(token);
    setUsuario(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
