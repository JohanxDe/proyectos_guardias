import { BrowserRouter, Routes, Route  } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Trabajos from "./pages/Trabajos";
import Noticias from "./pages/Noticias";
import Login from "./pages/Login";
import CrearNoticia from "./pages/CrearNoticias";
import CrearTrabajo from "./pages/CrearTrabajos";
import Perfil from "./pages/Perfil";
import EditarTrabajo from "./pages/EditarTrabajo";
import EditarNoticia from "./pages/EditarNoticia";
import NuevoAdmin from "./pages/NuevoAdmin";
import TrabajoDetalle from "./pages/TrabajoDetalle";
import GlobalSpinner from "./components/GlobalSpinner";
import Footer from "./components/Footer";
import Terminos from "./pages/Terminos";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/adminRoute";

const App = () => {
  return(
    <BrowserRouter>

    <GlobalSpinner/>
      <Navbar/>
      

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="trabajos" element={<Trabajos/>}/>
        <Route path="/trabajo/:id" element={<TrabajoDetalle />} />
        <Route path="noticias" element={<Noticias/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="/terminos" element={<Terminos />} />


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
          path="/nuevo-admin"
          element={
            <AdminRoute>
              <NuevoAdmin />
            </AdminRoute>
          }
        />

        <Route
        path="/crear-trabajo"
        element={
          <AdminRoute>
            <CrearTrabajo/>
          </AdminRoute>
        }
        />

        <Route
        path="/editar-trabajo/:id"
        element={
          <AdminRoute>
            <EditarTrabajo/>
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

        <Route
        path="/editar-noticia/:id"
        element={
          <AdminRoute>
            <EditarNoticia/>
          </AdminRoute>
        }
        />
      </Routes>
    
    <Footer/>
    </BrowserRouter>
  )
};

export default App;