const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: Number,
      required: true,
    },
    usuarioTipo: {
      type: String,
      enum: ["usuario", "propietario"],
      required: true,
    },
    banqueteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Banquete",
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
    },
    horaFin: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["evento", "visita"],
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobada", "rechazada", "modificada"],
      default: "pendiente",
    },
    precioFinal: {
      type: Number,
    },
    notas: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reserva", reservaSchema);
