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
        .notEmpty().withMessage('La contraseña es requerida'),
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
            .normalizeEmail()
            .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),

        body('contrasena')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
            .isLength({ max: 100 }).withMessage('La contraseña no puede exceder 100 caracteres'),

        body('documento')
            .optional()
            .trim()
            .isLength({ max: 15 }).withMessage('El documento no puede exceder 15 caracteres'),

        body('telefono')
            .optional()
            .trim()
            .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),

        body('fecha_nacimiento')
            .optional()
            .isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)')
    ];

    if (userType === 'propietario') {
        validations.push(
            body('rut')
                .optional()
                .trim()
                .isLength({ max: 100 }).withMessage('El RUT no puede exceder 100 caracteres')
        );
    }

    return [...validations, handleValidationErrors];
};

// Validación para Banquetes
const validateBanquete = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').trim().isLength({ max: 200 }),
    body('direccion').notEmpty().withMessage('La dirección es requerida').trim(),
    body('capacidad').isInt({ min: 1 }).withMessage('La capacidad debe ser un número mayor a 0'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida').trim(),
    body('precio_base').isFloat({ min: 0 }).withMessage('El precio base debe ser un número positivo'),
    handleValidationErrors
];

// Validación para Reservas
const validateReserva = [
    body('usuarioId').notEmpty().withMessage('ID de usuario requerido'),
    body('usuarioTipo').isIn(['usuario', 'propietario']).withMessage('Tipo de usuario inválido'),
    body('banqueteId').notEmpty().withMessage('ID de banquete requerido'),
    body('fecha').isISO8601().withMessage('Fecha inválida'),
    body('horaInicio').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio inválida (HH:mm)'),
    body('horaFin').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de fin inválida (HH:mm)'),
    body('tipo').isIn(['evento', 'visita']).withMessage('Tipo de reserva inválido'),
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateBanquete,
    validateReserva
};
