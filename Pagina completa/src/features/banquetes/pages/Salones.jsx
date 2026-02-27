import { useState, useEffect } from "react";
import apiClient from "@/shared/services/apiClient";
import toast from "react-hot-toast";

const Salones = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);

  const tiposSalon = [
    { id: "todos", nombre: "Todos" },
    { id: "lujo", nombre: "De lujo" },
    { id: "exterior", nombre: "Exteriores" },
    { id: "corporativo", nombre: "Corporativos" },
    { id: "premium", nombre: "Premium" }
  ];

  useEffect(() => {
    fetchSalones();
  }, []);

  const fetchSalones = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/banquetes");
      setSalones(response.data.data || []);
    } catch (err) {
      toast.error(err.friendlyMessage || "Error al cargar los salones");
    } finally {
      setLoading(false);
    }
  };

  const filtered = salones.filter(salon => {
    const matchesFilter = selectedFilter === "todos" || salon.tipo?.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = (salon.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (salon.direccion || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openModal = (salon) => {
    setSelectedSalon(salon);
    const modal = document.getElementById('modal_salon');
    if (modal) modal.showModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-4">Nuestros <span className="text-primary">Salones</span></h1>
          <p className="opacity-60 max-w-2xl mx-auto text-lg font-light">
            Descubre los espacios más exclusivos para tus eventos. Filtrados y seleccionados para garantizar la excelencia.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-base-100 p-6 rounded-3xl shadow-xl shadow-base-300/50">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              className="input input-bordered w-full pl-12 rounded-2xl bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            {tiposSalon.map(tipo => (
              <button
                key={tipo.id}
                onClick={() => setSelectedFilter(tipo.id)}
                className={`btn btn-sm rounded-full px-6 border-none transition-all ${selectedFilter === tipo.id ? 'btn-primary shadow-lg shadow-primary/30' : 'bg-base-200 hover:bg-base-300'}`}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-base-100 rounded-3xl shadow-inner">
            <div className="text-6xl mb-4 opacity-20">🏰</div>
            <h3 className="text-xl font-bold opacity-40">No se encontraron salones que coincidan</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map(salon => (
              <div key={salon._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-base-200">
                <figure className="h-64 relative overflow-hidden">
                  <img
                    src={salon.imagenes?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                    alt={salon.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 badge badge-primary font-bold p-3 shadow-lg">${Number(salon.precio_base).toLocaleString()}</div>
                </figure>
                <div className="card-body p-8">
                  <h2 className="card-title text-2xl font-black mb-2">{salon.nombre}</h2>
                  <p className="opacity-60 line-clamp-2 font-light mb-6">{salon.descripcion}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-base-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Capacidad</span>
                      <span className="font-bold text-sm">{salon.capacidad} pax</span>
                    </div>
                    <button
                      onClick={() => openModal(salon)}
                      className="btn btn-primary btn-sm rounded-xl shadow-lg shadow-primary/20 px-6"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalles */}
        <dialog id="modal_salon" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-4xl p-0 bg-base-100 rounded-3xl overflow-hidden">
            {selectedSalon && (
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-80 md:h-auto relative">
                  <img
                    src={selectedSalon.imagenes?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                    alt={selectedSalon.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <form method="dialog">
                      <button className="btn btn-circle btn-sm bg-black/50 text-white border-none backdrop-blur-md">✕</button>
                    </form>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                  <div className="flex-1">
                    <span className="badge badge-primary badge-outline text-[10px] uppercase font-bold tracking-widest px-3 py-4 mb-4">{selectedSalon.tipo || 'Premium'}</span>
                    <h2 className="text-3xl font-black mb-4 leading-tight">{selectedSalon.nombre}</h2>
                    <p className="opacity-70 font-light leading-relaxed mb-8">{selectedSalon.descripcion}</p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase opacity-40 font-bold tracking-tighter">Ubicación</p>
                          <p className="font-bold text-sm">{selectedSalon.direccion || 'Ubicación no especificada'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase opacity-40 font-bold tracking-tighter">Capacidad</p>
                          <p className="font-bold text-sm">{selectedSalon.capacidad} Invitados</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-base-200">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase opacity-40 font-bold">Desde</span>
                      <span className="text-2xl font-black text-primary">${Number(selectedSalon.precio_base).toLocaleString()}</span>
                    </div>
                    <button className="btn btn-primary rounded-2xl px-10 shadow-xl shadow-primary/20">Cotizar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Salones;
