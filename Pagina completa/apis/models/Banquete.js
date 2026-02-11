const mongoose = require("mongoose");

const banqueteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  direccion: {
    type: String,
    required: true,
    trim: true,
  },
  capacidad: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio_base: {
    type: Number,
    required: true,
  },
  propietario_id: {
    type: Number, // ID del usuario en MySQL
    required: true,
    index: true,
  },
  imagen_url: {
    type: String,
    default: null,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banquete", banqueteSchema);
