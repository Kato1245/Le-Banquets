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
  dimensiones: {
    type: String,
    trim: true,
  },
  tipo: {
    type: String,
    trim: true,
  },
  equipamento: {
    type: String,
    trim: true,
  },
  servicios: {
    type: String,
    trim: true,
  },
  capacidad: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  precio_base: {
    type: Number,
    required: true,
  },
  propietario_id: {
    type: mongoose.Schema.Types.ObjectId, // ID del propietario en MongoDB
    ref: "Propietario",
    required: true,
    index: true,
  },
  imagenes: {
    type: [String],
    default: [],
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banquete", banqueteSchema);
