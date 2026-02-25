const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Registro de intentos fallidos por IP (en memoria)
// Nota: En producción con múltiples instancias usar Redis
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutos

// Generación de auth_id único
const generateAuthId = () =>
    'auth_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);

// Obtener IP del cliente de forma segura
const getClientIP = (req) =>
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

// Registrar un intento fallido de login para una IP
const recordFailedAttempt = (key, current) => {
    const newCount = current.count + 1;
    const lockUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCK_TIME : null;
    loginAttempts.set(key, { count: newCount, lockUntil });
    return { newCount, locked: newCount >= MAX_ATTEMPTS };
};

class AuthController {
    static async register(req, res) {
        try {
            const isPropietario = req.originalUrl.includes('/register/propietario');
            const userType = isPropietario ? 'propietario' : 'usuario';
            const table = isPropietario ? 'propietarios' : 'usuarios';

            const { nombre, email, contrasena, documento, telefono, fecha_nacimiento, rut } = req.body;

            // Verificar si el email ya existe
            const existingUser = await User.findByEmail(email, table);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe una cuenta con este email'
                });
            }

            const hashedPassword = await bcrypt.hash(contrasena, 12);

            const userData = {
                nombre: nombre.trim(),
                email,                         // ya normalizado por express-validator
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

            const result = await User.createUser(userData, table);

            return res.status(201).json({
                success: true,
                message: `${isPropietario ? 'Propietario' : 'Usuario'} registrado exitosamente`,
                data: { id: result.insertId, nombre: userData.nombre, email }
            });

        } catch (error) {
            console.error('Error en registro:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    static async login(req, res) {
        try {
            const { email, contrasena } = req.body;
            const clientIP = getClientIP(req);
            const attemptKey = `login_${clientIP}`;
            const current = loginAttempts.get(attemptKey) || { count: 0, lockUntil: null };

            // Verificar bloqueo por IP
            if (current.lockUntil && Date.now() < current.lockUntil) {
                const remainingMin = Math.ceil((current.lockUntil - Date.now()) / 60000);
                return res.status(429).json({
                    success: false,
                    message: `Demasiados intentos fallidos. Espere ${remainingMin} minuto(s) antes de intentar nuevamente.`,
                    locked: true,
                    remainingTime: remainingMin
                });
            }

            // Buscar usuario en ambas tablas
            let user = await User.findByEmail(email, 'usuarios');
            let userType = 'usuario';

            if (!user) {
                user = await User.findByEmail(email, 'propietarios');
                userType = 'propietario';
            }

            if (!user) {
                const { newCount, locked } = recordFailedAttempt(attemptKey, current);
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas',
                    attemptsLeft: Math.max(0, MAX_ATTEMPTS - newCount),
                    locked
                });
            }

            // Verificar estado de la cuenta
            if (!user.esta_activo) {
                return res.status(401).json({
                    success: false,
                    message: 'Cuenta desactivada. Contacte al administrador'
                });
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
            if (!isPasswordValid) {
                const { newCount, locked } = recordFailedAttempt(attemptKey, current);
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas',
                    attemptsLeft: Math.max(0, MAX_ATTEMPTS - newCount),
                    locked
                });
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

            return res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user: userWithoutPassword,
                    userType,
                    token,
                    expiresIn: '24h'
                }
            });

        } catch (error) {
            console.error('Error en login:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    static async getProfile(req, res) {
        try {
            const { contrasena: _, ...userWithoutPassword } = req.user;
            return res.json({
                success: true,
                message: 'Perfil obtenido exitosamente',
                data: {
                    user: userWithoutPassword,
                    userType: req.userType
                }
            });
        } catch (error) {
            console.error('Error obteniendo perfil:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            const userType = req.userType;

            if (!userId) {
                return res.status(400).json({ success: false, message: 'Usuario no identificado' });
            }

            const table = userType === 'propietario' ? 'propietarios' : 'usuarios';
            const { nombre, email, telefono } = req.body;

            const fieldsToUpdate = {};
            if (nombre !== undefined) fieldsToUpdate.nombre = nombre.trim();
            if (email !== undefined) fieldsToUpdate.email = email;
            if (telefono !== undefined) fieldsToUpdate.telefono = telefono;

            if (Object.keys(fieldsToUpdate).length === 0) {
                return res.status(400).json({ success: false, message: 'No se recibieron campos para actualizar' });
            }

            const result = await User.updateById(userId, fieldsToUpdate, table);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado o datos sin cambios' });
            }

            const updatedUser = await User.findById(userId, table);
            const { contrasena: _, ...safeUser } = updatedUser;

            return res.json({
                success: true,
                message: 'Perfil actualizado correctamente',
                data: safeUser
            });

        } catch (error) {
            console.error('Error actualizando perfil:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
}

module.exports = AuthController;