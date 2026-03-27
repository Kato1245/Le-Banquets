const mongoose = require("mongoose");

const notificacionSchema = new mongoose.Schema({
    destinatario_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "onModel", // Puede ser Usuario o Propietario
        required: true,
        index: true,
    },
    onModel: {
        type: String,
        required: true,
        enum: ["Usuario", "Propietario"],
    },
    mensaje: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ["cita", "reserva", "sistema"],
        required: true,
    },
    referencia_id: {
        type: mongoose.Schema.Types.ObjectId, // ID de la cita o reserva
        required: true,
    },
    leido: {
        type: Boolean,
        default: false,
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Notificacion", notificacionSchema);
