const Reserva = require("../models/Reserva");
const Banquete = require("../models/Banquete");
const Propietario = require("../models/Propietario");
const Usuario = require("../models/Usuario");
const NotificacionController = require("./notificacionController");
const { sendReservationRequestEmail } = require("../config/mailer");

// Helper: formatea una fecha de MongoDB (Date) sin desfase de zona horaria.
const formatearFecha = (fecha) => {
  if (!fecha) return "fecha no disponible";
  const iso = new Date(fecha).toISOString();
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

class ReservaController {
    // Crear reserva
    static async create(req, res) {
        try {
            const { banquete_id, fecha, hora, monto, detalles } = req.body;
            const usuario_id = req.user._id;

            // Validar que la fecha+hora de la reserva no sea en el pasado
            if (fecha && hora) {
                const [hh, mm] = hora.split(":").map(Number);
                const [yy, mo, dd] = fecha.split("T")[0].split("-").map(Number);
                const fechaReserva = new Date(yy, mo - 1, dd, hh, mm, 0);
                if (fechaReserva <= new Date()) {
                    return res.status(400).json({
                        success: false,
                        message: "No puedes hacer una reserva en una fecha y hora que ya pasaron.",
                    });
                }
            }

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

            // Notificar al propietario (notificación interna)
            await NotificacionController.create({
                destinatario_id: propietario_id,
                onModel: "Propietario",
                mensaje: `Nueva reserva confirmada para "${banquete.nombre}" el ${formatearFecha(fecha)}`,
                tipo: "reserva",
                referencia_id: nuevaReserva._id,
            });

            // Notificar al propietario por correo si tiene la opción activa
            const propietario = await Propietario.findById(propietario_id);

            // Verificamos si existe el propietario y si tiene el correo habilitado (por defecto true si no existe el campo)
            const mailHabilitado = propietario && (propietario.notificaciones?.email !== false);

            if (mailHabilitado) {
                const cliente = await Usuario.findById(usuario_id);
                console.log(`Enviando correo de solicitud a propietario: ${propietario.email}`);
                await sendReservationRequestEmail(propietario.email, {
                    banqueteNombre: banquete.nombre,
                    clienteNombre: cliente?.nombre || "Un cliente",
                    fecha,
                    hora,
                    monto,
                    detalles,
                });
            }

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
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const reservas = await Reserva.find({ 
        propietario_id,
        $or: [
          { estado: { $ne: "cancelada" } },
          { estado: "cancelada", updatedAt: { $gte: threeDaysAgo } }
        ]
      })
        .populate("banquete_id", "nombre direccion imagenes")
        .populate("usuario_id", "nombre email telefono");

      res.json({
        success: true,
        data: reservas,
      });
    } catch (error) {
      console.error("Error al obtener agenda:", error);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  }

  // Obtener mis reservas (como cliente)
  static async getMisReservas(req, res) {
    try {
      const usuario_id = req.user._id;
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const reservas = await Reserva.find({ 
        usuario_id,
        $or: [
          { estado: { $ne: "cancelada" } },
          { estado: "cancelada", updatedAt: { $gte: threeDaysAgo } }
        ]
      })
        .populate("banquete_id", "nombre direccion imagenes tipo")
        .populate("propietario_id", "nombre email");

      res.json({
        success: true,
        data: reservas,
      });
    } catch (error) {
      console.error("Error al obtener mis reservas:", error);
      res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
        }
    }

    // Actualizar estado de una reserva
    static async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado, motivo_rechazo } = req.body;
            const propietario_id = req.user._id;

            const reserva = await Reserva.findOne({ _id: id, propietario_id }).populate("banquete_id", "nombre");

            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: "Reserva no encontrada o no tienes permisos",
                });
            }

            reserva.estado = estado;
            if (estado === "cancelada" && motivo_rechazo) {
                reserva.motivo_rechazo = motivo_rechazo;
            }
            await reserva.save();

            // Notificar al usuario
            const NotificacionController = require("./notificacionController");
            let mensajeNotif = "";
            if (estado === "confirmada") {
                mensajeNotif = `¡Tu reserva para "${reserva.banquete_id?.nombre || "el banquete"}" ha sido confirmada!`;
            } else if (estado === "cancelada") {
                mensajeNotif = `Tu reserva para "${reserva.banquete_id?.nombre || "el banquete"}" fue rechazada. Motivo: ${motivo_rechazo || "No especificado"}.`;
            }

            if (mensajeNotif) {
                await NotificacionController.create({
                    destinatario_id: reserva.usuario_id,
                    onModel: "Usuario",
                    mensaje: mensajeNotif,
                    tipo: "reserva",
                    referencia_id: reserva._id,
                });
            }


            // Notificar al usuario por correo si tiene la opción activa
            const usuario = await Usuario.findById(reserva.usuario_id);
            if (usuario && usuario.notificaciones?.email) {
                const { sendReservationStatusEmail } = require("../config/mailer");
                await sendReservationStatusEmail(usuario.email, {
                    nombreUsuario: usuario.nombre,
                    banqueteNombre: reserva.banquete_id?.nombre || "Banquete",
                    estado: estado,

                    motivo_rechazo: motivo_rechazo,
                    fecha: reserva.fecha,
                    hora: reserva.hora,
                });
            }

            res.json({
                success: true,
                message: `Reserva ${estado === "confirmada" ? "confirmada" : "cancelada"} correctamente`,
                data: reserva,
            });
        } catch (error) {
            console.error("Error al actualizar estado de reserva:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    // Modificar fecha de reserva (Propietario)
    static async modificarFecha(req, res) {
        try {
            const { id } = req.params;
            const { fecha, hora } = req.body;
            const propietario_id = req.user._id;

            const reserva = await Reserva.findOne({ _id: id, propietario_id }).populate("banquete_id", "nombre");

            if (!reserva) {
                return res.status(404).json({
                    success: false,
                    message: "Reserva no encontrada o no tienes permisos",
                });
            }

            reserva.fecha = fecha;
            reserva.hora = hora;
            // Opcional: pasar a estado pendiente de nuevo o mantenerlo, lo dejamos igual por ahora.
            await reserva.save();

            // Notificar al usuario del cambio
            const NotificacionController = require("./notificacionController");
            let mensajeNotif = `El propietario ha modificado la fecha de tu reserva para "${reserva.banquete_id?.nombre || "el banquete"}" a ${formatearFecha(fecha)} a las ${hora}.`;

            await NotificacionController.create({
                destinatario_id: reserva.usuario_id,
                onModel: "Usuario",
                mensaje: mensajeNotif,
                tipo: "reserva",
                referencia_id: reserva._id,
            });


            const usuario = await Usuario.findById(reserva.usuario_id);
            if (usuario && usuario.notificaciones?.email) {
                const { sendReservationStatusEmail } = require("../config/mailer");
                await sendReservationStatusEmail(usuario.email, {
                    nombreUsuario: usuario.nombre,
                    banqueteNombre: reserva.banquete_id?.nombre || "Banquete",
                    estado: "modificada",

                    fecha: reserva.fecha,
                    hora: reserva.hora,
                });
            }

            res.json({
                success: true,
                message: "Fecha de reserva modificada correctamente",
                data: reserva,
            });
        } catch (error) {
            console.error("Error al modificar fecha de reserva:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }
}

module.exports = ReservaController;
