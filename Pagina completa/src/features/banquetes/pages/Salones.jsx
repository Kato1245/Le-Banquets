// src/features/banquetes/pages/Salones.jsx
import { useState, useEffect } from "react";
import apiClient from "../../../shared/services/apiClient";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../shared/utils/imageUtils";

import ClinkingGlasses from "../../../shared/components/ClinkingGlasses";

const Salones = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [selectedEventFilter, setSelectedEventFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    fetchSalones();
  }, []);

  const fetchSalones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/banquetes");
      const rawSalones = response.data.data || response.data || [];
      const salonesFormateados = rawSalones.map((salon) => ({
        id: salon._id || salon.id,
        nombre: salon.nombre,
        descripcion: salon.descripcion,
        imagen: getImageUrl(salon.imagenes?.[0]),
        tipo: salon.tipo || "general",
        capacidad: salon.capacidad || 0,
        precio: salon.precio_base || salon.precio || 0,
        direccion:
          salon.direccion || "Dirección no especificada",
        servicios: salon.servicios || [],
        eventos: salon.eventos_que_ofrece || [],
      }));
      setSalones(salonesFormateados);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.friendlyMessage || "No pudimos cargar el catálogo de banquetes. Por favor, intenta de nuevo más tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: "todos", nombre: "Ver Todos" },
    { id: "lujo", nombre: "Lujo" },
    { id: "exterior", nombre: "Exteriores" },
    { id: "corporativo", nombre: "Corporativos" },
    { id: "rustico", nombre: "Rústicos" },
    { id: "general", nombre: "General" },
  ];

  const eventTypes = [
    { id: "todos", nombre: "Cualquier Evento" },
    { id: "15 Años", nombre: "15 Años" },
    { id: "Bodas", nombre: "Bodas" },
    { id: "Eventos empresariales", nombre: "Corporativos" },
    { id: "Otros", nombre: "Otros" },
  ];

  const filtered = salones.filter(
    (s) =>
      (selectedFilter === "todos" ||
        s.tipo?.toLowerCase() === selectedFilter.toLowerCase()) &&
      (selectedEventFilter === "todos" ||
        s.eventos.some(e => e.toLowerCase() === selectedEventFilter.toLowerCase())) &&
      (s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const openModal = (salon) => {
    setSelectedDetail(salon);
    document.getElementById("modal_salon_details").showModal();
  };

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Explora Nuestros Banquetes
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg text-base-content/70">
            Encuentra el escenario perfecto para tu celebración. Desde jardines
            mágicos hasta salones imperiales.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-base-200/50 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-base-300 mb-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Busca por nombre, Dirección o palabras clave..."
                className="input input-bordered w-full pl-12 rounded-2xl focus:input-primary transition-all border-base-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col items-center gap-3 shrink-0">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Ambiente</span>
               <div className="flex flex-wrap gap-2 justify-center">
                {types.map((t) => (
                  <button
                    key={t.id}
                    className={`btn btn-xs rounded-xl px-4 normal-case border-none ${selectedFilter === t.id ? "btn-primary shadow-lg" : "bg-base-100/50 hover:bg-base-300"}`}
                    onClick={() => setSelectedFilter(t.id)}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-base-content/5 flex flex-col items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-30 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
                Filtrar por Especialidad del Evento
             </span>
             <div className="flex flex-wrap gap-3 justify-center">
                {eventTypes.map((et) => (
                  <button
                    key={et.id}
                    className={`btn btn-sm rounded-2xl px-6 normal-case font-bold tracking-tight transition-all ${selectedEventFilter === et.id ? "btn-primary shadow-xl scale-105" : "btn-ghost bg-base-100 hover:bg-base-300"}`}
                    onClick={() => setSelectedEventFilter(et.id)}
                  >
                    {et.nombre}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Estados de Carga / Error */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <ClinkingGlasses size="md" />
            <p className="font-bold text-[10px] uppercase tracking-widest mt-6 animate-pulse">Preparando el catálogo</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg rounded-2xl p-6 bg-error/10 border-error/20 text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <span className="flex-grow font-semibold">{error}</span>
              <button
                className="btn btn-sm btn-error text-white hover:scale-105"
                onClick={fetchSalones}
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* Sin Resultados */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 bg-base-200/30 rounded-3xl border-2 border-dashed border-base-300">
            <div className="text-7xl mb-6 grayscale opacity-30">🏰</div>
            <h2 className="text-2xl font-bold mb-3">No hay coincidencias</h2>
            <p className="text-base-content/60 max-w-sm mx-auto">
              No encontramos banquetes con esos términos. Inténtalo con otra
              búsqueda o filtro.
            </p>
          </div>
        )}

        {/* Grilla Principal */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
              >
                <figure className="h-64 relative overflow-hidden">
                  <img
                    src={s.imagen}
                    alt={s.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="badge badge-primary font-bold py-3 shadow-md">
                      {s.tipo.toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button
                      onClick={() => openModal(s)}
                      className="btn btn-white btn-sm w-full rounded-lg font-bold"
                    >
                      Vista Rápida
                    </button>
                  </div>
                </figure>
                <div className="card-body p-6 flex flex-col flex-grow">
                  <div className="flex flex-col mb-4">
                    <h2 className="card-title text-2xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {s.nombre}
                    </h2>
                    <p className="text-sm text-base-content/50 flex items-center gap-1 font-medium italic">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {s.direccion}
                    </p>
                  </div>
                  <p className="text-base-content/70 line-clamp-3 mb-6 flex-grow">
                    {s.descripcion}
                  </p>
                  <div className="flex justify-between items-center bg-base-200/50 p-4 rounded-2xl mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase font-bold opacity-40">
                        Capacidad
                      </span>
                      <span className="font-bold">{s.capacidad} pers.</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-bold opacity-40 block">
                        Desde
                      </span>
                      <span className="text-xl font-extrabold text-primary">
                        ${s.precio.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions mt-6">
                    <Link
                      to={`/banquetes/${s.id}`}
                      className="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-primary/20 normal-case text-lg font-bold"
                    >
                      Ver Disponibilidad
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalles */}
        <dialog
          id="modal_salon_details"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box max-w-4xl p-0 overflow-hidden rounded-3xl">
            {selectedDetail && (
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <img
                    src={selectedDetail.imagen}
                    alt={selectedDetail.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
                      ✕
                    </button>
                  </form>
                  <div className="badge badge-outline mb-2">
                    {selectedDetail.tipo}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    {selectedDetail.nombre}
                  </h3>
                  <p className="text-base-content/70 mb-6 flex-grow">
                    {selectedDetail.descripcion}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-bold opacity-40">
                          Dirección
                        </p>
                        <p className="font-medium">
                          {selectedDetail.direccion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-bold opacity-40">
                          Precio Base
                        </p>
                        <p className="font-bold text-xl text-primary">
                          ${selectedDetail.precio.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/banquetes/${selectedDetail.id}`}
                    className="btn btn-primary btn-lg rounded-xl shadow-lg normal-case font-bold"
                  >
                    Reservar Ahora
                  </Link>
                </div>
              </div>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Salones;
