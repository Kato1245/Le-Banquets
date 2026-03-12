// src/features/eventos/pages/MisEventos.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../config/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../shared/utils/imageUtils";

const MisEventos = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("proximos");
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const isPropietario = user?.userType === "propietario" || user?.role === "propietario";

  useEffect(() => {
    if (user) {
      fetchEventos();
    }
  }, [user]);

  const fetchEventos = async () => {
    try {
      setLoading(true);

      const [reservasRes, citasRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reservas/mis-reservas`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/citas/mis-citas`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      let consolidatedData = [];

      // Helper para parsear fechas de forma segura
      const parseToLocal = (dateInput) => {
        const d = new Date(dateInput);
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      };

      if (reservasRes.ok) {
        const resData = await reservasRes.json();
        const formattedReservas = (resData.data || []).map(res => ({
          id: res._id,
          nombre: res.banquete_id?.nombre || "Evento sin nombre",
          salon: res.banquete_id?.nombre || "N/A",
          fecha: parseToLocal(res.fecha),
          hora: res.hora,
          precio: res.monto,
          tipo: res.banquete_id?.tipo || "general",
          estado: res.estado,
          invitados: res.detalles || "No especificado",
          imagen: getImageUrl(res.banquete_id?.imagenes?.[0]),
          category: 'reserva',
          propietario: res.propietario_id,
          motivo_rechazo: res.motivo_rechazo,
          ubicacion: res.banquete_id?.direccion || res.banquete_id?.ubicacion || "N/A"
        }));
        consolidatedData = [...consolidatedData, ...formattedReservas];
      }

      if (citasRes.ok) {
        const citaData = await citasRes.json();
        const formattedCitas = (citaData.data || []).map(cit => ({
          id: cit._id,
          nombre: `Cita: ${cit.banquete_id?.nombre || "Banquete"}`,
          salon: cit.banquete_id?.nombre || "N/A",
          fecha: parseToLocal(cit.fecha_sugerida),
          hora: cit.hora_sugerida,
          precio: 0,
          tipo: "visita",
          estado: cit.estado,
          invitados: cit.mensaje || "Solicitud de visita",
          imagen: getImageUrl(cit.banquete_id?.imagenes?.[0]),
          category: 'cita',
          motivo_rechazo: cit.motivo_rechazo,
          ubicacion: cit.banquete_id?.direccion || cit.banquete_id?.ubicacion || "N/A"
        }));
        consolidatedData = [...consolidatedData, ...formattedCitas];
      }

      setEventos(consolidatedData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (error) {
      console.error("Error al obtener mis eventos:", error);
      toast.error("No pudimos sincronizar tus eventos más recientes.");
    } finally {
      setLoading(false);
    }
  };

  const eventosFiltrados = eventos.filter(evento => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaEvento = new Date(evento.fecha);

    if (activeTab === "proximos") return fechaEvento >= hoy && evento.estado !== "completado";
    if (activeTab === "pasados") return fechaEvento < hoy || evento.estado === "completado";
    if (activeTab === "pendientes") return evento.estado === "pendiente";
    return true;
  });

  const getBadgeClass = (estado) => {
    switch (estado) {
      case "confirmada": return "badge-success";
      case "pendiente": return "badge-warning text-warning-content";
      case "cancelada": return "badge-error";
      case "completado": return "badge-neutral text-white";
      default: return "badge-outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Premium */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
          <div>
              <div className="badge badge-primary badge-outline font-black uppercase tracking-[0.3em] mb-4 py-3 px-4 text-[9px]">Personal Agenda</div>
            <h1 className="text-6xl font-black tracking-tighter mb-2 italic bg-gradient-to-r from-base-content to-base-content/40 bg-clip-text text-transparent">Tus Compromisos</h1>
            <p className="text-sm opacity-40 font-bold lowercase tracking-widest italic">Gestiona tus visitas y reservas activas</p>
          </div>
          <div className="tabs tabs-box bg-base-200 p-2 rounded-[2rem] border border-base-300">
            <button
              className={`tab px-10 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === "proximos" ? "tab-active bg-primary text-primary-content shadow-xl" : ""}`}
              onClick={() => setActiveTab("proximos")}
            >
              Próximos
            </button>
            <button
              className={`tab px-10 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === "pasados" ? "tab-active bg-primary text-primary-content shadow-xl" : ""}`}
              onClick={() => setActiveTab("pasados")}
            >
              Histórico
            </button>
            <button
              className={`tab px-10 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === "pendientes" ? "tab-active bg-primary text-primary-content shadow-xl" : ""}`}
              onClick={() => setActiveTab("pendientes")}
            >
              En Revisión
            </button>
          </div>
        </div>

        {/* Timeline View - Luxury Alignment */}
        {eventosFiltrados.length > 0 ? (
          <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
            {eventosFiltrados.map((evento, index) => (
              <li key={evento.id} className="mb-12">
                <div className="timeline-middle">
                  <div className={`w-10 h-10 rounded-full border-4 border-base-100 bg-primary shadow-[0_0_15px_rgba(var(--p),0.5)] z-10 flex items-center justify-center text-white text-xs`}>
                    {index + 1}
                  </div>
                </div>
                <div className={`timeline-${index % 2 === 0 ? 'start' : 'end'} md:text-end mb-10 w-full flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className="group relative w-full lg:w-[85%]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    <div className="card bg-base-100 shadow-xl border border-base-300 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all relative">
                      <div className="flex flex-col md:flex-row">
                        {/* Event Preview Image */}
                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                          <img src={evento.imagen} alt={evento.salon} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                            <div className={`badge ${getBadgeClass(evento.estado)} py-3 px-4 rounded-xl font-black uppercase text-[8px] tracking-widest border-none`}>
                              {evento.estado}
                            </div>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-3xl font-black tracking-tighter truncate max-w-[70%]">{evento.nombre}</h3>
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 italic">{evento.category}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center gap-3">
                                <span className="opacity-40 text-lg">📅</span>
                                <p className="text-xs font-bold uppercase tracking-widest italic">{new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · {evento.hora}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="opacity-40 text-lg">📍</span>
                                <p className="text-xs font-bold truncate opacity-60 uppercase">{evento.ubicacion}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-6 border-t border-base-300">
                            <div>
                              <p className="text-[8px] font-black uppercase opacity-30 tracking-[0.2em]">Inversión</p>
                              <p className="text-xl font-black text-primary">${(evento.precio || 0).toLocaleString('es-CO')}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedEvent(evento)}
                                className="btn btn-ghost btn-sm rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-base-200"
                            >
                                DETALLES +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="bg-base-300" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-40 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300 mb-20">
            <div className="text-7xl mb-8 opacity-20">🏰</div>
            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">Tu agenda está despejada</h3>
            <p className="opacity-40 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
              No tienes eventos registrados todavía. Empieza explorando nuestros mejores salones.
            </p>
            <button className="btn btn-primary btn-lg rounded-2xl px-12 shadow-xl font-black tracking-widest uppercase text-xs" onClick={() => navigate('/banquetes')}>
              Explorar Catálogo
            </button>
          </div>
        )}

        {/* Stats Section - Luxury Refined */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
                { label: 'Compromisos', value: eventos.length, suffix: '', icon: '📜', color: 'bg-primary/5 text-primary' },
                { label: 'Presupuesto', value: (eventos.reduce((a, b) => a + (b.precio || 0), 0) / 1000000).toFixed(1), suffix: 'M', icon: '💎', color: 'bg-secondary/5 text-secondary' },
                { label: 'Efectividad', value: Math.round((eventos.filter(e => e.estado === 'confirmada').length / (eventos.length || 1)) * 100), suffix: '%', icon: '🏆', color: 'bg-accent/5 text-accent' }
            ].map((stat, i) => (
                <div key={i} className="bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-md flex items-center justify-between group hover:shadow-xl transition-all duration-500">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">{stat.label}</p>
                        <p className="text-4xl font-black tracking-tighter">
                            {stat.value}{stat.suffix}
                        </p>
                    </div>
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>

      </div>

      {/* Modal de Detalle Premium */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="bg-base-100 w-full max-w-lg rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-12">
              <div className="flex justify-between items-center mb-10">
                <div className={`badge ${getBadgeClass(selectedEvent.estado)} text-white font-black uppercase tracking-widest text-[9px] py-4 px-6 rounded-full border-none shadow-lg`}>
                  {selectedEvent.estado}
                </div>
                <button onClick={() => setSelectedEvent(null)} className="btn btn-circle btn-ghost btn-sm hover:rotate-90 transition-transform">✕</button>
              </div>

              <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase italic leading-none">{selectedEvent.nombre}</h3>
              <p className="text-[10px] opacity-30 mb-10 font-black uppercase tracking-[0.4em]">Certificado de {selectedEvent.category}</p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-2xl shadow-inner">📍</div>
                  <div>
                    <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Destino</p>
                    <p className="font-bold text-lg leading-tight">{selectedEvent.ubicacion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-2xl shadow-inner">🗓️</div>
                  <div>
                    <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Cronograma</p>
                    <p className="font-bold text-lg leading-tight uppercase">
                      {new Date(selectedEvent.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm font-black text-primary/60 mt-1 italic tracking-widest">HORA: {selectedEvent.hora || 'NO ASIGNADA'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-2xl shadow-inner">💰</div>
                  <div>
                    <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-1">Inversión Final</p>
                    <p className="font-bold text-lg leading-tight">
                      {selectedEvent.precio > 0 ? `$${selectedEvent.precio.toLocaleString('es-CO')}` : "CORTESÍA / BONIFICADA"}
                    </p>
                  </div>
                </div>

                <div className="bg-base-200/50 p-8 rounded-[2.5rem] border border-base-content/5 shadow-inner">
                  <p className="text-[9px] uppercase font-black opacity-30 tracking-widest mb-3">Tu Nota / Especificaciones</p>
                  <p className="text-sm font-medium leading-relaxed italic opacity-70">"{selectedEvent.invitados}"</p>
                </div>

                {selectedEvent.motivo_rechazo && (
                  <div className="p-6 bg-error/10 rounded-[2.5rem] border border-error/10 border-l-4 border-l-error shadow-lg">
                    <p className="text-[10px] text-error uppercase font-black tracking-widest mb-2">Respuesta del Propietario:</p>
                    <p className="text-sm font-bold leading-tight">"{selectedEvent.motivo_rechazo}"</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="btn btn-block btn-primary h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl border-none"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisEventos;