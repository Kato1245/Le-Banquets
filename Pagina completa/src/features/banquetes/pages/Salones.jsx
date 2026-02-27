// src/pages/Salones.jsx - Versión completa con 15 salones y barra de búsqueda
import { useState } from "react";

const Salones = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const salones = [
    {
      id: 1,
      nombre: "Salón Imperial",
      descripcion: "Un espacio majestuoso con detalles dorados y candelabros espectaculares. Perfecto para bodas y eventos de gala.",
      imagen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "lujo",
      capacidad: 300,
      precio: 15000000,
      ubicacion: "Bogotá, Zona Norte",
      equipamiento: ["Sonido profesional", "Iluminación LED", "Proyector", "Wi-Fi", "Escenario", "Aire acondicionado"],
      serviciosIncluidos: ["Mobiliario básico", "Personal de apoyo", "Coordinador de evento", "Estacionamiento"],
      dimensiones: "500 m²"
    },
    {
      id: 2,
      nombre: "Jardín Botánico",
      descripcion: "Un entorno natural perfecto para celebraciones al aire libre. Jardines exuberantes con flores tropicales.",
      imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&极t=crop&w=1470&q=80",
      tipo: "exterior",
      capacidad: 200,
      precio: 12000000,
      ubicacion: "Medellín, El Poblado",
      equipamiento: ["Área verde", "Pérgola", "Sistema de sonido", "Área de catering", "Pista de baile", "Iluminación decorativa"],
      serviciosIncluidos: ["Mobiliario de jardín", "Personal de servicio", "Coordinador de evento", "Zona de parqueadero"],
      dimensiones: "800 m²"
    },
    {
      id: 3,
      nombre: "Salón Ejecutivo",
      descripcion: "Moderno y funcional, ideal para eventos corporativos. Diseño contemporáneo con tecnología de punta.",
      imagen: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
      tipo: "corporativo",
      capacidad: 150,
      precio: 8000000,
      ubicacion: "Cali, Granada",
      equipamiento: ["Pantallas LCD", "Mesas modulares", "Internet fibra óptica", "Sistema de videoconferencia", "Audio profesional", "Climatización"],
      serviciosIncluidos: ["Mobiliario ejecutivo", "Personal técnico", "Catering básico", "Servicio de café"],
      dimensiones: "300 m²"
    },
    {
      id: 4,
      nombre: "Terraza Panorámica",
      descripcion: "Vistas espectaculares de la ciudad en un ambiente sofisticado. Ideal para eventos nocturnos y cócteles.",
      imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      tipo: "premium",
      capacidad: 100,
      precio: 18000000,
      ubicacion: "Cartagena, Bocagrande",
      equipamiento: ["Terraza cubierta", "Bar privado", "Calefacción exterior", "Vista panorámica", "Iluminación ambiental", "Sistema de audio"],
      serviciosIncluidos: ["Mobiliario premium", "Bartender profesional", "Seguridad privada", "Valet parking"],
      dimensiones: "350 m²"
    },
    {
      id: 5,
      nombre: "Hacienda Colonial",
      descripcion: "Una finca tradicional con arquitectura colonial y amplios jardines. Perfecta para eventos rústicos y campestres.",
      imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "rustico",
      capacidad: 250,
      precio: 10000000,
      ubicacion: "Pereira, Circunvalar",
      equipamiento: ["Amplios jardines", "Salón principal", "Zona de parrillas", "Piscina", "Caballerizas", "Zona de camping"],
      serviciosIncluidos: ["Mobiliario rústico", "Personal de campo", "Seguridad", "Parqueadero amplio"],
      dimensiones: "5000 m²"
    },
    {
      id: 6,
      nombre: "Salón Versalles",
      descripcion: "Elegante salón con estilo francés y detalles clásicos. Techos altos y arañas de cristal impresionantes.",
      imagen: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1452&q=80",
      tipo: "lujo",
      capacidad: 180,
      precio: 16000000,
      ubicacion: "Barranquilla, Norte",
      equipamiento: ["Arañas de cristal", "Piso de mármol", "Escenario principal", "Sistema de sonido", "Iluminación teatral", "Cortinas de terciopelo"],
      serviciosIncluidos: ["Mobiliario clásico", "Personal con uniforme", "Coordinador de lujo", "Valet parking"],
      dimensiones: "400 m²"
    },
    {
      id: 7,
      nombre: "Salón Atlántico",
      descripcion: "Moderno salón con vista al mar y decoración contemporánea. Ideal para eventos empresariales y sociales.",
      imagen: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "premium",
      capacidad: 220,
      precio: 14000000,
      ubicacion: "Santa Marta, Rodadero",
      equipamiento: ["Vista al mar", "Terraza exterior", "Sistema de sonido surround", "Iluminación inteligente", "Aire acondicionado", "Wi-Fi de alta velocidad"],
      serviciosIncluidos: ["Mobiliario moderno", "Personal bilingüe", "Coordinador de evento", "Estacionamiento vigilado"],
      dimensiones: "450 m²"
    },
    {
      id: 8,
      nombre: "Jardín de los Sueños",
      descripcion: "Espacio al aire libre con lagos artificiales y vegetación exuberante. Perfecto para bodas campestres.",
      imagen: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "exterior",
      capacidad: 180,
      precio: 11000000,
      ubicacion: "Manizales, Chipre",
      equipamiento: ["Lagos artificiales", "Puentes decorativos", "Área de ceremonia", "Pérgolas florales", "Sistema de sonido", "Iluminación ambiental"],
      serviciosIncluidos: ["Mobiliario de jardín", "Personal de servicio", "Coordinador de evento", "Zona de parqueadero"],
      dimensiones: "1200 m²"
    },
    {
      id: 9,
      nombre: "Centro de Convenciones Oro",
      descripcion: "Espacio versátil para grandes eventos corporativos y convenciones. Tecnología de punta y amplia capacidad.",
      imagen: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
      tipo: "corporativo",
      capacidad: 500,
      precio: 25000000,
      ubicacion: "Bogotá, Salitre",
      equipamiento: ["Sistema de proyección 4K", "Audio profesional", "Iluminación escénica", "Capacidad para dividir espacios", "Wi-Fi empresarial", "Backup de energía"],
      serviciosIncluidos: ["Mobiliario ejecutivo", "Personal técnico", "Servicio de café", "Recepción de invitados"],
      dimensiones: "1200 m²"
    },
    {
      id: 10,
      nombre: "Palacio de Cristal",
      descripcion: "Estructura de cristal con vistas panorámicas y diseño arquitectónico impresionante. Ideal para eventos exclusivos.",
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "lujo",
      capacidad: 120,
      precio: 22000000,
      ubicacion: "Medellín, El Poblado",
      equipamiento: ["Paredes de cristal", "Terraza panorámica", "Sistema de climatización", "Iluminación LED", "Audio de alta fidelidad", "Cortinas automáticas"],
      serviciosIncluidos: ["Mobiliario de diseño", "Personal especializado", "Valet parking", "Seguridad privada"],
      dimensiones: "400 m²"
    },
    {
      id: 11,
      nombre: "Salón Campestre La Pradera",
      descripcion: "Amplio espacio campestre con cabañas y áreas verdes. Perfecto para eventos familiares y reuniones.",
      imagen: "https://images.unsplash.com/photo-1596944943927-92b4c72f09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "rustico",
      capacidad: 300,
      precio: 9000000,
      ubicacion: "Envigado, Antioquia",
      equipamiento: ["Cabañas rústicas", "Zona de parrillas", "Piscina natural", "Canchas deportivas", "Área de camping", "Senderos ecológicos"],
      serviciosIncluidos: ["Mobiliario campestre", "Personal de campo", "Actividades recreativas", "Parqueadero amplio"],
      dimensiones: "10000 m²"
    },
    {
      id: 12,
      nombre: "Sky Lounge",
      descripcion: "Lounge moderno en último piso con vistas espectaculares de la ciudad. Ambiente íntimo y sofisticado.",
      imagen: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "premium",
      capacidad: 80,
      precio: 13000000,
      ubicacion: "Cali, San Fernando",
      equipamiento: ["Barra premium", "Terraza con jacuzzi", "Sistema de sonido atmosférico", "Iluminación mood", "Muebles lounge", "Cámaras de seguridad"],
      serviciosIncluidos: ["Bartender profesional", "Personal de servicio", "Seguridad privada", "Valet parking exclusivo"],
      dimensiones: "250 m²"
    },
    {
      id: 13,
      nombre: "Salón Diamante",
      descripcion: "Espacio versátil con capacidad para adaptarse a diferentes tipos de eventos. Diseño moderno y funcional.",
      imagen: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1464&q=80",
      tipo: "corporativo",
      capacidad: 200,
      precio: 9500000,
      ubicacion: "Barranquilla, Norte",
      equipamiento: ["Divisiones modulares", "Sistema de proyección", "Audio conferencia", "Iluminación adaptable", "Wi-Fi empresarial", "Climatización individual"],
      serviciosIncluidos: ["Mobiliario versátil", "Personal técnico", "Servicio de café", "Recepción profesional"],
      dimensiones: "400 m²"
    },
    {
      id: 14,
      nombre: "Jardín de las Mariposas",
      descripcion: "Espacio natural con mariposario y jardín botánico. Ideal para eventos al aire libre con toque mágico.",
      imagen: "https://images.unsplash.com/photo-1516216626526-e4e1526e0e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "exterior",
      capacidad: 150,
      precio: 8500000,
      ubicacion: "Armenia, Quindío",
      equipamiento: ["Mariposario", "Jardín botánico", "Pérgolas naturales", "Senderos ecológicos", "Sistema de sonido ambiental", "Iluminación suave"],
      serviciosIncluidos: ["Guía botánico", "Personal de servicio", "Coordinador de evento", "Parqueadero ecológico"],
      dimensiones: "2000 m²"
    },
    {
      id: 15,
      nombre: "Salón Royal",
      descripcion: "Espacio de lujo con detalles dorados y mármol importado. Para eventos exclusivos y de alta gama.",
      imagen: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      tipo: "lujo",
      capacidad: 120,
      precio: 28000000,
      ubicacion: "Bogotá, Chicó",
      equipamiento: ["Mármol importado", "Arañas de cristal Swarovski", "Sistema de sonido de alta gama", "Iluminación dorada", "Alfombras persas", "Climatización silenciosa"],
      serviciosIncluidos: ["Mobiliario de lujo", "Personal con uniforme de gala", "Coordinador ejecutivo", "Valet parking con uniforme"],
      dimensiones: "350 m²"
    }
  ];

  const tiposSalon = [
    { id: "todos", nombre: "Todos los salones" },
    { id: "lujo", nombre: "De lujo" },
    { id: "exterior", nombre: "Exteriores" },
    { id: "corporativo", nombre: "Corporativos" },
    { id: "premium", nombre: "Premium" },
    { id: "rustico", nombre: "Rústicos" }
  ];

  const salonesFiltrados = selectedFilter === "todos"
    ? salones
    : salones.filter(salon => salon.tipo === selectedFilter);

  const salonesBuscados = salonesFiltrados.filter(salon =>
    salon.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salon.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (salon) => {
    setSelectedSalon(salon);
    document.getElementById('modal_salon').showModal();
  };

  const closeModal = () => {
    setSelectedSalon(null);
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Nuestros Salones</h1>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Descubre nuestros espacios exclusivos, cada uno diseñado para crear experiencias únicas e inolvidables para tu evento especial
        </p>

        {/* Barra de búsqueda */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-grow w-full">
              <input
                type="text"
                placeholder="Buscar salones por nombre, descripción o ubicación..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salonesBuscados.map(salon => (
            <div key={salon.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <figure className="h-56">
                <img src={salon.imagen} alt={salon.nombre} className="w-full h-full object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{salon.nombre}</h2>
                <p className="line-clamp-2">{salon.descripcion}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="badge badge-primary">{salon.capacidad} personas</div>
                  <div className="text-xl font-bold">${salon.precio.toLocaleString('es-CO')}</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm"><strong>Ubicación:</strong> {salon.ubicacion}</p>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary" onClick={() => openModal(salon)}>Reservar</button>
                  <button className="btn btn-outline" onClick={() => openModal(salon)}>Ver detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {salonesBuscados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No se encontraron salones</h3>
            <p>Intenta con otros términos de búsqueda o filtros diferentes</p>
          </div>
        )}

        {/* Modal de detalles del salón */}
        <dialog id="modal_salon" className="modal">
          <div className="modal-box max-w-5xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
            </form>
            {selectedSalon && (
              <div>
                <h3 className="font-bold text-2xl mb-4">{selectedSalon.nombre}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img src={selectedSalon.imagen} alt={selectedSalon.nombre} className="w-full h-64 object-cover rounded-lg" />
                    <div className="mt-4">
                      <h4 className="font-bold text-lg">Precio: ${selectedSalon.precio.toLocaleString('es-CO')}</h4>
                      <p className="text-sm text-gray-600">* Precio base para 4 horas. Sujeto a cambios según personalización.</p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <p><strong>Capacidad:</strong> {selectedSalon.capacidad} personas</p>
                      <p><strong>Ubicación:</strong> {selectedSalon.ubicacion}</p>
                      <p><strong>Dimensiones:</strong> {selectedSalon.dimensiones}</p>
                      <p><strong>Tipo:</strong> {selectedSalon.tipo}</p>

                      <div>
                        <strong>Equipamiento:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedSalon.equipamiento.map((item, index) => (
                            <span key={index} className="badge badge-outline">{item}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong>Servicios incluidos:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {selectedSalon.serviciosIncluidos.map((servicio, index) => (
                            <li key={index}>{servicio}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="btn btn-primary w-full">Solicitar cotización</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>

        {/* Información adicional */}
        <div className="mt-16 bg-base-200 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">¿Necesitas ayuda para elegir?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0" />
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
            <button className="btn btn-primary">Contactar a un asesor</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salones;
