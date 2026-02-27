const reservaService = require("../services/reservaService");
const catchAsync = require("../utils/catchAsync");

const crearReserva = catchAsync(async (req, res, next) => {
  const reserva = await reservaService.crearReserva(req.body);

  res.status(201).json({
    success: true,
    data: reserva,
  });
});

const obtenerReservasPorBanquete = catchAsync(async (req, res, next) => {
  const reservas = await reservaService.obtenerReservasPorBanquete(
    req.params.id
  );

  res.json({
    success: true,
    data: reservas,
  });
});

module.exports = {
  crearReserva,
  obtenerReservasPorBanquete,
};
