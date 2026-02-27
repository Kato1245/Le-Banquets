const Banquete = require("../models/Banquete");

class BanqueteController {
  // Crear un nuevo banquete
  static async create(req, res) {
    try {
      const {
        nombre,
        direccion,
        ubicacion,
        dimensiones,
        tipo,
        capacidad,
        descripcion,
        precio_base,
        equipamento,
        servicios,
      } = req.body;

      // req.user viene del middleware authenticateToken y contiene el ID del usuario de MySQL
      const propietario_id = req.user.id;
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
        ubicacion,
        dimensiones,
        tipo,
        capacidad,
        descripcion,
        precio_base,
        equipamento,
        servicios,
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
      });
    }
  }

  // Obtener los banquetes del propietario actual
  static async getMisBanquetes(req, res) {
    try {
      const propietario_id = req.user.id;

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
      const propietario_id = req.user.id;
      const {
        nombre,
        direccion,
        ubicacion,
        dimensiones,
        tipo,
        capacidad,
        descripcion,
        precio_base,
        equipamento,
        servicios,
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
      if (nombre) banquete.nombre = nombre;
      if (direccion) banquete.direccion = direccion;
      if (ubicacion) banquete.ubicacion = ubicacion;
      if (dimensiones) banquete.dimensiones = dimensiones;
      if (tipo) banquete.tipo = tipo;
      if (capacidad) banquete.capacidad = capacidad;
      if (descripcion) banquete.descripcion = descripcion;
      if (precio_base) banquete.precio_base = precio_base;
      if (equipamento) banquete.equipamento = equipamento;
      if (servicios) banquete.servicios = servicios;

      // Manejar imágenes: conservar las existentes que el usuario no eliminó
      let imagenesFinales = [];

      // Parsear imágenes existentes que se mantienen (ahora son data URIs)
      if (imagenes_existentes) {
        try {
          const parsed =
            typeof imagenes_existentes === "string"
              ? JSON.parse(imagenes_existentes)
              : imagenes_existentes;
          if (Array.isArray(parsed)) {
            imagenesFinales = parsed;
          }
        } catch (e) {
          // Si es un solo string (no array), lo envolvemos
          imagenesFinales = [imagenes_existentes];
        }
      }

      // Convertir nuevas imágenes de Buffer a Base64 data URI
      if (req.files && req.files.length > 0) {
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
      console.error("Error al actualizar banquete:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  // Eliminar banquete
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const propietario_id = req.user.id;

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
}

module.exports = BanqueteController;
