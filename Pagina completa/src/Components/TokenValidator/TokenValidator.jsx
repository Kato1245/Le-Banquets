// src/components/TokenValidator/TokenValidator.jsx
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TokenValidator = () => {
  const { checkTokenValidity, user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      // Verificar token inmediatamente al montar
      const verifyOnMount = async () => {
        try {
          const isValid = await checkTokenValidity();
          if (!isValid) {
            console.log('Token invalidado al cargar. Cerrando sesión...');
            toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
            setTimeout(() => logout(), 2000); // Dar tiempo para ver el mensaje
          }
        } catch (error) {
          console.log('Error verificando token. Cerrando sesión por seguridad...');
          toast.error('Error de autenticación. Cerrando sesión...');
          setTimeout(() => logout(), 2000);
        }
      };
      verifyOnMount();

      // Verificar token periódicamente cada 30 segundos
      const interval = setInterval(async () => {
        try {
          const isValid = await checkTokenValidity();
          if (!isValid) {
            console.log('Token invalidado durante sesión. Cerrando sesión...');
            toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
            setTimeout(() => logout(), 2000);
          }
        } catch (error) {
          console.log('Error periódico verificando token. Cerrando sesión...');
          toast.error('Error de autenticación. Cerrando sesión...');
          setTimeout(() => logout(), 2000);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, checkTokenValidity, logout]);

  return null;
};

export default TokenValidator;