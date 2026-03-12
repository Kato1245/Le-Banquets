import { useState, useEffect } from "react";
import reservasService from "../services/reservasService";
import citasService from "../services/citasService";
import toast from "react-hot-toast";

const OwnerCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

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

            // Helper para parsear fechas evitando desvíos de zona horaria
            const parseToLocal = (dateInput) => {
                const d = new Date(dateInput);
                // Si la fecha viene de la BD como UTC 00:00, la forzamos a mostrar el día correcto localmente
                return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
            };

            const formatedReservas = reservas
                .filter(r => r.estado !== "cancelada") // No mostrar canceladas según petición del usuario
                .map((r) => ({
                    id: r._id,
                    title: `${r.banquete_id?.nombre || "Evento"}`,
                    date: parseToLocal(r.fecha),
                    hora: r.hora,
                    type: "reserva",
                    color: "bg-error",
                    user: r.usuario_id?.nombre,
                    email: r.usuario_id?.email,
                    telefono: r.usuario_id?.telefono || "No provisto",
                    banquete: r.banquete_id?.nombre,
                    estado: r.estado,
                    detalles: r.detalles,
                    motivo_rechazo: r.motivo_rechazo,
                    direccion: r.banquete_id?.direccion || r.banquete_id?.ubicacion || "No especificada",
                    raw: r
                }));

            const formatedCitas = citas
                .filter(c => c.estado !== "cancelada") // No mostrar canceladas
                .map((c) => ({
                    id: c._id,
                    title: `${c.banquete_id?.nombre || "Visita"}`,
                    date: parseToLocal(c.fecha_sugerida),
                    hora: c.hora_sugerida,
                    type: "cita",
                    color: "bg-info",
                    user: c.usuario_id?.nombre,
                    email: c.usuario_id?.email,
                    telefono: "No provisto",
                    banquete: c.banquete_id?.nombre,
                    estado: c.estado,
                    detalles: c.mensaje,
                    motivo_rechazo: c.motivo_rechazo,
                    direccion: c.banquete_id?.direccion || c.banquete_id?.ubicacion || "No especificada",
                    raw: c
                }));

            setEvents([...formatedReservas, ...formatedCitas]);
        } catch (error) {
            toast.error("Error al cargar la agenda");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (estado) => {
        if (estado === 'cancelada' && !motivoRechazo.trim()) {
            toast.error("Por favor, ingresa un motivo para el rechazo.");
            return;
        }

        try {
            if (selectedEvent.type === 'reserva') {
                await reservasService.actualizarEstado(selectedEvent.id, estado, motivoRechazo);
            } else {
                await citasService.actualizarEstado(selectedEvent.id, estado, motivoRechazo);
            }
            toast.success(`Solicitud ${estado === 'cancelada' ? 'rechazada y eliminada' : 'actualizada'}`);
            setSelectedEvent(null);
            setMotivoRechazo("");
            setIsRejecting(false);
            fetchAgenda();
        } catch (error) {
            toast.error("Error al actualizar el estado");
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

    // Estadísticas para el encabezado
    const stats = {
        total: events.length,
        pendientes: events.filter(e => e.estado === 'pendiente').length,
        proximas: events.filter(e => e.date >= new Date().setHours(0,0,0,0)).length
    }

    return (
        <div className="bg-base-100 rounded-[3rem] border border-base-300 shadow-xl overflow-hidden p-8 md:p-12 animate-in fade-in duration-700">
            
            {/* Stats Section - Luxury Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-[2rem] border border-base-300 flex flex-col items-center text-center group hover:bg-base-200 transition-all duration-300">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Compromisos Totales</p>
                    <p className="text-4xl font-black tracking-tighter text-primary">{stats.total}</p>
                </div>
                <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-[2rem] border border-base-300 flex flex-col items-center text-center group hover:bg-base-200 transition-all duration-300">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">⏳</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">En Espera</p>
                    <p className="text-4xl font-black tracking-tighter text-secondary">{stats.pendientes}</p>
                </div>
                <div className="bg-base-200/50 backdrop-blur-md p-8 rounded-[2rem] border border-base-300 flex flex-col items-center text-center group hover:bg-base-200 transition-all duration-300">
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">✨</div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Próximos Días</p>
                    <p className="text-4xl font-black tracking-tighter text-accent">{stats.proximas}</p>
                </div>
            </div>

            <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-base-content to-base-content/40 bg-clip-text text-transparent">Gestión de Agenda</h2>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-[0.3em]">
                            {currentDate.toLocaleString("es-ES", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 bg-base-200 p-2 rounded-2xl border border-base-300">
                    <button onClick={prevMonth} className="btn btn-ghost btn-sm rounded-xl px-4 hover:bg-base-300 transition-all">
                        ANTERIOR
                    </button>
                    <div className="w-px h-6 bg-base-300 self-center"></div>
                    <button onClick={nextMonth} className="btn btn-ghost btn-sm rounded-xl px-4 hover:bg-base-300 transition-all">
                        SIGUIENTE
                    </button>
                </div>
            </header>

            {/* Calendar Component - DaisyUI 5 Calendar Pattern */}
            <div className="calendar bg-base-100 rounded-[2.5rem] border border-base-300 overflow-hidden shadow-inner">
                <div className="grid grid-cols-7 border-b border-base-300">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                        <div key={day} className="bg-base-200/50 py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 bg-base-300/20">
                    {[...Array(firstDay)].map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[160px] bg-base-200/10 border-r border-b border-base-300 last:border-r-0"></div>
                    ))}

                    {[...Array(days)].map((_, i) => {
                        const day = i + 1;
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                        const dayEvents = events.filter(
                            (e) =>
                                e.date.getDate() === day &&
                                e.date.getMonth() === currentDate.getMonth() &&
                                e.date.getFullYear() === currentDate.getFullYear()
                        );

                        return (
                            <div key={day} className={`min-h-[160px] p-4 bg-base-100 border-r border-b border-base-300 last:border-r-0 hover:bg-primary/5 transition-all duration-500 group relative ${isToday ? 'bg-primary/5' : ''}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-xs font-black ${isToday ? 'text-primary bg-primary/10 px-2 py-1 rounded-lg' : 'opacity-20 group-hover:opacity-100'} transition-all`}>
                                        {day}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {dayEvents.slice(0, 3).map((evt) => (
                                        <div
                                            key={evt.id}
                                            className={`${evt.color} text-white text-[9px] p-2.5 rounded-xl font-bold uppercase tracking-tight truncate cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-xl border border-white/10`}
                                            onClick={() => setSelectedEvent(evt)}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className="opacity-60">{evt.hora}</span>
                                                <span className="truncate">{evt.banquete}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[8px] font-black opacity-30 text-center uppercase tracking-widest pt-1">
                                            + {dayEvents.length - 3} más
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 justify-center border-t border-base-300 pt-10">
                <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center text-info shadow-inner group-hover:scale-110 transition-transform">📍</div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-info">Visitas al Salón</p>
                        <p className="text-[9px] font-bold opacity-30 uppercase">Consultas programadas</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error shadow-inner group-hover:scale-110 transition-transform">👑</div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-error">Eventos Reservados</p>
                        <p className="text-[9px] font-bold opacity-30 uppercase">Reservas confirmadas</p>
                    </div>
                </div>
            </div>

            {/* ── Modal de Detalles Premium ── */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-base-100 w-full max-w-lg rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-12">
                            <div className="flex justify-between items-center mb-10">
                                <div className={`badge ${selectedEvent.color} text-white font-black uppercase tracking-widest text-[9px] py-4 px-6 rounded-full border-none`}>
                                    {selectedEvent.type}
                                </div>
                                <button onClick={() => { setSelectedEvent(null); setIsRejecting(false); setMotivoRechazo(""); }} className="btn btn-circle btn-ghost btn-sm hover:rotate-90 transition-transform">✕</button>
                            </div>

                            <header className="mb-10">
                                <h3 className="text-4xl font-black tracking-tighter mb-2 uppercase italic leading-none">{selectedEvent.banquete}</h3>
                                <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.3em]">Detalles de la operación</p>
                            </header>

                            <div className="grid grid-cols-1 gap-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-2xl shadow-inner">👤</div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Cliente</p>
                                        <p className="font-bold text-lg leading-tight">{selectedEvent.user}</p>
                                        <p className="text-xs opacity-50 font-medium">{selectedEvent.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-2xl shadow-inner">🕒</div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Programación</p>
                                        <p className="font-bold text-lg leading-tight uppercase">
                                            {selectedEvent.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                        <p className="text-sm text-primary font-black italic tracking-widest mt-1">A LAS {selectedEvent.hora}</p>
                                    </div>
                                </div>

                                {selectedEvent.detalles && (
                                    <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-content/5 shadow-inner">
                                        <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-3">Mensaje del Cliente</p>
                                        <p className="text-sm font-medium leading-relaxed italic opacity-80">"{selectedEvent.detalles}"</p>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-4 border-t border-base-content/5">
                                    <div className={`w-3 h-3 rounded-full animate-pulse ${selectedEvent.estado === 'confirmada' ? 'bg-success' :
                                        selectedEvent.estado === 'cancelada' ? 'bg-error' : 'bg-warning'
                                        }`}></div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedEvent.estado}</span>
                                </div>
                            </div>

                            {selectedEvent.estado === 'pendiente' && !isRejecting && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleUpdateStatus('confirmada')}
                                        className="btn btn-primary h-16 rounded-3xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-primary/30 transition-all border-none"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => setIsRejecting(true)}
                                        className="btn btn-outline h-16 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-error/10 hover:text-error hover:border-error transition-all"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            )}

                            {isRejecting && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="form-control">
                                        <label className="label py-0 mb-2">
                                            <span className="label-text text-[9px] font-black uppercase tracking-widest opacity-40">Motivo del rechazo</span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered w-full rounded-2xl text-sm font-medium focus:textarea-error bg-base-200/50 min-h-[100px]"
                                            placeholder="Escribe aquí por qué no puedes atender la solicitud..."
                                            value={motivoRechazo}
                                            onChange={(e) => setMotivoRechazo(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setIsRejecting(false)}
                                            className="btn btn-ghost h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                                        >
                                            Volver
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus('cancelada')}
                                            className="btn btn-error h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-error/30 border-none"
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
