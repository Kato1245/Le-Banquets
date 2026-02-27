const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Registro de usuario normal
// Registro de usuario
router.post('/register/usuario',
    validateRegistration('usuario'),
    AuthController.register
);

// Registro de propietario
router.post('/register/propietario',
    validateRegistration('propietario'),
    AuthController.register
);

// Login (solo email y contraseña)
router.post('/login', validateLogin, AuthController.login);
// Login
router.post('/login',
    validateLogin,
    AuthController.login
);

// Obtener perfil autenticado
router.get('/profile', authenticateToken, AuthController.getProfile);

// Actualizar perfil autenticado
router.put('/profile', authenticateToken, AuthController.updateProfile);

// Verificar validez del token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token válido',
        data: {
            user: {
                id: req.user.id,
                email: req.user.email,
                nombre: req.user.nombre,
                userType: req.userType
            }
        }
    });
});

module.exports = router;