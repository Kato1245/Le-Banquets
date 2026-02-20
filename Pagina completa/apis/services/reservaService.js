const Reserva = require("../models/Reserva");

const verificarDisponibilidad = async (
  banqueteId,
  fecha,
  horaInicio,
  horaFin
) => {
  const reservasExistentes = await Reserva.find({
    banqueteId,
    fecha,
    estado: { $in: ["pendiente", "aprobada", "modificada"] },
  });

  const conflicto = reservasExistentes.find((reserva) => {
    return (
      horaInicio < reserva.horaFin &&
      horaFin > reserva.horaInicio
    );
  });

  return !conflicto;
};

const crearReserva = async (data) => {
  const disponible = await verificarDisponibilidad(
    data.banqueteId,
    data.fecha,
    data.horaInicio,
    data.horaFin
  );

  if (!disponible) {
    throw new Error("El banquete no está disponible en ese horario");
  }

  const reserva = await Reserva.create(data);
  return reserva;
};

const obtenerReservasPorBanquete = async (banqueteId) => {
  return await Reserva.find({ banqueteId });
};

module.exports = {
  crearReserva,
  obtenerReservasPorBanquete,
};
