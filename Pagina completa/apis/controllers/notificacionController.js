const Notificacion = require("../models/Notificacion");

class NotificacionController {
    // Crear una nueva notificación (método interno para ser usado por otros controladores)
    static async create({ destinatario_id, onModel, mensaje, tipo, referencia_id }) {
        try {
            const nuevaNotificacion = new Notificacion({
                destinatario_id,
                onModel,
                mensaje,
                tipo,
                referencia_id,
            });
            await nuevaNotificacion.save();
            return nuevaNotificacion;
        } catch (error) {
            console.error("Error al crear notificación interna:", error);
            throw error;
        }
    }

    // Obtener notificaciones del usuario/propietario actual
    static async getMisNotificaciones(req, res) {
        try {
            const destinatario_id = req.user._id;
            const onModel = req.userType === "propietario" ? "Propietario" : "Usuario";

            const notificaciones = await Notificacion.find({ destinatario_id, onModel })
                .sort({ fecha_creacion: -1 })
                .limit(50);

            res.json({
                success: true,
                data: notificaciones,
            });
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }

    // Marcar como leída
    static async marcarComoLeida(req, res) {
        try {
            const { id } = req.params;
            const destinatario_id = req.user._id;

            const notificacion = await Notificacion.findOneAndUpdate(
                { _id: id, destinatario_id },
                { leido: true },
                { new: true }
            );

            if (!notificacion) {
                return res.status(404).json({
                    success: false,
                    message: "Notificación no encontrada",
                });
            }

            res.json({
                success: true,
                message: "Notificación marcada como leída",
            });
        } catch (error) {
            console.error("Error al marcar notificación:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }
}

module.exports = NotificacionController;
