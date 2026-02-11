const Banquete = require("../models/Banquete");

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

      const nuevoBanquete = new Banquete({
        nombre,
        direccion,
        capacidad,
        descripcion,
        precio_base,
        propietario_id,
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
      const updates = req.body;

      const banquete = await Banquete.findOne({ _id: id, propietario_id });

      if (!banquete) {
        return res.status(404).json({
          success: false,
          message: "Banquete no encontrado o no tienes permiso para editarlo",
        });
      }

      Object.assign(banquete, updates);
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

      const result = await Banquete.findOneAndDelete({
        _id: id,
        propietario_id,
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Banquete no encontrado o no tienes permiso para eliminarlo",
        });
      }

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
