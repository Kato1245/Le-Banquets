const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        index: true,
    },
    banquete_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Banquete",
        required: true,
        index: true,
    },
    propietario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Propietario",
        required: true,
        index: true,
    },
    fecha_sugerida: {
        type: Date,
        required: true,
    },
    hora_sugerida: {
        type: String,
        required: true,
        trim: true,
    },
    mensaje: {
        type: String,
        trim: true,
    },
    estado: {
        type: String,
        enum: ["pendiente", "confirmada", "cancelada"],
        default: "pendiente",
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Cita", citaSchema);
