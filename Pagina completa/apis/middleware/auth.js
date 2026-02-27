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
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    req.user.role = decoded.userType; // Normalizar para el frontend
    req.userType = decoded.userType;
    next();
});

module.exports = { authenticateToken, JWT_SECRET };
