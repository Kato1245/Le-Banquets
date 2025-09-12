// src/pages/Salones.jsx - Versión completa
import { useState } from "react";

const Salones = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const salones = [
    {
      id: 1,
      nombre: "Salón Imperial",
      descripcion: "Un espacio majestuoso con detalles dorados y candelabros espectaculares.",
      imagen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "lujo",
      capacidad: 300,
      precio: 35000,
      equipamiento: ["Sonido profesional", "Iluminación LED", "Proyector", "Wi-Fi"]
    },
    {
      id: 2,
      nombre: "Jardín Botánico",
      descripcion: "Un entorno natural perfecto para celebraciones al aire libre.",
      imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "exterior",
      capacidad: 200,
      precio: 28000,
      equipamiento: ["Área verde", "Pérgola", "Sistema de sonido", "Área de catering"]
    },
    {
      id: 3,
      nombre: "Salón Ejecutivo",
      descripcion: "Moderno y funcional, ideal para eventos corporativos.",
      imagen: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
      tipo: "corporativo",
      capacidad: 150,
      precio: 22000,
      equipamiento: ["Pantallas LCD", "Mesas modulares", "Internet fibra óptica", "Sistema de videoconferencia"]
    },
    {
      id: 4,
      nombre: "Terraza Panorámica",
      descripcion: "Vistas espectaculares de la ciudad en un ambiente sofisticado.",
      imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      tipo: "premium",
      capacidad: 100,
      precio: 40000,
      equipamiento: ["Terraza cubierta", "Bar privado", "Calefacción exterior", "Vista panorámica"]
    }
  ];

  const tiposSalon = [
    { id: "todos", nombre: "Todos los salones" },
    { id: "lujo", nombre: "De lujo" },
    { id: "exterior", nombre: "Exteriores" },
    { id: "corporativo", nombre: "Corporativos" },
    { id: "premium", nombre: "Premium" }
  ];

  const salonesFiltrados = selectedFilter === "todos" 
    ? salones 
    : salones.filter(salon => salon.tipo === selectedFilter);

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Nuestros Salones</h1>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Descubre nuestros espacios exclusivos, cada uno diseñado para crear experiencias únicas e inolvidables
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tiposSalon.map(tipo => (
            <button
              key={tipo.id}
              className={`btn ${selectedFilter === tipo.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedFilter(tipo.id)}
            >
              {tipo.nombre}
            </button>
          ))}
        </div>

        {/* Grid de salones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {salonesFiltrados.map(salon => (
            <div key={salon.id} className="card bg-base-100 shadow-xl image-full h-96 before:opacity-60 hover:before:opacity-70 transition-all duration-300">
              <figure>
                <img src={salon.imagen} alt={salon.nombre} className="w-full h-96 object-cover" />
              </figure>
              <div className="card-body justify-end">
                <h2 className="card-title text-white">{salon.nombre}</h2>
                <p className="text-white">{salon.descripcion}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="badge badge-primary badge-lg">Capacidad: {salon.capacidad}</div>
                  <div className="text-xl font-bold text-white">${salon.precio.toLocaleString()}</div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary">Reservar</button>
                  <button className="btn btn-outline btn-secondary">Ver detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-16 bg-base-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">¿Necesitas ayuda para elegir?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Visita nuestros salones</h3>
              <p>Agenda una cita para conocer nuestros espacios personalmente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Cotización personalizada</h3>
              <p>Recibe una propuesta detallada según tus necesidades específicas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Asesoría especializada</h3>
              <p>Nuestros expertos te guiarán en cada paso de la planificación</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="btn btn-primary btn-lg">Contactar a un asesor</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salones;