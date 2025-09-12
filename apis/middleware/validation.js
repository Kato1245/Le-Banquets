const { body, validationResult } = require('express-validator');

const validateRegistration = (userType) => {
    const validations = [
        body('nombre')
            .notEmpty().withMessage('El nombre es requerido')
            .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
        
        body('email')
            .isEmail().withMessage('Debe ser un email válido')
            .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),
        
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
            .isLength({ max: 50 }).withMessage('La fecha de nacimiento no puede exceder 50 caracteres')
    ];

    if (userType === 'propietario') {
        validations.push(
            body('rut')
                .optional()
                .isLength({ max: 100 }).withMessage('El RUT no puede exceder 100 caracteres')
        );
    }

    return [
        ...validations,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            next();
        }
    ];
};

module.exports = { validateRegistration };