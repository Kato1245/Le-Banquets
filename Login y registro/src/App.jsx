// App.jsx
import { Route, Routes } from "react-router-dom";
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

function App() {
  const { loading } = useAuth();
  
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
        <Route path="/login" element={<Login/>} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/perfil" element={<Perfil/>} />
        <Route path="/eventos" element={<Eventos/>} />
        <Route path="/salones" element={<Salones/>} />
        <Route path="/catering" element={<Catering/>} />
        <Route path="/mis-eventos" element={<MisEventos/>} />
        <Route path="/configuracion" element={<Configuracion/>} />
      </Routes>
    </>
  );
}

export default App