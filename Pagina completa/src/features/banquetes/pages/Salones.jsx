// src/features/banquetes/pages/Salones.jsx
import { useState, useEffect } from "react";
import API_BASE_URL from "../../../config/api";

const Salones = () => {
    const [selectedFilter, setSelectedFilter] = useState("todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [salones, setSalones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSalones();
    }, []);

    const fetchSalones = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/banquetes`);
            if (!response.ok) throw new Error("Error al cargar los salones");
            const data = await response.json();
            const salonesFormateados = (data.data || []).map(salon => ({
                id: salon._id,
                nombre: salon.nombre,
                descripcion: salon.descripcion,
                // Usar salon.imagenes[0] correctamente (no salon.image que no existe)
                imagen: salon.imagenes?.length > 0
                    ? salon.imagenes[0]
                    : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                tipo: salon.tipo || "general",
                capacidad: salon.capacidad,
                precio: salon.precio_base,
                ubicacion: salon.ubicacion || salon.direccion
            }));
            setSalones(salonesFormateados);
        } catch (err) {
            setError(err.message || "No se pudieron cargar los salones.");
        } finally {
            setLoading(false);
        }
    };

    const types = [
        { id: "todos", nombre: "Todos" },
        { id: "lujo", nombre: "De lujo" },
        { id: "exterior", nombre: "Exteriores" },
        { id: "general", nombre: "General" }
    ];

    const filtered = salones.filter(s =>
        (selectedFilter === "todos" || s.tipo?.toLowerCase() === selectedFilter.toLowerCase()) &&
        (s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.ubicacion || "").toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-2">Banquetes</h1>
                <p className="text-center text-base-content/60 mb-8">
                    Espacios publicados por propietarios en nuestra plataforma
                </p>

                {/* Buscador */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o ubicación..."
                        className="input input-bordered flex-grow"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                        {types.map(t => (
                            <button
                                key={t.id}
                                className={`btn btn-sm ${selectedFilter === t.id ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setSelectedFilter(t.id)}
                            >
                                {t.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Estados */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                        <button className="btn btn-sm btn-ghost" onClick={fetchSalones}>Reintentar</button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <h2 className="text-xl font-semibold mb-2">No se encontraron salones</h2>
                        <p className="text-base-content/60">
                            {salones.length === 0
                                ? "Aún no hay salones publicados en la plataforma."
                                : "Intentá con otros términos de búsqueda o filtros."}
                        </p>
                    </div>
                )}

                {/* Grilla de salones */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(s => (
                            <div key={s.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <figure className="h-48">
                                    <img src={s.imagen} alt={s.nombre} className="w-full h-full object-cover" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{s.nombre}</h2>
                                    {s.ubicacion && (
                                        <p className="text-sm text-base-content/60 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {s.ubicacion}
                                        </p>
                                    )}
                                    <p className="line-clamp-2">{s.descripcion}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        {s.capacidad && (
                                            <div className="badge badge-outline">{s.capacidad} personas</div>
                                        )}
                                        {s.precio && (
                                            <span className="font-bold text-primary">
                                                ${s.precio.toLocaleString('es-CO')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="card-actions justify-end mt-4">
                                        <button className="btn btn-primary btn-sm">Ver detalles</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Salones;
