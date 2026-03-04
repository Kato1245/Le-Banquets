// src/features/eventos/pages/MisEventos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../config/api";
import toast from "react-hot-toast";

const MisEventos = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("proximos");
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEventos();
    }
  }, [user]);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/eventos/mis-eventos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEventos(data.eventos || data.data || []);
      } else {
        setEventos([]);
        toast.error("No pudimos sincronizar tus eventos más recientes.");
      }
    } catch (error) {
      console.error("Error fetching eventos:", error);
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
      case "confirmado": return "badge-success";
      case "pendiente": return "badge-warning text-warning-content";
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
                          #{evento.id}
                        </div>
                      </div>
                      <h2 className="text-4xl font-extrabold tracking-tight mb-4 group-hover:text-primary transition-colors">{evento.nombre}</h2>
                      <div className="flex flex-wrap gap-6 text-sm opacity-60 font-medium">
                        <span className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {evento.salon}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {evento.invitados} invitados
                        </span>
                        <span className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Paquete {evento.tipo}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start lg:items-end border-l-0 lg:border-l border-base-content/5 lg:pl-10">
                      <div className="text-left lg:text-right mb-6 lg:mb-0">
                        <p className="text-xs font-bold opacity-30 uppercase tracking-widest mb-1">Inversión Final</p>
                        <p className="text-4xl font-black text-primary tracking-tighter">${evento.precio.toLocaleString('es-CO')}</p>
                      </div>

                      <div className="bg-base-200/50 p-4 rounded-2xl border border-base-300 w-full lg:w-auto">
                        <p className="text-[10px] font-bold opacity-40 uppercase mb-2">Próxima Fecha Crítica</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-bold">
                            {new Date(evento.fecha).getDate()}
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-none">{new Date(evento.fecha).toLocaleString('es-ES', { month: 'long' }).toUpperCase()}</p>
                            <p className="text-xs opacity-50">{evento.hora} — Apertura</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions flex-wrap gap-4 mt-10 pt-8 border-t border-base-content/5">
                    <button className="btn btn-outline btn-primary rounded-xl px-8 normal-case font-bold" onClick={() => toast.info("Generando reporte de evento...")}>
                      Detallado del Evento
                    </button>
                    <button className="btn btn-ghost rounded-xl px-8 normal-case font-bold opacity-60" onClick={() => toast.info("Contactando al salón...")}>
                      Mensajería Directa
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="btn btn-circle btn-ghost opacity-30 hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button className="btn btn-circle btn-ghost opacity-30 hover:opacity-100 hover:text-error transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-base-200/30 rounded-[3rem] border border-dashed border-base-content/10">
            <div className="text-7xl mb-6 opacity-10">🗓️</div>
            <h3 className="text-2xl font-bold mb-2">Sin actividad reciente</h3>
            <p className="opacity-50 max-w-sm mx-auto mb-8 font-medium">No se encontraron eventos registrados en esta categoría de tu agenda personal.</p>
            <button className="btn btn-primary rounded-xl px-10 shadow-lg" onClick={() => window.location.href = '/banquetes'}>
              Explorar Disponibilidad
            </button>
          </div>
        )
        }

        {/* Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8 border-t border-base-content/10">
          <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
            <span className="text-4xl font-black text-primary mb-2 line-clamp-1">{eventos.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Proyectos Totales</span>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
            <span className="text-4xl font-black text-secondary mb-2 line-clamp-1">${(eventos.reduce((a, b) => a + (b.precio || 0), 0) / 1000).toLocaleString('es-CO')}k</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Presupuesto Gestionado</span>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
            <span className="text-4xl font-black text-accent mb-2 line-clamp-1">100%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Tasa de Efectividad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisEventos;