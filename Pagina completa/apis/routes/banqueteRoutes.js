const express = require("express");
const router = express.Router();
const BanqueteController = require("../controllers/banqueteController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validateBanquete } = require("../middleware/validation");

// Rutas protegidas (con upload de imágenes en POST y PUT)
router.post(
  "/",
  authenticateToken,
  upload.array("imagenes", 5),
  validateBanquete,
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
  upload.array("imagenes", 5),
  validateBanquete,
  BanqueteController.update,
);
router.delete("/:id", authenticateToken, BanqueteController.delete);

// Rutas públicas
router.get("/", BanqueteController.getAll);
router.get("/:id", BanqueteController.getById);

module.exports = router;
