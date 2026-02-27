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

// Función para generar auth_id único
const generateAuthId = () =>
    'auth_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);

// Obtener IP del cliente de forma segura
const getClientIP = (req) =>
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

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

        // Crear usuario en la base de datos
        const result = await UserService.createUser(userData, userType);
        const userId = result.insertId;

        // Generar token para login automático
        const token = jwt.sign(
            { userId, email, userType },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: `${isPropietario ? 'Propietario' : 'Usuario'} registrado exitosamente`,
            data: {
                user: {
                    id: userId,
                    nombre: userData.nombre,
                    email,
                    userType
                },
                token
            }
        });
    });

    static login = catchAsync(async (req, res, next) => {
        const { email, contrasena } = req.body;
        const clientIP = getClientIP(req);
        const attemptKey = `login_${clientIP}`;

        const current = loginAttempts.get(attemptKey) || { count: 0, lockUntil: null };

        // Verificar bloqueo por IP
        if (current.lockUntil && Date.now() < current.lockUntil) {
            const remainingMin = Math.ceil((current.lockUntil - Date.now()) / 60000);
            return next(new AppError(`Demasiados intentos fallidos. Espere ${remainingMin} minuto(s) antes de intentar nuevamente.`, 429));
        }

        // Buscar usuario
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

        const { contrasena: _, ...safeUser } = user;

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: { ...safeUser, userType },
                userType,
                token,
                expiresIn: '24h'
            }
        });
    });

    static handleFailedAttempt(key, current, next) {
        const newCount = current.count + 1;
        const locked = newCount >= MAX_ATTEMPTS;
        const lockUntil = locked ? Date.now() + LOCK_TIME : null;

        loginAttempts.set(key, { count: newCount, lockUntil });

        return next(new AppError('Credenciales inválidas', 401));
    }

    static getProfile = catchAsync(async (req, res, next) => {
        const { contrasena: _, ...safeUser } = req.user;
        res.json({
            success: true,
            message: 'Perfil obtenido exitosamente',
            data: {
                user: { ...safeUser, userType: req.userType },
                userType: req.userType
            }
        });
    });

    static updateProfile = catchAsync(async (req, res, next) => {
        const userId = req.user?.id;
        const userType = req.userType;
        const { nombre, email, telefono } = req.body;

        if (!userId) return next(new AppError('Usuario no identificado', 400));

        const fieldsToUpdate = {};
        if (nombre !== undefined) fieldsToUpdate.nombre = nombre.trim();
        if (email !== undefined) fieldsToUpdate.email = email;
        if (telefono !== undefined) fieldsToUpdate.telefono = telefono;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return next(new AppError('No se recibieron campos para actualizar', 400));
        }

        // Si cambia el email, verificar duplicados
        if (email && email !== req.user.email) {
            const existing = await UserService.findByEmail(email);
            if (existing) return next(new AppError('El email ya está en uso', 409));
        }

        const result = await UserService.updateUser(userId, fieldsToUpdate, userType);
        if (result.affectedRows === 0) {
            return next(new AppError('No se realizaron cambios', 400));
        }

        const updatedUser = await UserService.findById(userId, userType);
        const { contrasena: _, ...safeUser } = updatedUser;

        res.json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: { ...safeUser, userType }
        });
    });

    static forgotPassword = catchAsync(async (req, res, next) => {
        const { email } = req.body;
        if (!email) return next(new AppError('El email es requerido', 400));

        const authData = await UserService.findByEmail(email);
        if (!authData) {
            // Por seguridad, no revelar si el email existe
            return res.json({
                success: true,
                message: 'Si el correo existe, se ha enviado un enlace de recuperación'
            });
        }

        const { user, userType } = authData;
        const resetToken = jwt.sign(
            { userId: user.id, email: user.email, userType, purpose: 'reset-password' },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Simulamos envío de email (en producción usar nodemailer)
        console.log(`[RESET PASSWORD] Token para ${email}: ${resetToken}`);

        res.json({
            success: true,
            message: 'Si el correo existe, se ha enviado un enlace de recuperación',
            token: resetToken // Se devuelve para facilitar pruebas en desarrollo
        });
    });

    static resetPassword = catchAsync(async (req, res, next) => {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return next(new AppError('Token y nueva contraseña son requeridos', 400));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.purpose !== 'reset-password') {
                return next(new AppError('Token inválido para esta operación', 400));
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
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
