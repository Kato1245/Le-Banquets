const { body, validationResult } = require('express-validator');

// Middleware reutilizable para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: errors.array()
        });
    }
    next();
};

// Validación para login
const validateLogin = [
    body('email')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    handleValidationErrors
];

// Validación para registro
const validateRegistration = (userType) => {
    const validations = [
        body('nombre')
            .trim()
            .notEmpty().withMessage('El nombre es requerido')
            .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

        body('email')
            .isEmail().withMessage('Debe ser un email válido')
            .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres')
            .normalizeEmail(),

        body('contrasena')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
            .isLength({ max: 100 }).withMessage('La contraseña no puede exceder 100 caracteres'),

        body('documento')
            .optional()
            .isLength({ max: 15 }).withMessage('El documento no puede exceder 15 caracteres'),

        body('telefono')
            .optional()
            .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),

        body('fecha_nacimiento')
            .optional()
            .isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)')
    ];

    if (userType === 'propietario') {
        validations.push(
            body('rut')
                .optional()
                .isLength({ max: 100 }).withMessage('El RUT no puede exceder 100 caracteres')
        );
    }

    return [...validations, handleValidationErrors];
};

module.exports = { validateRegistration, validateLogin };