// src/pages/Salones.jsx - Versión completa con 15 salones y barra de búsqueda
import { useState, useEffect } from "react";

const Salones = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalones();
  }, []);

  const fetchSalones = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/banquetes");
      if (!response.ok) {
        throw new Error("Error al cargar los salones");
      }
      const data = await response.json();

      const salonesFormateados = data.data.map(salon => ({
        id: salon._id,
        nombre: salon.nombre,
        descripcion: salon.descripcion,
        imagen:
          salon.imagenes && salon.imagenes.length > 0
            ? salon.imagenes[0]
            : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        tipo: salon.tipo || "general",
        capacidad: salon.capacidad,
        precio: salon.precio_base,
        ubicacion: salon.ubicacion || salon.direccion,
        equipamiento: salon.equipamento
          ? salon.equipamento.split(",").map(item => item.trim())
          : [],
        serviciosIncluidos: salon.servicios
          ? salon.servicios.split(",").map(item => item.trim())
          : [],
        dimensiones: salon.dimensiones || "N/A"
      }));

      setSalones(salonesFormateados);
    } catch (err) {
      console.error("Error fetching salones:", err);
      setError("No se pudieron cargar los salones. Por favor intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const tiposSalon = [
    { id: "todos", nombre: "Todos los salones" },
    { id: "lujo", nombre: "De lujo" },
    { id: "exterior", nombre: "Exteriores" },
    { id: "corporativo", nombre: "Corporativos" },
    { id: "premium", nombre: "Premium" },
    { id: "rustico", nombre: "Rústicos" }
  ];

  const salonesFiltrados =
    selectedFilter === "todos"
      ? salones
      : salones.filter(
        salon =>
          salon.tipo &&
          salon.tipo.toLowerCase() === selectedFilter.toLowerCase()
      );

  const salonesBuscados = salonesFiltrados.filter(
    salon =>
      salon.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = salon => {
    setSelectedSalon(salon);
    document.getElementById("modal_salon").showModal();
  };

  const closeModal = () => {
    setSelectedSalon(null);
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Nuestros Salones
        </h1>

        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Descubre nuestros espacios exclusivos, cada uno diseñado para crear
          experiencias únicas e inolvidables para tu evento especial
        </p>

        {loading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error mb-8">
            <span>{error}</span>
          </div>
        ) : (
          <div>
            <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-grow w-full">
                  <input
                    type="text"
                    placeholder="Buscar salones por nombre, descripción o ubicación..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {tiposSalon.map(tipo => (
                <button
                  key={tipo.id}
                  className={`btn ${selectedFilter === tipo.id
                      ? "btn-primary"
                      : "btn-outline"
                    }`}
                  onClick={() => setSelectedFilter(tipo.id)}
                >
                  {tipo.nombre}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {salonesBuscados.map(salon => (
                <div
                  key={salon.id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <figure className="h-56">
                    <img
                      src={salon.imagen}
                      alt={salon.nombre}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{salon.nombre}</h2>
                    <p className="line-clamp-2">{salon.descripcion}</p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="badge badge-primary">
                        {salon.capacidad} personas
                      </div>
                      <div className="text-xl font-bold">
                        ${salon.precio.toLocaleString("es-CO")}
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm">
                        <strong>Ubicación:</strong> {salon.ubicacion}
                      </p>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-primary"
                        onClick={() => openModal(salon)}
                      >
                        Reservar
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => openModal(salon)}
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {salonesBuscados.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">
                  No se encontraron salones
                </h3>
                <p>
                  Intenta con otros términos de búsqueda o filtros diferentes
                </p>
              </div>
            )}

            <div className="mt-16 bg-base-200 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-center mb-6">
                ¿Necesitas ayuda para elegir?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">
                    Visita nuestros salones
                  </h3>
                  <p>
                    Agenda una cita para conocer nuestros espacios
                    personalmente
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">
                    Cotización personalizada
                  </h3>
                  <p>
                    Recibe una propuesta detallada según tus necesidades
                    específicas
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">
                    Asesoría especializada
                  </h3>
                  <p>
                    Nuestros expertos te guiarán en cada paso de la
                    planificación
                  </p>
                </div>
              </div>

              <div className="text-center mt-6">
                <button className="btn btn-primary">
                  Contactar a un asesor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salones;
