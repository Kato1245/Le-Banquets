const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'cad8e6396223f3bd0bf9ebcd1d66b983';

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Determinar la tabla según el tipo de usuario del token
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
                message: 'Cuenta desactivada'
            });
        }

        req.user = user;
        req.userType = decoded.userType;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Token expirado'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error en autenticación'
        });
    }
};

module.exports = { authenticateToken, JWT_SECRET };