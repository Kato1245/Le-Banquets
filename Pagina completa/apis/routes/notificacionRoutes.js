const express = require("express");
const router = express.Router();
const NotificacionController = require("../controllers/notificacionController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, NotificacionController.getMisNotificaciones);
router.put("/:id/leer", authenticateToken, NotificacionController.marcarComoLeida);
router.delete("/:id", authenticateToken, NotificacionController.eliminarNotificacion);

module.exports = router;
