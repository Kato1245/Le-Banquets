const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const banqueteRoutes = require("./routes/banqueteRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const connectDB = require("./config/mongo");

// 👇 PRIMERO SE CREA LA APP
const app = express();
const PORT = process.env.PORT || 3000;

// 👇 Conectar a MongoDB
connectDB();

// 👇 Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 👇 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/banquetes", banqueteRoutes);
app.use("/api/reservas", reservaRoutes);

// 👇 Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API de Le Banquets funcionando correctamente",
  });
});

// 👇 Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});

// 👇 Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada: " + req.originalUrl,
  });
});

// 👇 Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
