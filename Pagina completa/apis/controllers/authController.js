const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Función para generar auth_id
const generateAuthId = () => {
    return 'auth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

class AuthController {
    static async register(req, res) {
        try {
            const isPropietario = req.originalUrl.includes('/register/propietario');
            const userType = isPropietario ? 'propietario' : 'usuario';
            const { nombre, email, contrasena, documento, telefono, fecha_nacimiento, rut } = req.body;

            // Validar campos obligatorios
            if (!nombre || !email || !contrasena) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y contraseña son obligatorios'
                });
            }

            // Verificar si el usuario ya existe
            const table = userType === 'propietario' ? 'propietarios' : 'usuarios';
            const existingUser = await User.findByEmail(email, table);
            
            if (existingUser) {
                console.log('Usuario ya existe:', email);
                return res.status(409).json({
                    success: false,
                    message: 'El usuario ya existe con este email'
                });
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

            console.log('Intentando crear usuario:', { userData, table });

            const result = await User.createUser(userData, table);

            res.status(201).json({
                success: true,
                message: `${userType === 'propietario' ? 'Propietario' : 'Usuario'} registrado exitosamente`,
                data: {
                    id: result.insertId,
                    nombre,
                    email
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // ... (el resto del código se mantiene igual)
}

module.exports = AuthController;