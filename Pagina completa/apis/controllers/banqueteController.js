const Banquete = require("../models/Banquete");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class BanqueteController {
  // Crear un nuevo banquete
  static create = catchAsync(async (req, res, next) => {
    const { nombre, direccion, capacidad, descripcion, precio_base } = req.body;

    // req.user viene del middleware authenticateToken y contiene el ID del usuario de MySQL
    const propietario_id = req.user.id;
    const userType = req.userType;

    if (userType !== "propietario") {
      return next(new AppError("Solo los propietarios pueden crear banquetes", 403));
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
  });

  // Obtener los banquetes del propietario actual
  static getMisBanquetes = catchAsync(async (req, res, next) => {
    const propietario_id = req.user.id;

    const banquetes = await Banquete.find({ propietario_id }).sort({
      fecha_creacion: -1,
    });

    res.json({
      success: true,
      banquetes, // El frontend espera { banquetes: [...] }
    });
  });

  // Obtener todos los banquetes (público)
  static getAll = catchAsync(async (req, res, next) => {
    const banquetes = await Banquete.find().sort({ fecha_creacion: -1 });
    res.json({
      success: true,
      data: banquetes,
    });
  });

  // Actualizar banquete
  static update = catchAsync(async (req, res, next) => {
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
      return next(new AppError("Banquete no encontrado o no tienes permiso para editarlo", 404));
    }

    // Actualizar campos de texto
    if (nombre) banquete.nombre = nombre;
    if (direccion) banquete.direccion = direccion;
    if (capacidad) banquete.capacidad = capacidad;
    if (descripcion) banquete.descripcion = descripcion;
    if (precio_base) banquete.precio_base = precio_base;

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
  });

  // Eliminar banquete
  static delete = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const propietario_id = req.user.id;

    const banquete = await Banquete.findOne({ _id: id, propietario_id });

    if (!banquete) {
      return next(new AppError("Banquete no encontrado o no tienes permiso para eliminarlo", 404));
    }

    // Ya no hay archivos en disco que borrar, las imágenes se eliminan con el documento
    await Banquete.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Banquete eliminado exitosamente",
    });
  });

  // Obtener un banquete específico
  static getById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const banquete = await Banquete.findById(id);

    if (!banquete) {
      return next(new AppError("Banquete no encontrado", 404));
    }

    res.json({
      success: true,
      data: banquete,
    });
  });
}

module.exports = BanqueteController;
