// src/shared/components/ProtectedRoute.jsx
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Protege rutas basándose en autenticación y rol.
 *
 * Props:
 *  - children     : JSX a renderizar si el acceso está permitido
 *  - requiredRole : 'admin' | 'propietario' | undefined
 *               Si es undefined, solo requiere estar logueado.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();

    // No autenticado → redirige al login
    if (!user) return <Navigate to="/login" replace />;

    // Requiere admin y el usuario no lo es → redirige al inicio
    if (requiredRole === 'admin' && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Requiere propietario y el usuario no lo es → redirige al inicio
    if (requiredRole === 'propietario' && user.userType !== 'propietario') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
