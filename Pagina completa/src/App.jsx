import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Layouts y Shared
import Navbar from "./shared/components/Navbar";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import TokenValidator from "./shared/components/TokenValidator";

// Context
import { useAuth } from "./context/AuthContext";

// Features - Auth
import Login from "./features/auth/pages/Login";
import Registro from "./features/auth/pages/Registro";
import RegistroPropietario from "./features/auth/pages/RegistroPropietario";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";

// Features - Home
import Home from "./features/home/pages/Home";

// Features - Banquetes
import Banquetes from "./features/banquetes/pages/Salones";
import MisBanquetes from "./features/banquetes/pages/MisBanquetes";

// Features - Perfil
import Perfil from "./features/perfil/pages/Perfil";
import MisEventos from "./features/perfil/pages/MisEventos";

// Features - Admin
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import Configuracion from "./features/admin/pages/Configuracion";

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
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <TokenValidator />
      <Navbar />

      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Rutas de autenticación — solo accesibles sin sesión */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/registro" element={!user ? <Registro /> : <Navigate to="/" replace />} />
        <Route path="/registro-propietario" element={!user ? <RegistroPropietario /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas públicas */}
        <Route path="/banquetes" element={<Banquetes />} />

        {/* Rutas protegidas — requieren login */}
        <Route path="/perfil" element={
          <ProtectedRoute><Perfil /></ProtectedRoute>
        } />
        <Route path="/mis-eventos" element={
          <ProtectedRoute><MisEventos /></ProtectedRoute>
        } />
        <Route path="/configuracion" element={
          <ProtectedRoute><Configuracion /></ProtectedRoute>
        } />

        {/* Ruta exclusiva para propietarios */}
        <Route path="/mis-banquetes" element={
          <ProtectedRoute requiredRole="propietario"><MisBanquetes /></ProtectedRoute>
        } />

        {/* Ruta exclusiva para administradores */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
        } />

        {/* Cualquier ruta no definida → inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;