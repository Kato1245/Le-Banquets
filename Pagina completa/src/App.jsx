import { Routes, Route } from 'react-router-dom';

import MainLayout from '@/shared/layouts/MainLayout';
import Home from '@/features/home/pages/Home';
import Login from '@/features/auth/pages/Login';
import BanquetesList from '@/features/banquetes/pages/BanquetesList';
import BanqueteDetail from '@/features/banquetes/pages/BanqueteDetail';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/banquetes"
          element={
            <ProtectedRoute>
              <BanquetesList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/banquetes/:id"
          element={
            <ProtectedRoute>
              <BanqueteDetail />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;