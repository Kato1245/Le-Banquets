const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined in environment variables! Auth middleware might fail.');
}

// Global authentication middleware
const authenticateToken = catchAsync(async (req, res, next) => {
    // 1) Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

    if (!token) {
        return next(new AppError('Token de acceso requerido. Por favor, inicie sesión.', 401));
    }

    // 2) Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET || 'dev-secret-only');
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 401));
        }
        return next(new AppError('Token inválido. Por favor, inicie sesión nuevamente.', 401));
    }

    // 3) Check if user still exists
    const result = await UserService.findById(decoded.userId, decoded.userType);
    if (!result) {
        return next(new AppError('El usuario ya no existe.', 401));
    }

    // 4) Check if user is active
    if (!result.esta_activo) {
        return next(new AppError('Esta cuenta ha sido desactivada.', 401));
    }

    // 5) Grant access
    req.user = result;
    req.userType = decoded.userType;
    next();
});

module.exports = { authenticateToken, JWT_SECRET };
