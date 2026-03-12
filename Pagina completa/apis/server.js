const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const banqueteRoutes = require("./routes/banqueteRoutes");
const citaRoutes = require("./routes/citaRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const connectDB = require("./config/mongo");

const fs = require("fs");
const path = require("path");

// Conectar a MongoDB
connectDB();

const app = express();

// Log de errores a archivo
const logError = (err) => {
  const logPath = path.join(__dirname, "error_log.txt");
  const message = `\n[${new Date().toISOString()}] ${err.stack || err}\n`;
  try {
    fs.appendFileSync(logPath, message);
  } catch (e) {
    console.error("No se pudo escribir en el log:", e);
  }
};

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/banquetes", banqueteRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/notificaciones", notificacionRoutes);

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API de Le Banquets funcionando correctamente",
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  logError(err);
  console.error("ERROR DETALLADO:", err);

  // Manejo específico para errores de Multer (tamaño de archivo, etc)
  if (err instanceof require("multer").MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "La imagen es demasiado grande. El límite es de 10MB por archivo.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir archivo: ${err.message}`,
    });
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: err.message,
    stack: err.stack,
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada: " + req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
