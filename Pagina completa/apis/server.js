const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const banqueteRoutes = require("./routes/banqueteRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const connectDB = require("./config/mongo");
const globalErrorHandler = require("./middleware/errorController");
const AppError = require("./utils/appError");

// Crear la app
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// --- Middlewares Globales ---

// Seguridad HTTP headers
app.use(helmet());

// Implementación de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitación de peticiones (Rate Limiting)
const limiter = rateLimit({
  max: 200, // Aumentado ligeramente para desarrollo
  windowMs: 60 * 60 * 1000,
  message: 'Demasiadas peticiones desde esta IP, por favor intente en una hora.'
});
app.use('/api', limiter);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Prevenir HTTP Parameter Pollution
app.use(hpp());

// --- Rutas ---
app.use("/api/auth", authRoutes);
app.use("/api/banquetes", banqueteRoutes);
app.use("/api/reservas", reservaRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  const mongooseStatus = mongoose.connection.readyState === 1 ? "conectado" : "desconectado";
  res.json({
    success: true,
    message: "API de Le Banquets funcionando correctamente",
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
      databases: {
        mongodb: mongooseStatus
      }
    }
  });
});

// Manejo de rutas no encontradas (404)
app.all("*", (req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Manejo de errores global
app.use(globalErrorHandler);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor de Le Banquets corriendo en el puerto ${PORT}`);
});
