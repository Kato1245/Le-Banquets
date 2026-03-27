import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import banqueteDisponibilidadService from "../services/banqueteDisponibilidadService";
import reservasService from "../services/reservasService";

const HORARIOS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const BanqueteReservaModal = ({ banquete, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState({
    fechasOcupadasCompletas: [],
    horasOcupadasPorDia: {},
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    detalles: "",
    monto: banquete?.precio_base || 0,
    tipo_evento: "",
  });

  useEffect(() => {
    if (isOpen && banquete) {
      fetchDisponibilidad();
      // Resetear al abrir
      setFormData({
        fecha: "",
        hora: "",
        detalles: "",
        monto: banquete.precio_base || 0,
        tipo_evento: "",
      });
    }
  }, [isOpen, banquete]);

  const fetchDisponibilidad = async () => {
    try {
      // Usamos el servicio de disponibilidad de citas que ya maneja horas, 
      // o el de reservas si el backend lo soporta igual.
      // Por ahora usamos getDisponibilidadCitas para obtener la estructura de horas.
      const resp = await banqueteDisponibilidadService.getDisponibilidadCitas(banquete._id);
      if (resp.success) {
        setDisponibilidad(resp.data);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad de reserva", error);
    }
  };

  if (!isOpen || !banquete) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (dateStr) => {
    if (disponibilidad.fechasOcupadasCompletas.includes(dateStr)) return; // bloqueado
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Para que compare bien horas locales
    const selLocal = new Date(selected.getTime() + selected.getTimezoneOffset() * 60000);
    if (selLocal < today) return; // pasado

    setFormData(prev => ({ ...prev, fecha: dateStr, hora: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fecha || !formData.hora) {
      toast.error("Seleccione una fecha y hora válidas.");
      return;
    }

    // Validar que la fecha+hora seleccionada no sea en el pasado al momento de hacer submit
    const [hh, mm] = formData.hora.split(":").map(Number);
    const [yy, mo, dd] = formData.fecha.split("-").map(Number);
    const fechaReserva = new Date(yy, mo - 1, dd, hh, mm, 0);
    if (fechaReserva <= new Date()) {
      toast.error("La fecha y hora seleccionadas ya pasaron. Por favor elige un nuevo horario.");
      return;
    }

    try {
      setLoading(true);
      const reservaData = {
        banquete_id: banquete._id,
        ...formData,
      };
      await reservasService.createReserva(reservaData);
      toast.success("¡Reserva confirmada exitosamente!");
      onClose();
    } catch (error) {
      toast.error(
        error.friendlyMessage || "Error al procesar la reserva",
      );
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days, year, month };
  };

  const { firstDay, days, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const horasOcupadasHoy = formData.fecha
    ? (disponibilidad.horasOcupadasPorDia[formData.fecha] || [])
    : [];

  return (
    <dialog open className="modal modal-open items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
      <div className="modal-box relative w-full sm:w-11/12 max-w-7xl h-auto max-h-[96vh] sm:max-h-[90vh] p-0 mx-auto overflow-y-auto lg:overflow-hidden bg-base-100 rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row lg:min-h-[550px] animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 lg:right-8 lg:top-8 z-50 hover:bg-base-200 transition-all hover:scale-110"
        >
          ✕
        </button>

        {/* Lado Izquierdo: Calendario Interactivo */}
        <div className="w-full lg:w-[55%] flex-none relative flex flex-col bg-neutral/5 border-b lg:border-b-0 lg:border-r border-base-content/5 p-4 sm:p-6 lg:p-12 items-center sm:items-stretch overflow-x-hidden">
          <div className="mb-4 lg:mb-8 text-center sm:text-left w-full px-4">
            <h3 className="text-xl sm:text-3xl font-black tracking-tighter uppercase leading-none mb-2 text-base-content">
              Disponibilidad
            </h3>
            <p className="text-[10px] opacity-50 font-bold tracking-widest uppercase">
              Selecciona tu fecha ideal en el calendario
            </p>
          </div>

          <div className="bg-base-100 rounded-2xl sm:rounded-[2rem] p-2 sm:p-6 lg:p-8 shadow-xl border border-base-content/5 flex-1 flex flex-col w-full max-w-[325px] sm:max-w-none mx-auto">
            <header className="flex justify-between items-center mb-4 lg:mb-8">
              <button type="button" onClick={prevMonth} className="btn btn-circle btn-ghost btn-sm transition-all hover:bg-primary/10 hover:text-primary">←</button>
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">
                {currentMonth.toLocaleString("es-ES", { month: "long", year: "numeric" })}
              </h4>
              <button type="button" onClick={nextMonth} className="btn btn-circle btn-ghost btn-sm transition-all hover:bg-primary/10 hover:text-primary">→</button>
            </header>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 text-center mb-4 lg:mb-6 w-full">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(d => (
                <div key={d} className="text-[10px] sm:text-[11px] font-black uppercase opacity-70 tracking-widest truncate">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 flex-1 justify-items-center w-full">
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              {[...Array(days)].map((_, i) => {
                const day = i + 1;
                const dDate = new Date(year, month, day);
                const dDateLocal = new Date(dDate.getTime() - dDate.getTimezoneOffset() * 60000);
                const dateStr = dDateLocal.toISOString().split("T")[0];

                const isPast = dateStr < todayStr;
                const isOccupied = disponibilidad.fechasOcupadasCompletas.includes(dateStr);
                const isSelected = formData.fecha === dateStr;

                let btnClass = "flex items-center justify-center w-8 h-8 sm:w-full aspect-square text-[10px] sm:text-sm lg:text-base font-black rounded-[50%] transition-all select-none ";

                if (isPast) {
                  btnClass += "text-gray-500 bg-base-200 opacity-60 cursor-not-allowed";
                } else if (isOccupied) {
                  btnClass += "bg-error/20 text-black dark:text-error cursor-not-allowed line-through hover:bg-error/30";
                } else if (isSelected) {
                  btnClass += "bg-primary text-primary-content shadow-xl scale-110 ring-4 ring-primary/20";
                } else {
                  btnClass += "bg-success/20 text-black dark:text-white hover:bg-success hover:text-white border-2 border-success/30 shadow-sm cursor-pointer";
                }

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast || isOccupied}
                    className={btnClass}
                    onClick={() => handleDateSelect(dateStr)}
                    title={isOccupied ? "Fecha no disponible" : "Disponible"}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success ring-4 ring-success/20"></div>
                <span className="text-[9px] font-black uppercase opacity-80">Libre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error ring-4 ring-error/20"></div>
                <span className="text-[9px] font-black uppercase opacity-80">Ocupado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-14 relative bg-base-100 flex flex-col lg:overflow-y-auto lg:max-h-[90vh]">
          <header className="mb-8 mt-4 lg:mt-0">
            <div className="inline-flex items-center gap-2 badge badge-primary bg-primary/10 text-primary py-4 px-5 rounded-xl mb-4 font-black uppercase tracking-[0.2em] text-[10px] shadow-sm border-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Reserva Oficial
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 text-base-content">
              Asegura tu Fecha
            </h2>
            <p className="text-sm opacity-50 font-bold tracking-widest uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-base-content/20"></span>
              {banquete.nombre}
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex flex-col flex-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Fecha Elegida</span></label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10 transition-transform">📅</span>
                  <input
                    type="date"
                    name="fecha"
                    required
                    className="input input-bordered w-full h-14 pl-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-black uppercase text-[11px] tracking-widest transition-all lg:pointer-events-none lg:opacity-70"
                    value={formData.fecha}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">
                    Tipo de Evento
                  </span>
                </label>
                <div className="dropdown w-full">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost w-full h-14 pl-14 pr-4 justify-start rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/50 hover:bg-base-200 transition-all font-black uppercase text-[11px] tracking-widest relative group"
                  >
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10 transition-transform">
                      ✨
                    </span>
                    <span className={formData.tipo_evento ? "text-base-content" : "opacity-30"}>
                      {formData.tipo_evento || "Seleccionar evento"}
                    </span>
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
                      ▼
                    </span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[210] menu p-3 shadow-2xl bg-base-100 rounded-[1.5rem] w-full border border-base-content/10 mt-2 animate-in fade-in zoom-in-95 duration-200"
                  >
                    {banquete.eventos_que_ofrece?.map((evento, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, tipo_evento: evento }));
                            if (document.activeElement) document.activeElement.blur();
                          }}
                          className={`hover:bg-primary hover:text-primary-content font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-xl transition-all mb-1 ${formData.tipo_evento === evento ? "bg-primary/10 text-primary" : ""}`}
                        >
                          {evento}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Horarios Disponibles</span></label>
              {!formData.fecha ? (
                <div className="p-8 bg-base-200/20 rounded-2xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center group transition-all hover:border-primary/30">
                  <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center mb-3 opacity-50 group-hover:scale-110 transition-transform">📍</div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest max-w-[200px]">Selecciona una fecha en el calendario para ver horarios</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {HORARIOS.map((h) => {
                    const isOccupied = horasOcupadasHoy.includes(h);
                    const isSelected = formData.hora === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        disabled={isOccupied}
                        className={`btn btn-sm px-1 rounded-xl h-10 sm:h-12 font-black text-[10px] sm:text-[11px] tracking-tighter transition-all
                          ${isOccupied ? "btn-disabled bg-error/10 text-red-700 dark:text-error opacity-60 cursor-not-allowed line-through" : ""}
                          ${isSelected ? "bg-primary text-primary-content shadow-xl scale-[1.05] border-none ring-4 ring-primary/20" : ""}
                          ${!isOccupied && !isSelected ? "bg-base-200/50 border-base-300 hover:border-primary hover:text-primary hover:scale-105" : ""}
                        `}
                        onClick={() => setFormData(p => ({ ...p, hora: h }))}
                      >
                        {h}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Solicitudes Especiales</span></label>
              <textarea
                name="detalles"
                className="textarea textarea-bordered w-full h-32 rounded-3xl bg-base-200/30 border-base-300 focus:textarea-primary font-medium p-6 leading-relaxed resize-none transition-all placeholder:opacity-30 text-sm"
                placeholder="Indica adaptaciones, número aproximado de invitados o configuraciones preferidas..."
                value={formData.detalles}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-6 mt-auto">
              <button
                type="submit"
                disabled={loading || !formData.fecha || !formData.hora}
                className="btn btn-primary w-full h-16 rounded-2xl normal-case text-lg font-black shadow-[0_20px_40px_-10px_rgba(var(--p),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--p),0.5)] transition-all hover:scale-[1.02] active:scale-95 border-none group disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <div className="flex items-center gap-3">
                    CONFIRMAR RESERVA AHORA
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
    </dialog>
  );
};

export default BanqueteReservaModal;
