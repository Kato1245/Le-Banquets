// middleware/auth.js
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined in environment variables!');
}

const authenticateToken = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError('Token de acceso requerido', 401));
    }
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

    // Verificar firma del token
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET || 'fallback-secret-for-dev-only');
    } catch (err) {
        return next(new AppError('Token inválido o expirado', 401));
    }

    // Verificar que el usuario aún existe en BD
    const user = await UserService.findById(decoded.userId, decoded.userType);

    if (!user) {
        return next(new AppError('El usuario perteneciente a este token ya no existe.', 401));
    }

    if (!user.esta_activo) {
        return next(new AppError('Su cuenta ha sido desactivada.', 401));
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

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    req.user.role = decoded.userType; // Normalizar para el frontend
    req.userType = decoded.userType;
    next();
});

module.exports = { authenticateToken, JWT_SECRET };
