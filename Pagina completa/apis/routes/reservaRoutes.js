const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservaController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, ReservaController.create);
router.get("/agenda", authenticateToken, ReservaController.getCitasYReservasPropietario);

module.exports = router;
