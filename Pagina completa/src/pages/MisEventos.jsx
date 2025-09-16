// src/pages/MisEventos.jsx - Versión completa
import { useState } from "react";

const MisEventos = () => {
  const [activeTab, setActiveTab] = useState("proximos");

  const eventos = [
    {
      id: 1,
      nombre: "Boda de Ana y Carlos",
      tipo: "Boda",
      fecha: "2024-03-15",
      hora: "16:00",
      salon: "Salón Imperial",
      invitados: 120,
      estado: "confirmado",
      precio: 28500
    },
    {
      id: 2,
      nombre: "Conferencia Tech Solutions",
      tipo: "Corporativo",
      fecha: "2024-04-10",
      hora: "09:00",
      salon: "Salón Ejecutivo",
      invitados: 150,
      estado: "confirmado",
      precio: 22000
    },
    {
      id: 3,
      nombre: "Fiesta de 15 Años de Valeria",
      tipo: "Fiesta de 15 años",
      fecha: "2024-05-20",
      hora: "19:00",
      salon: "Jardín Botánico",
      invitados: 80,
      estado: "pendiente",
      precio: 18000
    },
    {
      id: 4,
      nombre: "Cena Anual de Empresa",
      tipo: "Corporativo",
      fecha: "2023-12-15",
      hora: "20:00",
      salon: "Terraza Panorámica",
      invitados: 90,
      estado: "completado",
      precio: 32000
    }
  ];

  const eventosFiltrados = eventos.filter(evento => {
    const hoy = new Date();
    const fechaEvento = new Date(evento.fecha);
    
    if (activeTab === "proximos") return fechaEvento >= hoy && evento.estado !== "completado";
    if (activeTab === "pasados") return fechaEvento < hoy || evento.estado === "completado";
    if (activeTab === "pendientes") return evento.estado === "pendiente";
    return true;
  });

  const getBadgeClass = (estado) => {
    switch(estado) {
      case "confirmado": return "badge badge-success";
      case "pendiente": return "badge badge-warning";
      case "completado": return "badge badge-neutral";
      default: return "badge badge-outline";
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Mis Eventos</h1>
        
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8">
          <button 
            className={`tab ${activeTab === "proximos" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("proximos")}
          >
            Próximos eventos
          </button>
          <button 
            className={`tab ${activeTab === "pasados" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("pasados")}
          >
            Eventos pasados
          </button>
          <button 
            className={`tab ${activeTab === "pendientes" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("pendientes")}
          >
            Pendientes
          </button>
        </div>

        {/* Lista de eventos */}
        {eventosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {eventosFiltrados.map(evento => (
              <div key={evento.id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h2 className="card-title">{evento.nombre}</h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={getBadgeClass(evento.estado)}>{evento.estado}</span>
                        <span className="badge badge-outline">{evento.tipo}</span>
                      </div>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <p className="text-2xl font-bold">${evento.precio.toLocaleString()}</p>
                      <p className="text-sm">{evento.invitados} invitados</p>
                    </div>
                  </div>
                  
                  <div className="divider my-2"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">Fecha y hora</p>
                      <p>{new Date(evento.fecha).toLocaleDateString()} - {evento.hora}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Salón</p>
                      <p>{evento.salon}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Acciones</p>
                      <div className="flex gap-2 mt-1">
                        <button className="btn btn-sm btn-outline">Detalles</button>
                        <button className="btn btn-sm btn-primary">Editar</button>
                        {evento.estado === "pendiente" && (
                          <button className="btn btn-sm btn-success">Confirmar</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-2xl font-bold mb-2">No hay eventos</h3>
            <p>No se encontraron eventos con los filtros seleccionados</p>
            <button className="btn btn-primary mt-4">Crear nuevo evento</button>
          </div>
        )}

        {/* Estadísticas */}
        <div className="mt-12 stats shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Eventos Totales</div>
            <div className="stat-value text-primary">4</div>
            <div className="stat-desc">2 eventos por realizar</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Inversión Total</div>
            <div className="stat-value text-secondary">$100.5k</div>
            <div className="stat-desc">21% más que el año anterior</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80" alt="Usuario" />
                </div>
              </div>
            </div>
            <div className="stat-value">86%</div>
            <div className="stat-title">Eventos completados</div>
            <div className="stat-desc text-secondary">31 eventos el año pasado</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisEventos;