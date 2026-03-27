const mongoose = require("mongoose");
const Banquete = require("../models/Banquete");
const Reserva = require("../models/Reserva");

class BanqueteController {
  // Crear un nuevo banquete
  static async create(req, res) {
    try {
      const {
        nombre,
        direccion,
        dimensiones,
        tipo,
        capacidad,
        descripcion,
        precio_base,
        servicios,
        eventos_que_ofrece,
      } = req.body;

      // req.user viene del middleware authenticateToken y contiene el documento Mongoose del usuario
      const propietario_id = req.user._id;
      const userType = req.userType;

      if (userType !== "propietario") {
        return res.status(403).json({
          success: false,
          message: "Solo los propietarios pueden crear banquetes",
        });
      }

      // Convertir imágenes de Buffer a Base64 data URI
      const imagenes = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const base64 = file.buffer.toString("base64");
          const dataUri = `data:${file.mimetype};base64,${base64}`;
          imagenes.push(dataUri);
        });
      }

      const nuevoBanquete = new Banquete({
        nombre,
        direccion,
        dimensiones,
        tipo,
        dimensiones,
        capacidad,
        descripcion: descripcion?.trim(),
        precio_base,
        servicios,
        eventos_que_ofrece: eventos_que_ofrece ? JSON.parse(eventos_que_ofrece) : [],
        propietario_id,
        imagenes,
      });

      await nuevoBanquete.save();

      res.status(201).json({
        success: true,
        message: "Banquete creado exitosamente",
        data: nuevoBanquete,
      });
    } catch (error) {
      console.error("Error al crear banquete:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  // Obtener los banquetes del propietario actual
  static async getMisBanquetes(req, res) {
    try {
      const propietario_id = req.user._id;

      const banquetes = await Banquete.find({ propietario_id }).sort({
        fecha_creacion: -1,
      });

      res.json({
        success: true,
        banquetes, // El frontend espera { banquetes: [...] }
      });
    } catch (error) {
      console.error("Error al obtener banquetes:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  // Obtener todos los banquetes (público)
  static async getAll(req, res) {
    try {
      const banquetes = await Banquete.find().sort({ fecha_creacion: -1 });
      res.json({
        success: true,
        data: banquetes,
      });
    } catch (error) {
      console.error("Error al obtener todos los banquetes:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  // Actualizar banquete
  static async update(req, res) {
    try {
      const { id } = req.params;
      const propietario_id = req.user._id;

      // Validar si el ID es un ObjectId válido de MongoDB
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "El ID del banquete no es válido",
        });
      }

      const {
        nombre,
        direccion,
        dimensiones,
        tipo,
        capacidad,
        descripcion,
        precio_base,
        servicios,
        eventos_que_ofrece,
        imagenes_existentes,
      } = req.body;

      const banquete = await Banquete.findOne({ _id: id, propietario_id });

      if (!banquete) {
        return res.status(404).json({
          success: false,
          message: "Banquete no encontrado o no tienes permiso para editarlo",
        });
      }

      // Actualizar campos de texto
      if (nombre !== undefined) banquete.nombre = nombre;
      if (direccion !== undefined) banquete.direccion = direccion;
      if (dimensiones !== undefined) banquete.dimensiones = dimensiones;
      if (tipo !== undefined) banquete.tipo = tipo;
      if (capacidad !== undefined) banquete.capacidad = capacidad;
      if (descripcion !== undefined) banquete.descripcion = descripcion.trim();
      if (precio_base !== undefined) banquete.precio_base = precio_base;
      if (servicios !== undefined) banquete.servicios = servicios;
      if (eventos_que_ofrece !== undefined) banquete.eventos_que_ofrece = JSON.parse(eventos_que_ofrece);

      // Manejar imágenes: conservar las existentes que el usuario no eliminó
      let imagenesFinales = [];

      // Parsear imágenes existentes
      if (imagenes_existentes) {
        try {
          const parsed =
            typeof imagenes_existentes === "string"
              ? JSON.parse(imagenes_existentes)
              : imagenes_existentes;

          if (Array.isArray(parsed)) {
            imagenesFinales = parsed;
          } else if (parsed) {
            imagenesFinales = [parsed];
          }
        } catch (e) {
          console.warn(
            "No se pudo parsear imagenes_existentes, usándolo como string:",
            e,
          );
          imagenesFinales = [imagenes_existentes];
        }
      }

      // Convertir nuevas imágenes de Buffer a Base64 data URI
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file) => {
          const base64 = file.buffer.toString("base64");
          const dataUri = `data:${file.mimetype};base64,${base64}`;
          imagenesFinales.push(dataUri);
        });
      }

      banquete.imagenes = imagenesFinales;
      await banquete.save();

      res.json({
        success: true,
        message: "Banquete actualizado exitosamente",
        data: banquete,
      });
    } catch (error) {
      console.error("Error detallado al actualizar banquete:", error);

      // Si el error es por el tamaño del documento en MongoDB
      if (error.message && error.message.includes("large")) {
        return res.status(413).json({
          success: false,
          message:
            "El banquete es demasiado grande (posiblemente por demasiadas imágenes de alta resolución)",
        });
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor al actualizar el banquete",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Eliminar banquete
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const propietario_id = req.user._id;

      const banquete = await Banquete.findOne({ _id: id, propietario_id });

      if (!banquete) {
        return res.status(404).json({
          success: false,
          message: "Banquete no encontrado o no tienes permiso para eliminarlo",
        });
      }

      // Ya no hay archivos en disco que borrar, las imágenes se eliminan con el documento
      await Banquete.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "Banquete eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar banquete:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message
      });
    }
  }

  // Obtener un banquete específico
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const banquete = await Banquete.findById(id);

      if (!banquete) {
        return res.status(404).json({
          success: false,
          message: "Banquete no encontrado",
        });
      }

      res.json({
        success: true,
        data: banquete,
      });
    } catch (error) {
      console.error("Error al obtener banquete:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  // Obtener fechas ocupadas de un banquete
  static async getFechasOcupadas(req, res) {
    try {
      const { id } = req.params;
      const banquete = await Banquete.findById(id);
      if (!banquete) {
        return res.status(404).json({ success: false, message: "Banquete no encontrado" });
      }

      // Buscar reservas confirmadas o pendientes
      const reservas = await Reserva.find({ banquete_id: id, estado: { $ne: "cancelada" } });
      const fechasReservadas = reservas.map((r) => {
        // Asegurarse de retornar YYYY-MM-DD
        const date = new Date(r.fecha);
        return date.toISOString().split("T")[0];
      });

      // Combinar fechas manuales y de reservas sin duplicados
      const bloqueadas = banquete.fechas_bloqueadas || [];
      const ocupadas = [...new Set([...bloqueadas, ...fechasReservadas])];

      res.json({
        success: true,
        data: ocupadas,
      });
    } catch (error) {
      console.error("Error al obtener fechas ocupadas:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

  // Obtener disponibilidad para citas (días ocupados + horas tomadas)
  static async getDisponibilidadCitas(req, res) {
    try {
      const { id } = req.params;
      const banquete = await Banquete.findById(id);
      if (!banquete) {
        return res.status(404).json({ success: false, message: "Banquete no encontrado" });
      }

      // Buscar reservas confirmadas o pendientes (bloquean todo el día)
      const reservas = await Reserva.find({ banquete_id: id, estado: { $ne: "cancelada" } });
      const fechasReservadas = reservas.map((r) => new Date(r.fecha).toISOString().split("T")[0]);

      // Combinar fechas manuales y de reservas sin duplicados
      const bloqueadas = banquete.fechas_bloqueadas || [];
      const fechasOcupadasCompletas = [...new Set([...bloqueadas, ...fechasReservadas])];

      // Buscar citas activas para marcar horas ocupadas
      const Cita = require("../models/Cita");
      const citas = await Cita.find({ banquete_id: id, estado: { $ne: "cancelada" } });
      
      const horasOcupadasPorDia = {};
      citas.forEach(c => {
        const dateStr = new Date(c.fecha_sugerida).toISOString().split("T")[0];
        if (!horasOcupadasPorDia[dateStr]) horasOcupadasPorDia[dateStr] = [];
        horasOcupadasPorDia[dateStr].push(c.hora_sugerida);
      });

      res.json({
        success: true,
        data: {
          fechasOcupadasCompletas,
          horasOcupadasPorDia
        },
      });
    } catch (error) {
      console.error("Error al obtener disponibilidad de citas:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

  // Activar o desactivar bloqueo de una fecha (Propietario)
  static async toggleBloquearFecha(req, res) {
    try {
      const { id } = req.params;
      const { fecha } = req.body;
      const propietario_id = req.user._id;

      const banquete = await Banquete.findOne({ _id: id, propietario_id });

      if (!banquete) {
        return res.status(404).json({
          success: false,
          message: "Banquete no encontrado o no tienes permiso",
        });
      }

      if (!banquete.fechas_bloqueadas) {
        banquete.fechas_bloqueadas = [];
      }

      const index = banquete.fechas_bloqueadas.indexOf(fecha);
      if (index > -1) {
        // Si ya está bloqueada, la desbloqueamos
        banquete.fechas_bloqueadas.splice(index, 1);
      } else {
        // Si no está bloqueada, la bloqueamos
        banquete.fechas_bloqueadas.push(fecha);
      }

      await banquete.save();

      res.json({
        success: true,
        message: index > -1 ? "Fecha desbloqueada" : "Fecha bloqueada",
        data: banquete.fechas_bloqueadas,
      });
    } catch (error) {
      console.error("Error al actualizar disponibilidad:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
}

module.exports = BanqueteController;
