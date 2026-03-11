const Reserva = require("../models/Reserva");
const Banquete = require("../models/Banquete");
const NotificacionController = require("./notificacionController");

class ReservaController {
    // Crear reserva
    static async create(req, res) {
        try {
            const { banquete_id, fecha, hora, monto, detalles } = req.body;
            const usuario_id = req.user._id;

            const banquete = await Banquete.findById(banquete_id);
            if (!banquete) {
                return res.status(404).json({ success: false, message: "Banquete no encontrado" });
            }

            const propietario_id = banquete.propietario_id;

            const nuevaReserva = new Reserva({
                usuario_id,
                banquete_id,
                propietario_id,
                fecha,
                hora,
                monto,
                detalles,
            });

            await nuevaReserva.save();

            // Notificar al propietario
            await NotificacionController.create({
                destinatario_id: propietario_id,
                onModel: "Propietario",
                mensaje: `Nueva reserva confirmada para "${banquete.nombre}" el ${new Date(fecha).toLocaleDateString()}`,
                tipo: "reserva",
                referencia_id: nuevaReserva._id,
            });

            res.status(201).json({
                success: true,
                message: "Reserva realizada exitosamente",
                data: nuevaReserva,
            });
        } catch (error) {
            console.error("Error al crear reserva:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    // Obtener reservas (para calendario del propietario)
    static async getCitasYReservasPropietario(req, res) {
        try {
            const propietario_id = req.user._id;

            const reservas = await Reserva.find({ propietario_id })
                .populate("banquete_id", "nombre")
                .populate("usuario_id", "nombre");

            res.json({
                success: true,
                data: reservas,
            });
        } catch (error) {
            console.error("Error al obtener agenda:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }
}

module.exports = ReservaController;
