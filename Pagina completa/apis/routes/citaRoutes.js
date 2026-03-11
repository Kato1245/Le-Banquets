const express = require("express");
const router = express.Router();
const CitaController = require("../controllers/citaController");
const { authenticateToken } = require("../middleware/auth");

// Todas las rutas de citas requieren autenticación
router.post("/", authenticateToken, CitaController.create);
router.get("/mis-citas", authenticateToken, CitaController.getMisCitas);
router.get("/recibidas", authenticateToken, CitaController.getCitasRecibidas);
router.patch("/:id/estado", authenticateToken, CitaController.actualizarEstado);

module.exports = router;
