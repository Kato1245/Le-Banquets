const express = require("express");
const router = express.Router();
const BanqueteController = require("../controllers/banqueteController");
const { authenticateToken } = require("../middleware/auth");

// Rutas protegidas
router.post("/", authenticateToken, BanqueteController.create);
router.get(
  "/mis-banquetes",
  authenticateToken,
  BanqueteController.getMisBanquetes,
);
router.put("/:id", authenticateToken, BanqueteController.update);
router.delete("/:id", authenticateToken, BanqueteController.delete);

// Rutas públicas
router.get("/", BanqueteController.getAll);
router.get("/:id", BanqueteController.getById);

module.exports = router;
