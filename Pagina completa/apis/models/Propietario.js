const mongoose = require("mongoose");

const propietarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contrasena: {
      type: String,
      required: true,
    },
    documento: {
      type: String,
      default: null,
    },
    telefono: {
      type: String,
      default: null,
    },
    fecha_nacimiento: {
      type: Date,
      default: null,
    },
    foto_perfil: {
      type: String,
      default: null,
    },
    rut: {
      type: String,
      default: null,
    },
    esta_activo: {
      type: Boolean,
      default: true,
    },
    esta_verificado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    },
  },
);

module.exports = mongoose.model(
  "Propietario",
  propietarioSchema,
  "propietarios",
);
