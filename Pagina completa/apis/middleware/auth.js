// middleware/auth.js
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined in environment variables! Using fallback for development.');
}

const authenticateToken = catchAsync(async (req, res, next) => {
    // 1) Obtener el token de las cabeceras
    const authHeader = req.headers['authorization'];
    const token = authHeader && (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

    if (!token) {
        return next(new AppError('Token de acceso requerido', 401));
    }

    // 2) Verificar el token
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET || 'secret-key-fallback');
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Sesión expirada. Por favor inicia sesión nuevamente', 401));
        }
        return next(new AppError('Token inválido', 401));
    }

    // 3) Verificar que el usuario aún existe y está activo
    const authData = await UserService.findById(decoded.userId, decoded.userType);

    // findById in UserService returns the user directly or null
    // Wait, let's check UserService.findById again.
    // In Step 141: static async findById(id, userType) { ... return await User.findById(id, table); }
    const user = authData;

    if (!user) {
        return next(new AppError('El usuario perteneciente a este token ya no existe.', 401));
    }

    if (!user.esta_activo) {
        return next(new AppError('Su cuenta ha sido desactivada.', 401));
    }

    // 4) Conceder acceso
    req.user = user;
    req.userType = decoded.userType;
    req.user.role = decoded.userType; // Compatibilidad frontend

    next();
});

module.exports = { authenticateToken, JWT_SECRET };
