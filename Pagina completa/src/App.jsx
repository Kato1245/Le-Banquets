// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // ← Añade esta importación
import Home from "./features/home/pages/Home";
import Login from "./features/auth/pages/Login";
import Registro from "./features/auth/pages/Registro";
import RegistroPropietario from "./features/auth/pages/RegistroPropietario";
import Perfil from "./features/perfil/pages/Perfil";
import Eventos from "./features/perfil/pages/Eventos";
import Salones from "./features/banquetes/pages/Salones";
import Catering from "./features/banquetes/pages/Catering";
import MisEventos from "./features/perfil/pages/MisEventos";
import MisBanquetes from "./features/banquetes/pages/MisBanquetes";
import Configuracion from "./features/admin/pages/Configuracion";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Navbar from "./shared/components/Navbar";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import TokenValidator from "./shared/components/TokenValidator";

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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <TokenValidator />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/registro"
          element={!user ? <Registro /> : <Navigate to="/" replace />}
        />
        <Route
          path="/registro-propietario"
          element={!user ? <RegistroPropietario /> : <Navigate to="/" replace />}
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/salones" element={<Salones />} />
        <Route path="/catering" element={<Catering />} />
        <Route
          path="/mis-eventos"
          element={
            <ProtectedRoute>
              <MisEventos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-banquetes"
          element={
            <ProtectedRoute>
              <MisBanquetes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;