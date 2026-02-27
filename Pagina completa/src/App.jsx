import { Routes, Route } from 'react-router-dom';

import MainLayout from '@/shared/layouts/MainLayout';
import Home from '@/features/home/pages/Home';
import Login from '@/features/auth/pages/Login';
import Registro from '@/features/auth/pages/Registro';
import RegistroPropietario from '@/features/auth/pages/RegistroPropietario';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import BanquetesList from '@/features/banquetes/pages/BanquetesList';
import BanqueteDetail from '@/features/banquetes/pages/BanqueteDetail';
import Profile from '@/features/auth/pages/Profile';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/banquetes" element={<BanquetesList />} />
        <Route path="/banquetes/:id" element={<BanqueteDetail />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro-propietario" element={<RegistroPropietario />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;