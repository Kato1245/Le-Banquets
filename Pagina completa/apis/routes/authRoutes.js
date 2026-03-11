const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { validateRegistration } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Registro de usuario normala
router.post(
  "/register/usuario",
  validateRegistration("usuario"),
  AuthController.register,
);

// Registro de propietario
router.post(
  "/register/propietario",
  validateRegistration("propietario"),
  AuthController.register,
);

// Login (solo email y contraseña)
router.post("/login", AuthController.login);

// Obtener perfil (requiere autenticación)
router.get("/profile", authenticateToken, AuthController.getProfile);

router.put("/profile", authenticateToken, AuthController.updateProfile);

// Cambiar contraseña
router.put("/password", authenticateToken, AuthController.changePassword);

// Subir / cambiar foto de perfil
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  AuthController.uploadAvatar,
);

// Eliminar cuenta (requiere contraseña de confirmación)
router.delete("/account", authenticateToken, AuthController.deleteAccount);

// Recuperación de contraseña
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Verificar token
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Token válido",
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        nombre: req.user.nombre,
        userType: req.userType,
      },
    },
  });
});

module.exports = router;
