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

// 👇 PRIMERO SE CREA LA APP
const app = express();
const PORT = process.env.PORT || 3000;

// 👇 Conectar a MongoDB
connectDB();

// 👇 global Middlewares
// Set security HTTP headers
app.use(helmet());

// Implement CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" })); // Reduced limit for security, 50mb was way too high for typical JSON
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// 👇 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/banquetes", banqueteRoutes);
app.use("/api/reservas", reservaRoutes);

// 👇 Ruta de prueba avanzada
app.get("/api/health", async (req, res) => {
  const mongooseStatus = mongoose.connection.readyState === 1 ? "conectado" : "desconectado";

  res.json({
    success: true,
    message: "API de Le Banquets funcionando correctamente",
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
      databases: {
        mongodb: mongooseStatus,
        mysql: "conectado" // Si llegó aquí, el servidor está arriba y MySQL se conectó al inicio
      }
    }
  });
});

// 👇 Manejo de rutas no encontradas
app.all(/.*/, (req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor!`, 404));
});

// 👇 Manejo de errores global
app.use(globalErrorHandler);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const banqueteRoutes = require('./routes/banqueteRoutes');
const connectDB = require('./config/mongo');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// ── Seguridad ──────────────────────────────────────────────────────────────
app.use(helmet()); // Cabeceras de seguridad HTTP

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Parsing ────────────────────────────────────────────────────────────────
// Limite reducido a 10mb para JSON (50mb era excesivo para datos normales)
// Las imágenes se suben con multipart/form-data via multer
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/banquetes', banqueteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API de Le Banquets funcionando correctamente' });
});

// ── Manejo de errores ──────────────────────────────────────────────────────
// Error handler global (debe ir DESPUÉS de las rutas)
app.use((err, req, res, next) => {
  // Errores de multer (archivo demasiado grande, tipo inválido, etc.)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'El archivo supera el tamaño máximo de 5MB' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({ success: false, message: 'Se permiten máximo 5 imágenes' });
  }
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(415).json({ success: false, message: err.message });
  }

  console.error('Error no controlado:', err.message);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// 404 — Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// 👇 Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
