import { BrowserRouter, Routes, Route  } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trabajos from "./pages/Trabajos";
import Noticias from "./pages/Noticias";
import Login from "./pages/Login";
import CrearNoticia from "./pages/CrearNoticias";
import CrearTrabajo from "./pages/CrearTrabajos";
import Perfil from "./pages/Perfil";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/adminRoute";

const App = () => {
  return(
    <BrowserRouter>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="trabajos" element={<Trabajos/>}/>
        <Route path="noticias" element={<Noticias/>}/>
        <Route path="login" element={<Login/>}/>


      {/*Rutas protegidas */}
      <Route
      path="/Perfil"
      element={
        <ProtectedRoute>
          <Perfil/>
        </ProtectedRoute>
      }
      />


        {/*Solo admins */}

        <Route
        path="/crear-trabajo"
        element={
          <AdminRoute>
            <CrearTrabajo/>
          </AdminRoute>
        }
        />

        <Route
        path="/crear-noticia"
        element={
          <AdminRoute>
            <CrearNoticia/>
          </AdminRoute>
        }
        />
      </Routes>
    
    </BrowserRouter>
  )
};

export default App;