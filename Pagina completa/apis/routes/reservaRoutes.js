const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");
const { validateReserva } = require("../middleware/validation");

router.post("/", validateReserva, reservaController.crearReserva);
router.get("/banquete/:id", reservaController.obtenerReservasPorBanquete);

module.exports = router;
