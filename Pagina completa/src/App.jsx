import { Routes, Route } from 'react-router-dom';

import MainLayout from '@/shared/layouts/MainLayout';
import Home from '@/features/home/pages/Home';
import Login from '@/features/auth/pages/Login';
import Registro from '@/features/auth/pages/Registro';
import RegistroPropietario from '@/features/auth/pages/RegistroPropietario';
import BanquetesList from '@/features/banquetes/pages/BanquetesList';
import BanqueteDetail from '@/features/banquetes/pages/BanqueteDetail';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/banquetes" element={<BanquetesList />} />
        <Route path="/banquetes/:id" element={<BanqueteDetail />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro-propietario" element={<RegistroPropietario />} />
    </Routes>
  );
}

export default App;