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

      if (reservasRes.ok) {
        const resData = await reservasRes.json();
        const formattedReservas = (resData.data || []).map(res => ({
          id: res._id,
          nombre: res.banquete_id?.nombre || "Evento sin nombre",
          salon: res.banquete_id?.nombre || "N/A",
          fecha: res.fecha,
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
          fecha: cit.fecha_sugerida,
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
    <div className="min-h-screen bg-base-100 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter mb-2">Agenda de Eventos</h1>
            <p className="text-lg opacity-60 font-medium lowercase italic">Supervisión de Reservas y Gestión de Calendario</p>
          </div>
          <div className="tabs tabs-boxed bg-base-200 p-1 rounded-2xl">
            <button
              className={`tab px-8 rounded-xl font-bold transition-all ${activeTab === "proximos" ? "tab-active bg-primary text-primary-content shadow-lg" : ""}`}
              onClick={() => setActiveTab("proximos")}
            >
              Próximos
            </button>
            <button
              className={`tab px-8 rounded-xl font-bold transition-all ${activeTab === "pasados" ? "tab-active bg-primary text-primary-content shadow-lg" : ""}`}
              onClick={() => setActiveTab("pasados")}
            >
              Histórico
            </button>
            <button
              className={`tab px-8 rounded-xl font-bold transition-all ${activeTab === "pendientes" ? "tab-active bg-primary text-primary-content shadow-lg" : ""}`}
              onClick={() => setActiveTab("pendientes")}
            >
              En Revisión
            </button>
          </div>
        </div>

        {/* Lista de eventos */}
        {eventosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {eventosFiltrados.map(evento => (
              <div key={evento.id} className="card bg-base-100 shadow-xl border border-base-200 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all group">
                <div className="card-body p-10">
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`badge ${getBadgeClass(evento.estado)} py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]`}>
                          {evento.estado}
                        </div>
                        <div className="badge badge-outline py-4 px-6 rounded-xl font-bold opacity-30 text-[10px] tracking-widest">
                          #{evento.id.slice(-6)}
                        </div>
                        <div className="badge badge-ghost py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-tighter italic">
                          {evento.category}
                        </div>
                      </div>
                      <h2 className="text-4xl font-extrabold tracking-tight mb-4 group-hover:text-primary transition-colors">{evento.nombre}</h2>
                      <div className="flex flex-col gap-3 text-sm opacity-60 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold text-lg">📍</span>
                          <span className="opacity-40 uppercase text-[10px] font-black mr-2">Dirección:</span>
                          {evento.ubicacion}
                        </div>
                        <div className="flex flex-wrap gap-6">
                          <span className="flex items-center gap-2">
                            <span className="text-primary font-bold">📅</span>
                            <span className="opacity-40 uppercase text-[10px] font-black mr-2">Fecha:</span>
                            {new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {evento.category === 'reserva' && (
                            <span className="flex items-center gap-2">
                              <span className="text-primary font-bold">🕒</span>
                              <span className="opacity-40 uppercase text-[10px] font-black mr-2">Hora:</span>
                              {evento.hora}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start lg:items-end border-l-0 lg:border-l border-base-content/5 lg:pl-10 min-w-[200px]">
                      <div className="text-left lg:text-right mb-6 lg:mb-0">
                        <p className="text-xs font-bold opacity-30 uppercase tracking-widest mb-1">Inversión Final</p>
                        <p className="text-4xl font-black text-primary tracking-tighter">
                          {evento.precio > 0 ? `$${evento.precio.toLocaleString('es-CO')}` : "GRATIS"}
                        </p>
                      </div>

                      <div className="bg-base-100/50 p-4 rounded-2xl border border-base-content/5 mb-6 w-full">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] uppercase font-black opacity-30">Veredicto</p>
                          {evento.estado === 'cancelada' && (
                            <span className="badge badge-error badge-xs font-bold text-[8px]">RECHAZADO</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${evento.estado === 'confirmada' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                            evento.estado === 'cancelada' ? 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-warning shadow-[0_0_8px_rgba(234,179,8,0.4)]'
                            }`}></span>
                          <p className="text-xs font-bold uppercase tracking-widest">{evento.estado}</p>
                        </div>
                        {evento.motivo_rechazo && (
                          <div className="mt-3 p-3 bg-error/5 rounded-xl border border-error/10 border-l-4 border-l-error">
                            <p className="text-[9px] text-error font-black uppercase mb-1">Explicación del Propietario:</p>
                            <p className="text-[10px] italic opacity-80 leading-tight">"{evento.motivo_rechazo}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 w-full lg:w-auto mt-4">
                        <button
                          className="btn btn-primary btn-sm rounded-xl font-bold text-[10px] uppercase tracking-widest flex-1 lg:flex-none"
                          onClick={() => setSelectedEvent(evento)}
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-base-200/30 rounded-[3rem] border border-dashed border-base-content/10">
            <div className="text-7xl mb-6 opacity-10">🗓️</div>
            <h3 className="text-2xl font-bold mb-2">
              {isPropietario ? "Tu agenda de cliente está vacía" : "Sin actividad reciente"}
            </h3>
            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">
              {isPropietario
                ? "Como propietario, puedes gestionar las reservas de tus banquetes desde el panel de control."
                : "No se encontraron eventos registrados en esta categoría de tu agenda personal."}
            </p>
            <button className="btn btn-primary rounded-xl px-10 shadow-lg" onClick={() => navigate(isPropietario ? '/mis-banquetes?tab=calendario' : '/banquetes')}>
              {isPropietario ? "Gestionar mi Disponibilidad" : "Explorar Disponibilidad"}
            </button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-base-content/10">
          <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
            <span className="text-4xl font-black text-primary mb-2">{eventos.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Proyectos Totales</span>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
            <span className="text-4xl font-black text-secondary mb-2 line-clamp-1">${(eventos.reduce((a, b) => a + (b.precio || 0), 0) / 1000).toFixed(1)}k</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Presupuesto Gestionado</span>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
            <span className="text-4xl font-black text-accent mb-2">100%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Tasa de Efectividad</span>
          </div>
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-base-100 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-base-content/5 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`badge ${getBadgeClass(selectedEvent.estado)} text-white font-black uppercase tracking-tighter text-[10px] py-3 px-4`}>
                  {selectedEvent.estado}
                </div>
                <button onClick={() => setSelectedEvent(null)} className="btn btn-circle btn-ghost btn-sm">✕</button>
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-2 uppercase italic">{selectedEvent.nombre}</h3>
              <p className="text-xs opacity-50 mb-6 font-bold uppercase tracking-widest">Detalle de {selectedEvent.category}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-30 leading-none">Dirección / Ubicación</p>
                    <p className="font-bold text-sm leading-tight">{selectedEvent.ubicacion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-30 leading-none">Fecha Citada</p>
                    <p className="font-bold text-sm">
                      {new Date(selectedEvent.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs opacity-60 font-medium">A las {selectedEvent.hora}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-30 leading-none">Presupuesto</p>
                    <p className="font-bold text-sm">
                      {selectedEvent.precio > 0 ? `$${selectedEvent.precio.toLocaleString('es-CO')}` : "Por definir / Gratuita"}
                    </p>
                  </div>
                </div>

                <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5">
                  <p className="text-[10px] uppercase font-black opacity-30 mb-1">Tu solicitud / Notas</p>
                  <p className="text-xs font-medium leading-relaxed italic">"{selectedEvent.invitados}"</p>
                </div>

                {selectedEvent.motivo_rechazo && (
                  <div className="p-4 bg-error/10 rounded-2xl border border-error/20 border-l-4 border-l-error">
                    <p className="text-[10px] text-error uppercase font-black mb-1">Mensaje del Propietario:</p>
                    <p className="text-xs font-bold leading-relaxed">"{selectedEvent.motivo_rechazo}"</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="btn btn-block btn-primary rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisEventos;