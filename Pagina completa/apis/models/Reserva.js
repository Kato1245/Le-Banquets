const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
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
    fecha: {
        type: Date,
        required: true,
    },
    hora: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: ["pendiente", "confirmada", "cancelada", "completado"],
        default: "pendiente",
    },
    monto: {
        type: Number,
        required: true,
    },
    detalles: {
        type: String,
        trim: true,
    },
    motivo_rechazo: {
        type: String,
        trim: true,
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Reserva", reservaSchema);
