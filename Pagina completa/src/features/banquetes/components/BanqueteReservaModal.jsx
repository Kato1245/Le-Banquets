import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import banqueteDisponibilidadService from "../services/banqueteDisponibilidadService";
import reservasService from "../services/reservasService";
import { getImageUrl } from "../../../shared/utils/imageUtils";

const BanqueteReservaModal = ({ banquete, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    detalles: "",
    monto: banquete?.precio_base || 0,
  });

  useEffect(() => {
    if (isOpen && banquete) {
      fetchFechasOcupadas();
      setFormData(prev => ({ ...prev, monto: banquete.precio_base || 0 }));
    }
  }, [isOpen, banquete]);

  const fetchFechasOcupadas = async () => {
    try {
      const resp = await banqueteDisponibilidadService.getFechasOcupadas(banquete._id);
      if (resp.success) {
        setFechasOcupadas(resp.data);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad", error);
    }
  };

  if (!isOpen || !banquete) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (dateStr) => {
    if (fechasOcupadas.includes(dateStr)) return; // bloqueado
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    // Para que compare bien horas locales
    const selLocal = new Date(selected.getTime() + selected.getTimezoneOffset() * 60000);
    if (selLocal < today) return; // pasado

    setFormData(prev => ({ ...prev, fecha: dateStr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fecha || !formData.hora) {
      toast.error("Seleccione una fecha y hora válidas.");
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

  return (
    <dialog open className="modal modal-open items-center justify-center p-4 z-[200]">
      <div className="modal-box max-w-7xl p-0 overflow-hidden bg-base-100 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-primary/10 flex flex-col lg:flex-row min-h-[550px] animate-in zoom-in-95 duration-300">
        
        {/* Lado Izquierdo: Calendario Interactivo */}
        <div className="lg:w-[55%] relative hidden lg:flex flex-col bg-neutral/5 border-r border-base-content/5 p-12">
          <div className="mb-8">
            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2 text-base-content">
              Disponibilidad
            </h3>
            <p className="text-[10px] opacity-50 font-bold tracking-widest uppercase">
              Selecciona tu fecha ideal en el calendario
            </p>
          </div>

          <div className="bg-base-100 rounded-[2rem] p-8 shadow-xl border border-base-content/5 flex-1 flex flex-col">
            <header className="flex justify-between items-center mb-8">
              <button type="button" onClick={prevMonth} className="btn btn-circle btn-ghost btn-sm transition-all hover:bg-primary/10 hover:text-primary">←</button>
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">
                {currentMonth.toLocaleString("es-ES", { month: "long", year: "numeric" })}
              </h4>
              <button type="button" onClick={nextMonth} className="btn btn-circle btn-ghost btn-sm transition-all hover:bg-primary/10 hover:text-primary">→</button>
            </header>

            <div className="grid grid-cols-7 gap-3 text-center mb-6">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(d => (
                <div key={d} className="text-[11px] font-black uppercase opacity-30 tracking-widest">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3 flex-1">
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              {[...Array(days)].map((_, i) => {
                const day = i + 1;
                const dDate = new Date(year, month, day);
                const dDateLocal = new Date(dDate.getTime() - dDate.getTimezoneOffset() * 60000);
                const dateStr = dDateLocal.toISOString().split("T")[0];
                
                const isPast = dateStr < todayStr;
                const isOccupied = fechasOcupadas.includes(dateStr);
                const isSelected = formData.fecha === dateStr;

                let btnClass = "btn btn-ghost btn-md btn-circle w-full h-12 md:h-14 text-sm font-bold transition-all ";
                
                if (isPast) {
                  btnClass += "opacity-20 cursor-not-allowed";
                } else if (isOccupied) {
                  btnClass += "bg-error/10 text-error cursor-not-allowed line-through hover:bg-error/20";
                } else if (isSelected) {
                  btnClass += "bg-primary text-primary-content font-black shadow-xl scale-110 border-none ring-4 ring-primary/20";
                } else {
                  btnClass += "bg-success/5 text-success hover:bg-success hover:text-white border border-success/20";
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
                <span className="text-[9px] font-black uppercase opacity-40">Libre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error ring-4 ring-error/20"></div>
                <span className="text-[9px] font-black uppercase opacity-40">Ocupado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="flex-1 p-8 md:p-12 lg:p-14 relative bg-base-100 flex flex-col overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 hover:bg-base-200 transition-all hover:scale-110"
          >
            ✕
          </button>

          <header className="mb-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Hora de Inicio</span></label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10">🕒</span>
                  <input
                    type="time"
                    name="hora"
                    required
                    className="input input-bordered w-full h-14 pl-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-black text-[13px] tracking-[0.2em] transition-all"
                    value={formData.hora}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Inversión Base</span></label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10">💰</span>
                  <input
                    type="text"
                    readOnly
                    className="input input-bordered w-full h-14 pl-14 rounded-2xl bg-base-200/10 border-base-200 text-primary font-black text-[14px] tracking-widest opacity-80"
                    value={`$${formData.monto.toLocaleString("es-CO")}`}
                  />
                </div>
              </div>
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
                disabled={loading || !formData.fecha}
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
