import { useState, useEffect } from "react";
import reservasService from "../services/reservasService";
import citasService from "../services/citasService";
import toast from "react-hot-toast";

// Parsea una fecha ISO de MongoDB creando un Date en hora LOCAL para evitar
// el desfase UTC → local que movía los eventos al día anterior.
const parseFechaLocal = (fechaISO) => {
  if (!fechaISO) return new Date();
  const [year, month, day] = new Date(fechaISO).toISOString().split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day); // mes es 0-indexado
};

const getEventColor = (estado) => {
  if (estado === "confirmada") return "bg-success"; // Verde para aprobado
  if (estado === "cancelada") return "bg-error"; // Rojo para rechazado
  return "bg-[#9333ea]"; // Morado para pendiente
};


const OwnerCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDateData, setEditDateData] = useState({ fecha: "", hora: "" });

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      const [reservas, citas] = await Promise.all([
        reservasService.getAgendaPropietario(),
        citasService.getCitasRecibidas(),
      ]);

      const formatedReservas = reservas.map((r) => ({
        id: r._id,
        title: `Reserva: ${r.banquete_id?.nombre || "N/A"}`,
        date: parseFechaLocal(r.fecha),
        hora: r.hora,
        type: "reserva",
        color: getEventColor(r.estado), // Color según estado
        user: r.usuario_id?.nombre,
        email: r.usuario_id?.email,
        telefono: r.usuario_id?.telefono || "No provisto",
        banquete: r.banquete_id?.nombre,
        estado: r.estado,
        detalles: r.detalles,
        motivo_rechazo: r.motivo_rechazo,
        direccion:
          r.banquete_id?.direccion ||
          r.banquete_id?.direccion ||
          "No especificada",
        raw: r,
      }));

      const formatedCitas = citas.map((c) => ({
        id: c._id,
        title: `Cita: ${c.banquete_id?.nombre || "N/A"}`,
        date: parseFechaLocal(c.fecha_sugerida),
        hora: c.hora_sugerida,
        type: "cita",
        color: getEventColor(c.estado), // Color según estado
        user: c.usuario_id?.nombre,
        email: c.usuario_id?.email,
        telefono: "No provisto",
        banquete: c.banquete_id?.nombre,
        estado: c.estado,
        detalles: c.mensaje,
        motivo_rechazo: c.motivo_rechazo,
        direccion:
          c.banquete_id?.direccion ||
          c.banquete_id?.direccion ||
          "No especificada",
        raw: c,
      }));

      setEvents([...formatedReservas, ...formatedCitas]);
    } catch (error) {
      toast.error("Error al cargar la agenda");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (estado) => {
    if (estado === "cancelada" && !motivoRechazo.trim()) {
      toast.error("Por favor, ingresa un motivo para el rechazo.");
      return;
    }

    try {
      if (selectedEvent.type === "reserva") {
        await reservasService.actualizarEstado(
          selectedEvent.id,
          estado,
          motivoRechazo,
        );
      } else {
        await citasService.actualizarEstado(
          selectedEvent.id,
          estado,
          motivoRechazo,
        );
      }
      toast.success(`Estado actualizado a ${estado}`);
      setSelectedEvent(null);
      setMotivoRechazo("");
      setIsRejecting(false);
      fetchAgenda();
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  const handleUpdateDate = async () => {
    if (!editDateData.fecha || !editDateData.hora) {
      toast.error("Por favor completa la nueva fecha y hora.");
      return;
    }

    try {
      await reservasService.modificarFecha(
        selectedEvent.id,
        editDateData.fecha,
        editDateData.hora
      );
      toast.success("Fecha de reserva modificada exitosamente");
      setIsEditingDate(false);
      setSelectedEvent(null);
      fetchAgenda();
    } catch (error) {
      toast.error("Error al modificar la fecha");
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const { firstDay, days } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  return (
    <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 shadow-xl overflow-hidden p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            Agenda del Mes
          </h2>
          <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
            {currentDate.toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="btn btn-circle btn-ghost btn-sm"
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            className="btn btn-circle btn-ghost btn-sm"
          >
            →
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px bg-base-300 rounded-2xl overflow-hidden border border-base-300">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="bg-base-200 py-4 text-center text-[10px] font-black uppercase tracking-widest opacity-40"
          >
            {day}
          </div>
        ))}

        {[...Array(firstDay)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="bg-base-100 min-h-[120px] opacity-20"
          ></div>
        ))}

        {[...Array(days)].map((_, i) => {
          const day = i + 1;
          const dayEvents = events.filter(
            (e) =>
              e.date.getDate() === day &&
              e.date.getMonth() === currentDate.getMonth() &&
              e.date.getFullYear() === currentDate.getFullYear(),
          );

          // Si hay una reserva confirmada, anula visualmente las demás cosas ese día
          const confirmedReserva = dayEvents.find(e => e.type === "reserva" && e.estado === "confirmada");

          if (confirmedReserva) {
            return (
              <div
                key={day}
                className="bg-success text-success-content min-h-[120px] p-2 hover:brightness-110 transition-all border-t border-l border-base-300 relative cursor-pointer flex flex-col items-center justify-center overflow-hidden group shadow-inner"
                onClick={() => setSelectedEvent(confirmedReserva)}
                title={`Reserva Confirmada: ${confirmedReserva.banquete} - ${confirmedReserva.user}`}
              >
                <div className="absolute top-2 left-2 text-[10px] font-black opacity-50 z-10">{day}</div>
                <div className="absolute inset-0 bg-black/10 scale-0 group-hover:scale-100 transition-transform rounded-full origin-center opacity-0 group-hover:opacity-100 duration-500"></div>
                <span className="text-3xl mb-1 drop-shadow-sm z-10">🎉</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight z-10 w-full px-1 truncate">
                  Reservado
                </span>
                <span className="text-[8px] font-bold uppercase opacity-80 mt-1 truncate w-full text-center z-10 px-1">
                  {confirmedReserva.user}
                </span>
              </div>
            );
          }

          return (
            <div
              key={day}
              className="bg-base-100 min-h-[120px] p-2 flex flex-col hover:bg-base-200/50 transition-colors border-t border-l border-base-300"
            >
              <div className="text-xs font-bold opacity-30 mb-1">{day}</div>
              <div className="flex-1 space-y-1">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`${evt.color} text-white p-2 rounded-lg cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex items-center gap-2 min-w-0 ${
                      evt.type === "reserva" 
                        ? "border-l-[3px] border-l-white/40 opacity-100" 
                        : "opacity-80 border-dashed border border-base-100/30"
                    }`}
                    onClick={() => setSelectedEvent(evt)}
                    title={`${evt.title} - ${evt.user}`}
                  >
                    <span className="text-sm shrink-0 drop-shadow-sm">{evt.type === "reserva" ? "🎊" : "👤"}</span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-tighter leading-none truncate">
                        {evt.title.replace(/^(Reserva|Cita):\s*/i, "")}
                      </span>
                      <span className="text-[7px] font-bold opacity-80 truncate mt-1 tracking-widest uppercase">
                        {evt.type === "reserva" ? "Reserva" : "Cita"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6 bg-base-200/40 p-4 rounded-3xl border border-base-content/5">
        <div className="flex gap-6 border-r border-base-content/10 pr-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Aprobados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Rechazados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#9333ea]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Pendientes
            </span>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎊</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Reserva de Evento
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">👤</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Visita / Cita
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🎉</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Día Finalizado / Completamente Reservado
            </span>
          </div>
        </div>
      </div>

      {/* ── Modal de Detalles ── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-base-100 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-base-content/5 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`badge ${selectedEvent.color} text-white font-black uppercase tracking-tighter text-[10px] py-3 px-4`}
                >
                  {selectedEvent.type}
                </div>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setIsRejecting(false);
                    setMotivoRechazo("");
                  }}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-2 uppercase italic flex justify-between items-center">
                <span>{selectedEvent.banquete}</span>
                {selectedEvent.type === "reserva" && !isEditingDate && !isRejecting && (
                  <button
                    onClick={() => {
                      setIsEditingDate(true);
                      setEditDateData({
                        fecha: selectedEvent.date.toISOString().split("T")[0],
                        hora: selectedEvent.hora || "",
                      });
                    }}
                    className="btn btn-sm btn-ghost text-xs text-primary"
                  >
                    Reprogramar
                  </button>
                )}
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-30 leading-none">
                      Cliente
                    </p>
                    <p className="font-bold text-sm">{selectedEvent.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-30 leading-none">
                      Contacto
                    </p>
                    <p className="font-bold text-sm">{selectedEvent.email}</p>
                    {selectedEvent.telefono && (
                      <p className="text-[10px] opacity-50">
                        {selectedEvent.telefono}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-30 leading-none">
                      Dirección del Banquete
                    </p>
                    <p className="font-bold text-sm leading-tight">
                      {selectedEvent.direccion}
                    </p>
                  </div>
                </div>
                {isEditingDate ? (
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 space-y-3">
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-2">Nueva Fecha y Hora</p>
                    <input
                      type="date"
                      value={editDateData.fecha}
                      onChange={(e) => setEditDateData({ ...editDateData, fecha: e.target.value })}
                      className="input input-sm input-bordered w-full rounded-xl"
                    />
                    <input
                      type="time"
                      value={editDateData.hora}
                      onChange={(e) => setEditDateData({ ...editDateData, hora: e.target.value })}
                      className="input input-sm input-bordered w-full rounded-xl"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button onClick={() => setIsEditingDate(false)} className="btn btn-xs btn-ghost rounded-lg">Cancelar</button>
                      <button onClick={handleUpdateDate} className="btn btn-xs btn-primary rounded-lg text-[10px]">Guardar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="text-[10px] uppercase font-black opacity-30 leading-none">
                        Fecha y Hora
                      </p>
                      <p className="font-bold text-sm">
                        {selectedEvent.date.toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-xs opacity-60 font-medium">
                        A las {selectedEvent.hora}
                      </p>
                    </div>
                  </div>
                )}
                {selectedEvent.detalles && (
                  <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
                    <p className="text-[10px] uppercase font-black opacity-30 mb-1">
                      Nota del cliente
                    </p>
                    <p className="text-xs font-medium leading-relaxed italic">
                      "{selectedEvent.detalles}"
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-base-content/5">
                  <p className="text-[10px] uppercase font-black opacity-30 mb-2">
                    Estado actual
                  </p>
                  <div
                    className={`badge badge-outline font-bold uppercase tracking-widest text-[9px] py-3 px-4 ${
                      selectedEvent.estado === "confirmada"
                        ? "badge-success"
                        : selectedEvent.estado === "cancelada"
                          ? "badge-error"
                          : "badge-warning"
                    }`}
                  >
                    {selectedEvent.estado}
                  </div>
                  {selectedEvent.motivo_rechazo && (
                    <div className="mt-3 text-error text-[10px] font-bold">
                      Motivo rechazo: {selectedEvent.motivo_rechazo}
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.estado === "pendiente" && !isRejecting && !isEditingDate && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateStatus("confirmada")}
                    className="btn btn-primary rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => setIsRejecting(true)}
                    className="btn btn-outline btn-error rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {isRejecting && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="text-[10px] uppercase font-black opacity-40 mb-2 block">
                      Razón del rechazo
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full rounded-2xl text-xs font-medium focus:border-error"
                      placeholder="Indica al cliente por qué no puedes aceptar..."
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="btn btn-ghost rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus("cancelada")}
                      className="btn btn-error rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg"
                    >
                      Confirmar Rechazo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCalendar;
