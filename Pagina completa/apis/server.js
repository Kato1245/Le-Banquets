const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const banqueteRoutes = require("./routes/banqueteRoutes");
const citaRoutes = require("./routes/citaRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const connectDB = require("./config/mongo");

// Conectar a MongoDB
connectDB();

const app = express();
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
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
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
