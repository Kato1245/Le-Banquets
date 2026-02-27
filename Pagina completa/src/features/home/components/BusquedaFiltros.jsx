// src/features/home/components/BusquedaFiltros.jsx
import { useState } from "react";

const BusquedaFiltros = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("todos");

    const filters = [
        { id: "todos", label: "Todos" },
        { id: "bodas", label: "Bodas" },
        { id: "corporativos", label: "Eventos Corporativos" },
        { id: "fiestas", label: "Fiestas" },
        { id: "celebraciones", label: "Celebraciones" }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Buscando:", searchTerm, "Filtro:", selectedFilter);
    };

    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-grow w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar banquetes, salones, servicios..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            className={`btn btn-sm ${selectedFilter === filter.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setSelectedFilter(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
            </div>
        </div>
    );
};

export default BusquedaFiltros;
