// src/pages/Eventos.jsx - Versión completa con funcionalidad
import { useState } from "react";
import { Link } from "react-router-dom";

const Eventos = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const eventos = [
    {
      id: 1,
      titulo: "Boda Elegante",
      descripcion: "Una celebración sofisticada con todos los detalles cuidadosamente planeados.",
      imagen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "bodas",
      precio: 25000,
      capacidad: 150,
      fecha: "2024-03-15"
    },
    {
      id: 2,
      titulo: "Conferencia Corporativa",
      descripcion: "Espacio profesional equipado con tecnología de punta para sus presentaciones.",
      imagen: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
      categoria: "corporativos",
      precio: 18000,
      capacidad: 200,
      fecha: "2024-04-10"
    },
    {
      id: 3,
      titulo: "Fiesta de 15 Años",
      descripcion: "Celebración mágica con decoración temática y ambientación especial.",
      imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      categoria: "fiestas",
      precio: 22000,
      capacidad: 120,
      fecha: "2024-05-20"
    },
    {
      id: 4,
      titulo: "Cena de Gala",
      descripcion: "Evento formal con servicio de catering gourmet y ambientación de lujo.",
      imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "celebraciones",
      precio: 30000,
      capacidad: 100,
      fecha: "2024-06-05"
    }
  ];

  const categorias = [
    { id: "todos", nombre: "Todos los Eventos" },
    { id: "bodas", nombre: "Bodas" },
    { id: "corporativos", nombre: "Eventos Corporativos" },
    { id: "fiestas", nombre: "Fiestas" },
    { id: "celebraciones", nombre: "Celebraciones" }
  ];

  const eventosFiltrados = eventos.filter(evento => {
    const coincideCategoria = selectedCategory === "todos" || evento.categoria === selectedCategory;
    const coincideBusqueda = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Nuestros Eventos</h1>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Descubre nuestros paquetes de eventos personalizados para hacer de tu celebración una experiencia inolvidable
        </p>

        {/* Filtros y búsqueda */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categorias.map(categoria => (
                <button
                  key={categoria.id}
                  className={`btn btn-sm ${selectedCategory === categoria.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedCategory(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de eventos */}
        {eventosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventosFiltrados.map(evento => (
              <div key={evento.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <figure>
                  <img src={evento.imagen} alt={evento.titulo} className="h-56 w-full object-cover" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{evento.titulo}</h2>
                  <p>{evento.descripcion}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="badge badge-primary">{evento.categoria}</div>
                    <div className="text-lg font-bold">${evento.precio.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span>Capacidad: {evento.capacidad} personas</span>
                    <span>Disponible: {new Date(evento.fecha).toLocaleDateString()}</span>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link to="/registro" className="btn btn-primary">Reservar Ahora</Link>
                    <button className="btn btn-outline">Más Información</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">😢</div>
            <h3 className="text-2xl font-bold mb-2">No encontramos eventos</h3>
            <p>Intenta con otros filtros o términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Eventos;