const bcrypt = require('bcryptjs');
const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Registro de intentos fallidos por IP (en memoria)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutos

// Función para generar auth_id
const generateAuthId = () => {
    return 'auth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Función para obtener IP del cliente
const getClientIP = (req) => {
    return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        'unknown';
};

class AuthController {
    static register = catchAsync(async (req, res, next) => {
        const isPropietario = req.originalUrl.includes('/register/propietario');
        const userType = isPropietario ? 'propietario' : 'usuario';
        const { nombre, email, contrasena, documento, telefono, fecha_nacimiento, rut } = req.body;

        // Verificar si el usuario ya existe
        const existingData = await UserService.findByEmail(email);
        if (existingData) {
            return next(new AppError('Ya existe una cuenta con este email', 409));
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 12);

        // Preparar datos del usuario
        const userData = {
            nombre: nombre.trim(),
            email,
            contrasena: hashedPassword,
            documento: documento || null,
            telefono: telefono || null,
            fecha_nacimiento: fecha_nacimiento || null,
            auth_id: generateAuthId(),
            esta_activo: true,
            esta_verificado: false
        };

        if (userType === 'propietario') {
            userData.rut = rut || null;
        }

        const result = await UserService.createUser(userData, userType);

        res.status(201).json({
            success: true,
            message: `${isPropietario ? 'Propietario' : 'Usuario'} registrado exitosamente`,
            data: {
                id: result.insertId,
                nombre,
                email
            }
        });
    });

    static login = catchAsync(async (req, res, next) => {
        const { email, contrasena } = req.body;
        const clientIP = getClientIP(req);
        const attemptKey = `login_${clientIP}`;

        // Verificar bloqueo por IP
        const current = loginAttempts.get(attemptKey) || { count: 0, lockUntil: null };
        if (current.lockUntil && Date.now() < current.lockUntil) {
            const remainingMin = Math.ceil((current.lockUntil - Date.now()) / 60000);
            return next(new AppError(`Demasiados intentos fallidos. Espere ${remainingMin} minuto(s) antes de intentar nuevamente.`, 429));
        }

        if (!email || !contrasena) {
            return next(new AppError('Email y contraseña son requeridos', 400));
        }

        const authData = await UserService.findByEmail(email);

        if (!authData) {
            return this.handleFailedAttempt(attemptKey, current, next);
        }

        const { user, userType } = authData;

        // Verificar estado de la cuenta
        if (!user.esta_activo) {
            return next(new AppError('Cuenta desactivada. Contacte al administrador', 401));
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isPasswordValid) {
            return this.handleFailedAttempt(attemptKey, current, next);
        }

        // Login exitoso — resetear intentos
        loginAttempts.delete(attemptKey);

        // Crear JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, userType },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { contrasena: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    ...userWithoutPassword,
                    role: userType // Compatibilidad con el frontend
                },
                userType,
                token,
                expiresIn: '24h'
            }
        });
    });

    static getProfile = catchAsync(async (req, res, next) => {
        // req.user y req.userType vienen del middleware de autenticación
        const { contrasena: _, ...userWithoutPassword } = req.user;

        res.json({
            success: true,
            message: 'Perfil obtenido exitosamente',
            data: {
                user: userWithoutPassword,
                userType: req.userType
            }
        });
    });

    static updateProfile = catchAsync(async (req, res, next) => {
        const userId = req.user?.id;
        const userType = req.userType;

        if (!userId) {
            return next(new AppError('Usuario no identificado', 400));
        }

        const { nombre, email, telefono } = req.body;
        const fieldsToUpdate = {};

        if (nombre !== undefined) fieldsToUpdate.nombre = nombre.trim();
        if (email !== undefined) fieldsToUpdate.email = email;
        if (telefono !== undefined) fieldsToUpdate.telefono = telefono;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return next(new AppError('No se recibieron campos para actualizar', 400));
        }

        const result = await UserService.updateUser(userId, fieldsToUpdate, userType);

        if (result.affectedRows === 0) {
            return next(new AppError('No se realizaron cambios o el usuario no existe', 404));
        }

        const updatedUser = await UserService.findById(userId, userType);
        if (updatedUser) delete updatedUser.contrasena;

        res.json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: updatedUser
        });
    });

    static handleFailedAttempt(key, current, next) {
        const newCount = current.count + 1;
        const lockUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCK_TIME : null;
        loginAttempts.set(key, { count: newCount, lockUntil });

        return next(new AppError('Credenciales inválidas', 401));
    }
}

module.exports = AuthController;
