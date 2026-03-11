const Cita = require("../models/Cita");
const Banquete = require("../models/Banquete");
const NotificacionController = require("./notificacionController");

class CitaController {
    // Crear una nueva solicitud de cita
    static async create(req, res) {
        try {
            const { banquete_id, fecha_sugerida, hora_sugerida, mensaje } = req.body;
            const usuario_id = req.user._id;

            // Obtener el banquete para conocer al propietario
            const banquete = await Banquete.findById(banquete_id);
            if (!banquete) {
                return res.status(404).json({
                    success: false,
                    message: "Banquete no encontrado",
                });
            }

            const propietario_id = banquete.propietario_id;

            const nuevaCita = new Cita({
                usuario_id,
                banquete_id,
                propietario_id,
                fecha_sugerida,
                hora_sugerida,
                mensaje,
            });

            await nuevaCita.save();

            // Notificar al propietario
            await NotificacionController.create({
                destinatario_id: propietario_id,
                onModel: "Propietario",
                mensaje: `Nueva solicitud de cita para "${banquete.nombre}" el ${new Date(fecha_sugerida).toLocaleDateString()}`,
                tipo: "cita",
                referencia_id: nuevaCita._id,
            });

            res.status(201).json({
                success: true,
                message: "Solicitud de cita enviada exitosamente",
                data: nuevaCita,
            });
        } catch (error) {
            console.error("Error al crear cita:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }

    // Obtener citas del usuario actual
    static async getMisCitas(req, res) {
        try {
            const usuario_id = req.user._id;

            const citas = await Cita.find({ usuario_id })
                .populate("banquete_id", "nombre direccion ubicacion")
                .sort({ fecha_creacion: -1 });

            res.json({
                success: true,
                data: citas,
            });
        } catch (error) {
            console.error("Error al obtener mis citas:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }

    // Obtener citas recibidas por el propietario
    static async getCitasRecibidas(req, res) {
        try {
            const propietario_id = req.user._id;

            const citas = await Cita.find({ propietario_id })
                .populate("usuario_id", "nombre email")
                .populate("banquete_id", "nombre")
                .sort({ fecha_creacion: -1 });

            res.json({
                success: true,
                data: citas,
            });
        } catch (error) {
            console.error("Error al obtener citas recibidas:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }
}

module.exports = CitaController;
