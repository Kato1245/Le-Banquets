import { useState, useEffect } from "react";
import reservasService from "../services/reservasService";
import citasService from "../services/citasService";
import toast from "react-hot-toast";

const OwnerCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

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
                date: new Date(r.fecha),
                type: "reserva",
                color: "bg-error", // Rojo para reservas
                user: r.usuario_id?.nombre,
            }));

            const formatedCitas = citas.map((c) => ({
                id: c._id,
                title: `Cita: ${c.banquete_id?.nombre || "N/A"}`,
                date: new Date(c.fecha_sugerida),
                type: "cita",
                color: "bg-info", // Azul para citas
                user: c.usuario_id?.nombre,
            }));

            setEvents([...formatedReservas, ...formatedCitas]);
        } catch (error) {
            toast.error("Error al cargar la agenda");
        } finally {
            setLoading(false);
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
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="bg-base-100 rounded-[2.5rem] border border-base-content/5 shadow-xl overflow-hidden p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Agenda del Mes</h2>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                        {currentDate.toLocaleString("es-ES", { month: "long", year: "numeric" })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="btn btn-circle btn-ghost btn-sm">
                        ←
                    </button>
                    <button onClick={nextMonth} className="btn btn-circle btn-ghost btn-sm">
                        →
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 gap-px bg-base-300 rounded-2xl overflow-hidden border border-base-300">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="bg-base-200 py-4 text-center text-[10px] font-black uppercase tracking-widest opacity-40">
                        {day}
                    </div>
                ))}

                {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="bg-base-100 min-h-[120px] opacity-20"></div>
                ))}

                {[...Array(days)].map((_, i) => {
                    const day = i + 1;
                    const dayEvents = events.filter(
                        (e) =>
                            e.date.getDate() === day &&
                            e.date.getMonth() === currentDate.getMonth() &&
                            e.date.getFullYear() === currentDate.getFullYear()
                    );

                    return (
                        <div key={day} className="bg-base-100 min-h-[120px] p-2 hover:bg-base-200/50 transition-colors border-t border-l border-base-300">
                            <span className="text-xs font-bold opacity-30">{day}</span>
                            <div className="mt-1 space-y-1">
                                {dayEvents.map((evt) => (
                                    <div
                                        key={evt.id}
                                        className={`${evt.color} text-white text-[8px] p-2 rounded-lg font-black uppercase tracking-tighter truncate cursor-pointer hover:scale-105 transition-transform`}
                                        title={`${evt.title} - ${evt.user}`}
                                    >
                                        {evt.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-info"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Citas (Visitas)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Reservas (Eventos)</span>
                </div>
            </div>
        </div>
    );
};

export default OwnerCalendar;
