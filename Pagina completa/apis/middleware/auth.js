// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Lanzar error al inicio si el secreto no está definido
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno. El servidor no puede iniciar.');
}

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // jwt.verify lanza excepción si el token expiró o es inválido
        const decoded = jwt.verify(token, JWT_SECRET);

        // Verificar que el usuario aún existe y está activo en la BD
        const table = decoded.userType === 'propietario' ? 'propietarios' : 'usuarios';
        const user = await User.findById(decoded.userId, table);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (!user.esta_activo) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada. Contacte al administrador'
            });
        }

        req.user = user;
        req.userType = decoded.userType;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Sesión expirada. Por favor inicia sesión nuevamente'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        console.error('Error inesperado en autenticación:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error interno de autenticación'
        });
    }
};

module.exports = { authenticateToken, JWT_SECRET };