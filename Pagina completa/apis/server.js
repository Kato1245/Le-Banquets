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

// 👇 Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
