const express = require("express");
const router = express.Router();
const BanqueteController = require("../controllers/banqueteController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Rutas protegidas 
router.post(
  "/",
  authenticateToken,
  upload.array("imagenes", 20),
  BanqueteController.create,
);
router.get(
  "/mis-banquetes",
  authenticateToken,
  BanqueteController.getMisBanquetes,
);
router.put(
  "/:id",
  authenticateToken,
  upload.array("imagenes", 20),
  BanqueteController.update,
);
router.delete("/:id", authenticateToken, BanqueteController.delete);
router.post(
  "/:id/bloquear-fecha",
  authenticateToken,
  BanqueteController.toggleBloquearFecha
);

// Rutas públicas
router.get("/:id/fechas-ocupadas", BanqueteController.getFechasOcupadas);
router.get("/:id/disponibilidad-citas", BanqueteController.getDisponibilidadCitas);
router.get("/", BanqueteController.getAll);
router.get("/:id", BanqueteController.getById);

module.exports = router;
