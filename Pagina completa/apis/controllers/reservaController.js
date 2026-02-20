const reservaService = require("../services/reservaService");

const crearReserva = async (req, res) => {
  try {
    const reserva = await reservaService.crearReserva(req.body);

    res.status(201).json({
      success: true,
      data: reserva,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const obtenerReservasPorBanquete = async (req, res) => {
  try {
    const reservas = await reservaService.obtenerReservasPorBanquete(
      req.params.id
    );

    res.json({
      success: true,
      data: reservas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reservas",
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReservasPorBanquete,
};
