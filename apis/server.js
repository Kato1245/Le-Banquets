const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API de Le Banquets funcionando correctamente' 
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada: ' + req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});