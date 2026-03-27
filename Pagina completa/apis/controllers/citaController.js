const Cita = require("../models/Cita");
const Banquete = require("../models/Banquete");
const Propietario = require("../models/Propietario");
const Usuario = require("../models/Usuario");
const NotificacionController = require("./notificacionController");
const { sendAppointmentStatusEmail, sendAppointmentRequestEmail } = require("../config/mailer");

// Helper: formatea una fecha de MongoDB (Date) sin desfase de zona horaria.
// Extrae año/mes/día directamente del ISO string para evitar la conversión UTC → local.
const formatearFecha = (fecha) => {
  if (!fecha) return "fecha no disponible";
  const iso = new Date(fecha).toISOString(); // ej. "2025-03-15T00:00:00.000Z"
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

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

      // Validar que la fecha+hora de la cita no sea en el pasado
      if (fecha_sugerida && hora_sugerida) {
          const [hh, mm] = hora_sugerida.split(":").map(Number);
          const [yy, mo, dd] = fecha_sugerida.split("T")[0].split("-").map(Number);
          const fechaCita = new Date(yy, mo - 1, dd, hh, mm, 0);
          if (fechaCita <= new Date()) {
              return res.status(400).json({
                  success: false,
                  message: "No puedes agendar una cita en una fecha y hora que ya pasaron.",
              });
          }
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
        mensaje: `Nueva solicitud de cita para "${banquete.nombre}" el ${formatearFecha(fecha_sugerida)}`,
        tipo: "cita",
        referencia_id: nuevaCita._id,
      });

      // Notificar al propietario por correo si tiene la opción activa
      const propietario = await Propietario.findById(propietario_id);
      const mailHabilitado = propietario && (propietario.notificaciones?.email !== false);

      if (mailHabilitado) {
        const cliente = await Usuario.findById(usuario_id);
        console.log(`Enviando correo de solicitud de cita a propietario: ${propietario.email}`);
        await sendAppointmentRequestEmail(propietario.email, {
          banqueteNombre: banquete.nombre,
          clienteNombre: cliente?.nombre || "Un cliente",
          fecha: fecha_sugerida,
          hora: hora_sugerida,
          mensaje,
        });
      }

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
        .populate("banquete_id", "nombre direccion direccion")
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

            // Notificar al usuario sobre el cambio (interna)
            let mensajeNotif = "";
            if (estado === "confirmada") {
                mensajeNotif = `¡Tu cita para "${cita.banquete_id.nombre}" ha sido aceptada! Te esperamos el ${formatearFecha(cita.fecha_sugerida)}.`;
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

            // Notificar al usuario por correo si tiene la opción activa
            const usuario = await Usuario.findById(cita.usuario_id);
            if (usuario && usuario.notificaciones?.email) {
                await sendAppointmentStatusEmail(usuario.email, {
                    nombreUsuario: usuario.nombre,
                    banqueteNombre: cita.banquete_id.nombre,
                    estado: estado,
                    motivo_rechazo: motivo_rechazo,
                    fecha: cita.fecha_sugerida,
                    hora: cita.hora_sugerida,
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
