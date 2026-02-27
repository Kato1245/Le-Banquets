// src/features/eventos/pages/Eventos.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const Eventos = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const eventos = [
    {
      id: 1,
      nombre: "Boda Imperial",
      descripcion: "La máxima expresión del lujo para tu día especial. Ceremonias majestuosas con atención al detalle milimétrica.",
      imagen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "boda",
      capacidad: "100-500",
      caracteristica: "Servicio Guante Blanco"
    },
    {
      id: 2,
      nombre: "Cumbre Corporativa",
      descripcion: "Espacios de alta tecnología diseñados para networking, lanzamientos y conferencias de impacto global.",
      imagen: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "corporativo",
      capacidad: "50-1000",
      caracteristica: "Full Tech Support"
    },
    {
      id: 3,
      nombre: " Gala de 15 Primaveras",
      descripcion: "Magia y fantasía juvenil en entornos seguros y vibrantes. Una noche para brillar como nunca.",
      imagen: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "quinceaneros",
      capacidad: "80-300",
      caracteristica: "Efectos Especiales"
    },
    {
      id: 4,
      nombre: "Cóctel de Networking",
      descripcion: "Ambientes distendidos con mixología de autor, ideal para forjar alianzas y celebrar éxitos empresariales.",
      imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "coctel",
      capacidad: "50-200",
      caracteristica: "Barra de Autor"
    }
  ];

  const categorias = [
    { id: "todos", nombre: "Explorar Todo" },
    { id: "boda", nombre: "Bodas de Lujo" },
    { id: "corporativo", nombre: "Eventos Business" },
    { id: "quinceaneros", nombre: "Celebraciones 15" }
  ];

  const filteredEventos = eventos.filter(evento => {
    const matchesCategory = selectedFilter === "todos" || evento.tipo === selectedFilter;
    const matchesSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-base-100 py-20 selection:bg-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="badge badge-primary py-4 px-8 rounded-full mb-6 font-black uppercase tracking-[0.4em] text-[10px]">
            Catalogo de Experiencias
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            Inspiración <br />para <span className="text-primary italic serif">Tu Evento</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-50 font-medium leading-relaxed">
            Explora los formatos de eventos más solicitados. Cada categoría ha sido diseñada para integrarse perfectamente con nuestros salones seleccionados.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 bg-base-200/50 p-6 rounded-[2.5rem] border border-base-300">
          <div className="flex flex-wrap gap-3">
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`btn btn-sm rounded-xl px-6 normal-case font-bold h-10 transition-all ${selectedFilter === cat.id
                    ? "btn-primary shadow-lg shadow-primary/20 scale-105"
                    : "btn-ghost opacity-40 hover:opacity-100"
                  }`}
                onClick={() => setSelectedFilter(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar estilo de evento..."
              className="input input-bordered w-full rounded-2xl pl-12 h-12 bg-base-100 border-base-300 focus:input-primary font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Grid of Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {filteredEventos.map(evento => (
            <div key={evento.id} className="group relative overflow-hidden rounded-[3rem] aspect-video bg-neutral shadow-2xl animate-in fade-in zoom-in duration-700">
              <img
                src={evento.imagen}
                alt={evento.nombre}
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2000ms]"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-12 flex flex-col justify-end">
                <div className="translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="badge badge-primary py-3 px-5 rounded-lg mb-4 font-black uppercase tracking-widest text-[10px] border-none">
                    {evento.caracteristica}
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">{evento.nombre}</h2>
                  <p className="text-white/60 text-lg mb-8 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 font-medium">
                    {evento.descripcion}
                  </p>
                  <div className="flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest">Capacidad</span>
                      <span className="text-white font-bold">{evento.capacidad} pers.</span>
                    </div>
                    <Link to="/banquetes" className="btn btn-primary rounded-xl px-10 normal-case font-black shadow-lg">
                      Buscar Salones
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEventos.length === 0 && (
          <div className="py-20 text-center animate-bounce">
            <p className="text-4xl font-black opacity-20 uppercase">No se encontraron estilos</p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-32 bg-primary/10 rounded-[3rem] p-12 md:p-20 border border-primary/20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-4xl font-black tracking-tighter mb-6 uppercase">Personalización sin Límites</h3>
            <p className="text-xl font-medium opacity-60 leading-relaxed mb-10">
              ¿Tienes un concepto único? Nuestra red de salones es lo suficientemente versátil para adaptarse a cualquier temática, desde desfiles de moda hasta convenciones tecnológicas.
            </p>
            <div className="flex gap-4">
              <button className="btn btn-primary rounded-xl px-12 font-black shadow-xl">Contactar Especialista</button>
              <button className="btn btn-ghost rounded-xl px-10 font-black opacity-40">Ver Portfolio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;