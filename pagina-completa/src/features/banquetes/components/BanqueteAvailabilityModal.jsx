import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import banqueteDisponibilidadService from "../services/banqueteDisponibilidadService";

const BanqueteAvailabilityModal = ({ banquete, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isOpen && banquete) {
      fetchFechasOcupadas();
    }
  }, [isOpen, banquete]);

  const fetchFechasOcupadas = async () => {
    try {
      setLoading(true);
      const resp = await banqueteDisponibilidadService.getFechasOcupadas(banquete._id);
      if (resp.success) {
        setFechasOcupadas(resp.data);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad", error);
      toast.error("Error al cargar los días bloqueados.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateToggle = async (dateStr) => {
    try {
      const resp = await banqueteDisponibilidadService.toggleBloquearFecha(banquete._id, dateStr);
      if (resp.success) {
        setFechasOcupadas(resp.data);
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error("No se pudo actualizar la disponibilidad.");
    }
  };

  if (!isOpen || !banquete) return null;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days, year, month };
  };

  const { firstDay, days, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-base-100 rounded-[3rem] shadow-2xl border border-base-content/5 overflow-hidden max-w-2xl w-full p-8 relative flex flex-col items-center">
        
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 hover:bg-base-200"
        >
          ✕
        </button>

        <header className="mb-8 w-full">
          <div className="badge badge-warning py-3 px-4 rounded-xl mb-4 font-black uppercase tracking-[0.2em] text-[10px] shadow-sm border-none text-warning-content">
            Administración de Agendas
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">
            Bloquear Días
          </h2>
          <p className="text-sm opacity-40 font-bold tracking-widest uppercase truncate max-w-[80%]">
            {banquete.nombre}
          </p>
        </header>

        <div className="bg-base-200/50 rounded-3xl p-8 w-full max-w-lg shadow-inner border border-base-300">
          <header className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="btn btn-circle btn-ghost btn-sm">←</button>
            <h4 className="text-lg font-black uppercase tracking-widest">
              {currentMonth.toLocaleString("es-ES", { month: "long", year: "numeric" })}
            </h4>
            <button onClick={nextMonth} className="btn btn-circle btn-ghost btn-sm">→</button>
          </header>

          <div className="grid grid-cols-7 gap-1 text-center mb-4 border-b border-base-content/10 pb-2">
            {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(d => (
              <div key={d} className="text-[10px] font-black uppercase opacity-40">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
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

              let btnClass = "btn btn-ghost btn-sm btn-circle w-10 h-10 text-xs font-bold transition-all mx-auto ";
              
              if (isPast) {
                btnClass += "opacity-20 cursor-not-allowed hidden md:block";
              } else if (isOccupied) {
                btnClass += "bg-error text-white hover:bg-error/80 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110";
              } else {
                btnClass += "bg-success/10 text-success hover:bg-success hover:text-white";
              }

              // Ocultar los pasados para simplificar visualmente o dejarlos gris.
              return (
                <button
                  key={day}
                  disabled={isPast}
                  title={isOccupied ? "Clic para desbloquear" : "Clic para bloquear día completo"}
                  className={btnClass}
                  onClick={() => handleDateToggle(dateStr)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-base-content/10 flex justify-between items-center text-[10px] font-black uppercase opacity-60 tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success/20 border border-success"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span>Bloqueado</span>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="btn w-full max-w-lg mt-6 rounded-[2rem] font-black uppercase tracking-widest btn-neutral">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default BanqueteAvailabilityModal;
