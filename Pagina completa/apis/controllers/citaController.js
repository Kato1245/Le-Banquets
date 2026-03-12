const Cita = require("../models/Cita");
const Reserva = require("../models/Reserva");
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
            
            // Validar si ya existe una cita o reserva confirmada para este banquete en la misma fecha y hora
            const [citaExistente, reservaExistente] = await Promise.all([
                Cita.findOne({
                    banquete_id,
                    fecha_sugerida: {
                        $gte: new Date(new Date(fecha_sugerida).setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date(fecha_sugerida).setHours(23, 59, 59, 999))
                    },
                    hora_sugerida,
                    estado: { $ne: "cancelada" }
                }),
                Reserva.findOne({
                    banquete_id,
                    fecha: {
                        $gte: new Date(new Date(fecha_sugerida).setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date(fecha_sugerida).setHours(23, 59, 59, 999))
                    },
                    hora: hora_sugerida,
                    estado: { $in: ["confirmada", "pendiente"] }
                })
            ]);

            if (citaExistente || reservaExistente) {
                return res.status(400).json({
                    success: false,
                    message: "Ya existe un compromiso programado para esta fecha y hora. Por favor, selecciona otro horario.",
                });
            }

            const nuevaCita = new Cita({
                usuario_id,
                banquete_id,
                propietario_id,
                fecha_sugerida,
                hora_sugerida,
                mensaje,
            });

            await nuevaCita.save();

            // Formatear fecha para la notificación (Local)
            const fechaLocal = new Date(fecha_sugerida).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            // Notificar al propietario
            await NotificacionController.create({
                destinatario_id: propietario_id,
                onModel: "Propietario",
                mensaje: `Nueva solicitud de cita para "${banquete.nombre}" el ${fechaLocal} a las ${hora_sugerida}`,
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

    // Actualizar estado de una cita
    static async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado, motivo_rechazo } = req.body;
            const propietario_id = req.user._id;

            const cita = await Cita.findOne({ _id: id, propietario_id }).populate("banquete_id", "nombre");

            if (!cita) {
                return res.status(404).json({
                    success: false,
                    message: "Cita no encontrada o no tienes permisos",
                });
            }

            cita.estado = estado;
            if (estado === "cancelada" && motivo_rechazo) {
                cita.motivo_rechazo = motivo_rechazo;
            }
            await cita.save();

            // Notificar al usuario sobre el cambio
            let mensajeNotif = "";
            if (estado === "confirmada") {
                mensajeNotif = `¡Tu cita para "${cita.banquete_id.nombre}" ha sido aceptada! Te esperamos el ${new Date(cita.fecha_sugerida).toLocaleDateString()}.`;
            } else if (estado === "cancelada") {
                mensajeNotif = `Tu solicitud para "${cita.banquete_id.nombre}" fue rechazada. Motivo: ${motivo_rechazo || "No especificado"}.`;
            }

            if (mensajeNotif) {
                await NotificacionController.create({
                    destinatario_id: cita.usuario_id,
                    onModel: "Usuario",
                    mensaje: mensajeNotif,
                    tipo: "cita",
                    referencia_id: cita._id,
                });
            }

            res.json({
                success: true,
                message: `Cita ${estado === "confirmada" ? "aceptada" : "rechazada"} correctamente`,
                data: cita,
            });
        } catch (error) {
            console.error("Error al actualizar estado de cita:", error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }
}

module.exports = CitaController;
