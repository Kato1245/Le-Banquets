const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservaController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, ReservaController.create);
router.get("/agenda", authenticateToken, ReservaController.getCitasYReservasPropietario);
router.get("/mis-reservas", authenticateToken, ReservaController.getMisReservas);
router.patch("/:id/estado", authenticateToken, ReservaController.actualizarEstado);

module.exports = router;
