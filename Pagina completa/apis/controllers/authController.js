const bcrypt = require('bcryptjs');
const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Almacena intentos por IP (en memoria)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutos en milisegundos

// Función para generar auth_id
const generateAuthId = () => {
    return 'auth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Función para obtener IP del cliente
const getClientIP = (req) => {
    return req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        'unknown-ip';
};

class AuthController {
    static register = catchAsync(async (req, res, next) => {
        const isPropietario = req.originalUrl.includes('/register/propietario');
        const userType = isPropietario ? 'propietario' : 'usuario';
        const { nombre, email, contrasena, documento, telefono, fecha_nacimiento, rut } = req.body;

        // Verificar si el usuario ya existe
        const existingData = await UserService.findByEmail(email);

        if (existingData) {
            return next(new AppError('El usuario ya existe con este email', 409));
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Crear usuario
        const userData = {
            nombre,
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
        const userId = result.insertId;

        // Generar token para login automático tras registro
        const token = jwt.sign(
            { userId: userId, email: email, userType: userType },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: `${userType === 'propietario' ? 'Propietario' : 'Usuario'} registrado exitosamente`,
            data: {
                user: {
                    id: userId,
                    nombre,
                    email,
                    role: userType,
                    userType: userType
                },
                token: token
            }
        });
    });

    static login = catchAsync(async (req, res, next) => {
        const { email, contrasena } = req.body;
        const clientIP = getClientIP(req);
        const attemptKey = `login_attempts_${clientIP}`;

        // Verificar intentos previos
        const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lockUntil: null };

        // Si está bloqueado por IP
        if (currentAttempts.lockUntil && Date.now() < currentAttempts.lockUntil) {
            const remainingTime = Math.ceil((currentAttempts.lockUntil - Date.now()) / 1000 / 60);
            return next(new AppError(`Demasiados intentos fallidos. Espere ${remainingTime} minutos antes de intentar nuevamente.`, 429));
        }

        // Validar campos requeridos
        if (!email || !contrasena) {
            return next(new AppError('Email y contraseña son requeridos', 400));
        }

        const authData = await UserService.findByEmail(email);

        // Si no se encuentra usuario
        if (!authData) {
            return this.handleFailedAttempt(attemptKey, currentAttempts, next);
        }

        const { user, userType } = authData;

        // Verificar si está activo
        if (!user.esta_activo) {
            return next(new AppError('Cuenta desactivada. Contacte al administrador', 401));
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

        if (!isPasswordValid) {
            return this.handleFailedAttempt(attemptKey, currentAttempts, next);
        }

        // Login exitoso - resetear intentos para esta IP
        if (loginAttempts.has(attemptKey)) {
            loginAttempts.delete(attemptKey);
        }

        // Crear token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, userType: userType },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Eliminar contraseña de la respuesta
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.contrasena;

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    ...userWithoutPassword,
                    role: userType, // Para ProtectedRoute
                    userType: userType // Para compatibilidad
                },
                userType: userType,
                token: token,
                expiresIn: '24h'
            }
        });
    });

    static handleFailedAttempt(key, currentAttempts, next) {
        const newCount = currentAttempts.count + 1;
        let lockUntil = null;

        if (newCount >= MAX_ATTEMPTS) {
            lockUntil = Date.now() + LOCK_TIME;
        }

        loginAttempts.set(key, { count: newCount, lockUntil: lockUntil });
        return next(new AppError('Credenciales inválidas', 401));
    }

    static getProfile = catchAsync(async (req, res, next) => {
        const user = req.user;
        const userType = req.userType;

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.contrasena;

        res.json({
            success: true,
            message: 'Perfil obtenido exitosamente',
            data: {
                user: userWithoutPassword,
                userType: userType
            }
        });
    });

    static updateProfile = catchAsync(async (req, res, next) => {
        const userId = req.user?.id;
        const userType = req.userType;
        if (!userId) {
            return next(new AppError("Usuario no encontrado en el token", 400));
        }

        const { username, email, telefono } = req.body;
        const currentEmail = req.user.email;

        // Si intenta cambiar el email, verificar que no exista ya
        if (email && email !== currentEmail) {
            const existingUser = await UserService.findByEmail(email);
            if (existingUser) {
                return next(new AppError("El email ya está en uso por otra cuenta", 409));
            }
        }

        const fieldsToUpdate = {};
        if (username !== undefined) fieldsToUpdate.nombre = username;
        if (email !== undefined) fieldsToUpdate.email = email;
        if (telefono !== undefined) fieldsToUpdate.telefono = telefono;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return next(new AppError("No se recibieron campos para actualizar", 400));
        }

        const result = await UserService.updateUser(userId, fieldsToUpdate, userType);

        if (result.affectedRows === 0) {
            return next(new AppError("No se realizaron cambios o el usuario no existe", 400));
        }

        const updatedUser = await UserService.findById(userId, userType);
        if (updatedUser) delete updatedUser.contrasena;

        res.json({
            success: true,
            message: "Perfil actualizado correctamente",
            data: updatedUser
        });
    });

    static forgotPassword = catchAsync(async (req, res, next) => {
        const { email } = req.body;
        if (!email) return next(new AppError('El email es requerido', 400));

        const authData = await UserService.findByEmail(email);
        if (!authData) {
            return res.json({
                success: true,
                message: 'Si el correo existe, se ha enviado un enlace de recuperación'
            });
        }

        const { user, userType } = authData;

        const resetToken = jwt.sign(
            { userId: user.id, email: user.email, userType: userType, purpose: 'reset-password' },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        console.log(`[RESET PASSWORD] Token para ${email}: ${resetToken}`);

        res.json({
            success: true,
            message: 'Si el correo existe, se ha enviado un enlace de recuperación',
            token: resetToken
        });
    });

    static resetPassword = catchAsync(async (req, res, next) => {
        const { token, nuevaContrasena } = req.body;

        if (!token || !nuevaContrasena) {
            return next(new AppError('Token y nueva contraseña son requeridos', 400));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.purpose !== 'reset-password') {
                return next(new AppError('Token inválido para esta operación', 400));
            }

            const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
            await UserService.updateUser(decoded.userId, { contrasena: hashedPassword }, decoded.userType);

            res.json({
                success: true,
                message: 'Contraseña actualizada correctamente'
            });
        } catch (err) {
            return next(new AppError('El enlace de recuperación ha expirado o es inválido', 400));
        }
    });
}

module.exports = AuthController;
