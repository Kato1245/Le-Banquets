import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import banqueteDisponibilidadService from "../services/banqueteDisponibilidadService";
import citasService from "../services/citasService";

const HORARIOS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const BanqueteCitaModal = ({ banquete, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState({
    fechasOcupadasCompletas: [],
    horasOcupadasPorDia: {},
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    fecha_sugerida: "",
    hora_sugerida: "",
    mensaje: "",
  });

  useEffect(() => {
    if (isOpen && banquete) {
      fetchDisponibilidad();
      // Resetear al abrir
      setFormData({
        fecha_sugerida: "",
        hora_sugerida: "",
        mensaje: "",
      });
    }
  }, [isOpen, banquete]);

  const fetchDisponibilidad = async () => {
    try {
      const resp = await banqueteDisponibilidadService.getDisponibilidadCitas(banquete._id);
      if (resp.success) {
        setDisponibilidad(resp.data);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad de citas", error);
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
    today.setHours(0,0,0,0);
    // Para que compare bien horas locales
    const selLocal = new Date(selected.getTime() + selected.getTimezoneOffset() * 60000);
    if (selLocal < today) return; // pasado

    setFormData(prev => ({ ...prev, fecha_sugerida: dateStr, hora_sugerida: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fecha_sugerida || !formData.hora_sugerida) {
      toast.error("Seleccione una fecha y hora válidas.");
      return;
    }
    try {
      setLoading(true);
      const citaData = {
        banquete_id: banquete._id,
        ...formData,
      };
      await citasService.createCita(citaData);
      toast.success("¡Solicitud de cita enviada correctamente!");
      onClose();
    } catch (error) {
      toast.error(
        error.friendlyMessage || "Error al enviar la solicitud de cita"
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
  const horasOcupadasHoy = formData.fecha_sugerida 
    ? (disponibilidad.horasOcupadasPorDia[formData.fecha_sugerida] || []) 
    : [];

  return (
    <dialog open className="modal modal-open items-center justify-center p-4 z-[200]">
      <div className="modal-box max-w-6xl p-0 overflow-hidden bg-base-100 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col lg:flex-row min-h-[650px] animate-in zoom-in-95 duration-300">
        
        {/* Lado Izquierdo: Calendario Interactivo */}
        <div className="lg:w-5/12 relative hidden lg:flex flex-col bg-neutral/5 border-r border-base-content/5 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1">
              Disponibilidad
            </h3>
            <p className="text-[10px] opacity-40 font-bold tracking-widest uppercase">
              Selecciona una fecha verde
            </p>
          </div>

          <div className="bg-base-100 rounded-3xl p-6 shadow-xl border border-base-content/5 flex-1 flex flex-col">
            <header className="flex justify-between items-center mb-6">
              <button type="button" onClick={prevMonth} className="btn btn-circle btn-ghost btn-sm">←</button>
              <h4 className="text-sm font-black uppercase tracking-widest">
                {currentMonth.toLocaleString("es-ES", { month: "long", year: "numeric" })}
              </h4>
              <button type="button" onClick={nextMonth} className="btn btn-circle btn-ghost btn-sm">→</button>
            </header>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(d => (
                <div key={d} className="text-[9px] font-black uppercase opacity-40">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 flex-1">
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
                const isSelected = formData.fecha_sugerida === dateStr;

                let btnClass = "btn btn-ghost btn-sm btn-circle w-full h-full text-xs font-bold transition-all ";
                
                if (isPast) {
                  btnClass += "opacity-20 cursor-not-allowed";
                } else if (isOccupied) {
                  btnClass += "bg-error/10 text-error cursor-not-allowed line-through hover:bg-error/20";
                } else if (isSelected) {
                  btnClass += "border-[3px] border-primary bg-primary/10 text-primary font-black shadow-lg scale-110";
                } else {
                  btnClass += "bg-success/10 text-success hover:bg-success hover:text-white";
                }

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPast || isOccupied}
                    className={btnClass}
                    onClick={() => handleDateSelect(dateStr)}
                    title={isOccupied ? "Día sin disponibilidad" : "Disponible"}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-[9px] font-black uppercase opacity-40">Libre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span className="text-[9px] font-black uppercase opacity-40">Día Reservado / Bloqueado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="flex-1 p-8 md:p-14 relative bg-base-100 flex flex-col overflow-y-auto">
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 hover:bg-base-200 transition-colors"
          >
            ✕
          </button>

          <header className="mb-10">
            <div className="badge badge-outline border-base-content/20 py-3 px-4 rounded-xl mb-4 font-black uppercase tracking-[0.2em] text-[9px] shadow-sm">
              Visita Guiada
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">
              Agendar Encuentro
            </h2>
            <p className="text-sm opacity-40 font-bold tracking-widest uppercase">
              Para conocer: {banquete.nombre}
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col flex-1"
          >
            {/* Si no ha seleccionado fecha en desktop, mensaje. En móvil mostramos el input */}
            <div className="form-control">
              <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Fecha Elegida</span></label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10 transition-transform">📅</span>
                <input
                  type="date"
                  name="fecha_sugerida"
                  required
                  className="input input-bordered w-full h-14 pl-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-black uppercase text-[10px] tracking-widest transition-all lg:pointer-events-none lg:opacity-70"
                  value={formData.fecha_sugerida}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  readOnly
                />
              </div>
              <span className="text-[9px] text-error mt-1 italic ml-2 lg:hidden">* Usa un dispositivo más grande para ver el mapa de disponibilidad completo.</span>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Horarios Disponibles</span></label>
              {!formData.fecha_sugerida ? (
                <div className="p-6 bg-base-200/30 rounded-2xl border border-dashed border-base-300 text-center">
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Selecciona una fecha en el calendario para ver horarios</p>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {HORARIOS.map((h) => {
                    const isOccupied = horasOcupadasHoy.includes(h);
                    const isSelected = formData.hora_sugerida === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        disabled={isOccupied}
                        className={`btn btn-sm rounded-xl h-10 font-black text-[10px] transition-all
                          ${isOccupied ? "btn-disabled bg-error/10 text-error opacity-40 cursor-not-allowed line-through" : ""}
                          ${isSelected ? "bg-primary text-primary-content shadow-lg scale-[1.05]" : ""}
                          ${!isOccupied && !isSelected ? "btn-outline border-base-300 hover:border-primary hover:text-primary" : ""}
                        `}
                        onClick={() => setFormData(p => ({...p, hora_sugerida: h}))}
                        title={isOccupied ? "Hora ocupada por otra cita" : "Disponible"}
                      >
                        {h}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="form-control mt-2">
              <label className="label py-1"><span className="label-text text-[10px] font-black uppercase opacity-40 tracking-widest">Detalles Adicionales (Opcional)</span></label>
              <textarea
                name="mensaje"
                className="textarea textarea-bordered w-full h-28 rounded-[2rem] bg-base-200/30 border-base-300 focus:textarea-primary font-medium px-6 py-4 leading-relaxed resize-none transition-all placeholder:opacity-30 text-sm"
                placeholder="Escribe aquí tu visión, dudas o requerimientos especiales antes de la visita..."
                value={formData.mensaje}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={loading || !formData.fecha_sugerida || !formData.hora_sugerida}
                className="btn btn-primary w-full h-16 rounded-[2rem] normal-case text-lg font-black shadow-[0_20px_40px_-10px_rgba(var(--p),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--p),0.5)] transition-all hover:scale-[1.01] active:scale-95 border-none group disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <div className="flex items-center gap-3">
                    SOLICITAR CITA AHORA
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

export default BanqueteCitaModal;

