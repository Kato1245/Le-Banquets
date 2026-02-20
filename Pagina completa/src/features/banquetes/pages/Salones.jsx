// src/features/banquetes/pages/Salones.jsx
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
            if (!response.ok) throw new Error("Error al cargar los salones");
            const data = await response.json();
            const salonesFormateados = data.data.map(salon => ({
                id: salon._id,
                nombre: salon.nombre,
                descripcion: salon.descripcion,
                imagen: salon.imagenes && salon.imagenes.length > 0 ? salon.imagenes[0] : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
                tipo: salon.tipo || "general",
                capacidad: salon.capacidad,
                precio: salon.precio_base,
                ubicacion: salon.ubicacion || salon.direccion
            }));
            setSalones(salonesFormateados);
        } catch (err) {
            setError("No se pudieron cargar los salones.");
        } finally {
            setLoading(false);
        }
    };

    const types = [{ id: "todos", nombre: "Todos los salones" }, { id: "lujo", nombre: "De lujo" }, { id: "exterior", nombre: "Exteriores" }];

    const filtered = salones.filter(s =>
        (selectedFilter === "todos" || s.tipo?.toLowerCase() === selectedFilter.toLowerCase()) &&
        (s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || (s.ubicacion || "").toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Nuestros Salones</h1>
                {loading ? <span className="loading loading-spinner"></span> : (
                    <>
                        <input type="text" placeholder="Buscar..." className="input input-bordered w-full mb-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(s => (
                                <div key={s.id} className="card bg-base-100 shadow-xl">
                                    <figure><img src={s.image} alt={s.nombre} /></figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{s.nombre}</h2>
                                        <p>{s.descripcion}</p>
                                        <button className="btn btn-primary">Reservar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default Salones;
