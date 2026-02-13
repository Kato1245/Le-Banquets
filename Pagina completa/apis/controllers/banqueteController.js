const Banquete = require("../models/Banquete");
const fs = require("fs");
const path = require("path");

class BanqueteController {
  // Crear un nuevo banquete
  static async create(req, res) {
    try {
      const { nombre, direccion, capacidad, descripcion, precio_base } =
        req.body;

      // req.user viene del middleware authenticateToken y contiene el ID del usuario de MySQL
      const propietario_id = req.user.id;
      const userType = req.userType;

      if (userType !== "propietario") {
        return res.status(403).json({
          success: false,
          message: "Solo los propietarios pueden crear banquetes",
        });
      }

      // Procesar imágenes subidas
      const imagenes = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          imagenes.push(`/uploads/banquetes/${file.filename}`);
        });
      }

      const nuevoBanquete = new Banquete({
        nombre,
        direccion,
        capacidad,
        descripcion,
        precio_base,
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
        capacidad,
        descripcion,
        precio_base,
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
      if (capacidad) banquete.capacidad = capacidad;
      if (descripcion) banquete.descripcion = descripcion;
      if (precio_base) banquete.precio_base = precio_base;

      // Manejar imágenes: conservar las existentes que el usuario no eliminó
      let imagenesFinales = [];

      // Parsear imágenes existentes que se mantienen
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

      // Eliminar del disco las imágenes que fueron removidas por el usuario
      const imagenesEliminadas = banquete.imagenes.filter(
        (img) => !imagenesFinales.includes(img),
      );
      imagenesEliminadas.forEach((img) => {
        const filePath = path.join(__dirname, "..", img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Agregar nuevas imágenes subidas
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          imagenesFinales.push(`/uploads/banquetes/${file.filename}`);
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

      // Eliminar archivos de imágenes del disco
      if (banquete.imagenes && banquete.imagenes.length > 0) {
        banquete.imagenes.forEach((img) => {
          const filePath = path.join(__dirname, "..", img);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

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
