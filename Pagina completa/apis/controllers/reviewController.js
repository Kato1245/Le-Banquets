const Review = require("../models/Review");
const Banquete = require("../models/Banquete");

exports.create = async (req, res) => {
  try {
    const { banquete_id, calificacion, comentario } = req.body;
    const usuario_id = req.user.id;

    // Optional: Validar que el usuario tenga una reserva en estado "completada" o "confirmada" pasada en este banquete.
    // ... Por simplicidad y UX, a veces se permite calificar si ya asistieron. Aquí, confiaremos en la UI por ahora o validamos si es necesario.

    const newReview = new Review({
      usuario_id,
      banquete_id,
      calificacion,
      comentario,
    });

    await newReview.save();

    // Actualizar el banquete para agregar la review si se prefiere (opcional)
    
    res.status(201).json({
      success: true,
      message: "Reseña guardada exitosamente",
      data: newReview,
    });
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    res.status(500).json({ success: false, message: "Error al crear la reseña" });
  }
};

exports.getByBanquete = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ banquete_id: id })
      .populate("usuario_id", "nombre correo foto")
      .sort({ fecha: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error al obtener las reseñas:", error);
    res.status(500).json({ success: false, message: "Error al obtener las reseñas" });
  }
};
