// src/shared/components/TokenValidator.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutos (antes 30s — innecesariamente agresivo)

const TokenValidator = () => {
    const { checkTokenValidity, user, logout } = useAuth();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        if (!user) return;

        const handleInvalidToken = () => {
            if (!isMounted.current) return; // Evitar race condition post-desmonte
            toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
            setTimeout(() => {
                if (isMounted.current) logout();
            }, 1500);
        };

        // Verificar token al montar
        checkTokenValidity().then(isValid => {
            if (!isValid && isMounted.current) handleInvalidToken();
        }).catch(() => {
            // Si el servidor no responde no cerramos sesión automáticamente
            // (puede ser un error de red temporal)
        });

        // Verificar cada 5 minutos
        const interval = setInterval(async () => {
            try {
                const isValid = await checkTokenValidity();
                if (!isValid) handleInvalidToken();
            } catch {
                // Error de red temporal — no deslogear
            }
        }, INTERVAL_MS);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, [user, checkTokenValidity, logout]);

    return null;
};

export default TokenValidator;
