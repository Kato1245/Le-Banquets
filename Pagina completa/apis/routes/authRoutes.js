const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// --- Registro ---
router.post('/register/usuario',
    validateRegistration('usuario'),
    AuthController.register
);

router.post('/register/propietario',
    validateRegistration('propietario'),
    AuthController.register
);

// --- Login ---
router.post('/login', validateLogin, AuthController.login);

// --- Perfil ---
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);

// --- Recuperación de contraseña ---
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// --- Verificación de token ---
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