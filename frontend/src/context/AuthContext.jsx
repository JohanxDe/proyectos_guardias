import { createContext, useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const isTokenExpired = (token) => {
  try{
    const decoded = jwtDecode(token)
    //exp esta en seegundos, Date.now() en milisegundos
    return decoded.exp * 1000 < Date.now()
  }catch{
    return true
  }
}

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true)

  // Al cargar la app (refresh)
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");

    if(tokenGuardado){
      if(isTokenExpired(tokenGuardado)){
        localStorage.removeItem("token")
        setToken(null)
        setUsuario(null)
      }else{
        try{
          const decode = jwtDecode(tokenGuardado)
          setToken(tokenGuardado)
          setUsuario(decode)
        }catch{
          localStorage.removeItem("token")
          setToken(null)
          setUsuario(null)
        }
      }
    }

    setLoading(false)
  },[]);

  useEffect(() => {
    if (!token) return
    const interval = setInterval(() =>{
      if(isTokenExpired(token)){
        logout()
      }
    }, 60000)//Verifica cada minuto

    return() => clearInterval(interval)
  }, [token])
  

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
