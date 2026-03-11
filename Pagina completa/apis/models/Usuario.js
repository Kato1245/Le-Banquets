const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
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
    esta_activo: {
      type: Boolean,
      default: true,
    },
    esta_verificado: {
      type: Boolean,
      default: false,
    },
    reset_password_token: {
      type: String,
      default: null,
    },
    reset_password_expires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: "fecha_actualizacion",
    },
  },
);

module.exports = mongoose.model("Usuario", usuarioSchema, "usuarios");
