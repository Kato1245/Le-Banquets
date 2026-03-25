// src/App.jsx
import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Core Components (Non-lazy)
import Navbar from "./shared/components/Navbar";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import TokenValidator from "./shared/components/TokenValidator";
import { useAuth } from "./context/AuthContext";

// Lazy Loaded Pages
const Home = lazy(() => import("./features/home/pages/Home"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const Registro = lazy(() => import("./features/auth/pages/Registro"));
const RegistroPropietario = lazy(() => import("./features/auth/pages/RegistroPropietario"));
const Banquetes = lazy(() => import("./features/banquetes/pages/Salones"));
const BanqueteDetail = lazy(() => import("./features/banquetes/pages/BanqueteDetail"));
const MisEventos = lazy(() => import("./features/eventos/pages/MisEventos"));
const Eventos = lazy(() => import("./features/eventos/pages/Eventos"));
const MisBanquetes = lazy(() => import("./features/banquetes/pages/MisBanquetes"));
const Configuracion = lazy(() => import("./features/admin/pages/Configuracion"));
const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard"));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword"));

import ClinkingGlasses from "./shared/components/ClinkingGlasses";

// Loading Component for Suspense
const PageLoader = () => (
  <div className="min-h-[40vh] flex flex-col items-center justify-center opacity-80">
    <ClinkingGlasses size="md" />
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 mt-4 animate-pulse">
      Le Banquets
    </p>
  </div>
);

function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-6">
        <ClinkingGlasses size="lg" />
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-black tracking-tighter text-primary">Le Banquets</h2>
          <span className="loading loading-dots loading-xs text-primary/30"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e1e2e",
            color: "#cdd6f4",
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "1rem",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          },
          success: {
            duration: 3000,
            iconTheme: { primary: "#a6e3a1", secondary: "#1e1e2e" },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: "#f38ba8", secondary: "#1e1e2e" },
          },
        }}
      />
      <TokenValidator />
      <Navbar />

      <Suspense fallback={<PageLoader />}>
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
          <Route path="/banquetes/:id" element={<BanqueteDetail />} />
          <Route path="/eventos" element={<Eventos />} />

          {/* Rutas protegidas — requieren login */}

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
      </Suspense>
    </>
  );
}

export default App;