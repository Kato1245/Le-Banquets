// App.jsx - Añadimos protección de rutas y mejoras de navegación
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Eventos from "./pages/Eventos";
import Salones from "./pages/Salones";
import Catering from "./pages/Catering";
import MisEventos from "./pages/MisEventos";
import Configuracion from "./pages/Configuracion";
import Navbar from "./Components/Navbar/navbar";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  const { loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return ( 
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route 
          path="/login" 
          element={!user ? <Login/> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/registro" 
          element={!user ? <Registro/> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Perfil/>
            </ProtectedRoute>
          } 
        />
        <Route path="/eventos" element={<Eventos/>} />
        <Route path="/salones" element={<Salones/>} />
        <Route path="/catering" element={<Catering/>} />
        <Route 
          path="/mis-eventos" 
          element={
            <ProtectedRoute>
              <MisEventos/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracion" 
          element={
            <ProtectedRoute>
              <Configuracion/>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;