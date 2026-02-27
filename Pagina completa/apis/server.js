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

// Initialize App
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// ── Middlewares Globales ──────────────────────────────────────────────────
// Set security HTTP headers
app.use(helmet());

// Implement CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/banquetes", banqueteRoutes);
app.use("/api/reservas", reservaRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API de Le Banquets funcionando correctamente",
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
      databases: {
        mongodb: mongoose.connection.readyState === 1 ? "conectado" : "desconectado"
      }
    }
  });
});

// ── Manejo de errores ──────────────────────────────────────────────────────
// Manejo de rutas no encontradas
app.use((req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Manejo de errores de Multer y Globales
app.use((err, req, res, next) => {
  // Errores específicos de Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'El archivo supera el tamaño máximo de 5MB' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({ success: false, message: 'Se permiten máximo 5 imágenes' });
  }
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(415).json({ success: false, message: err.message });
  }

  // Usar el controlador global si existe, o un fallback
  if (globalErrorHandler) {
    return globalErrorHandler(err, req, res, next);
  }

  console.error('Error no controlado:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

// ── Levantar servidor ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
