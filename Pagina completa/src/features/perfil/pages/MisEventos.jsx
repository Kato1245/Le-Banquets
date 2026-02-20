// src/features/perfil/pages/MisEventos.jsx
import { useState } from "react";

const MisEventos = () => {
    const [activeTab, setActiveTab] = useState("proximos");

    const eventos = [
        {
            id: 1,
            nombre: "Boda de Ana y Carlos",
            tipo: "Boda",
            fecha: "2024-03-15",
            hora: "16:00",
            salon: "Salón Imperial",
            invitados: 120,
            estado: "confirmado",
            precio: 28500
        },
        {
            id: 2,
            nombre: "Conferencia Tech Solutions",
            tipo: "Corporativo",
            fecha: "2024-04-10",
            hora: "09:00",
            salon: "Salón Ejecutivo",
            invitados: 150,
            estado: "confirmado",
            precio: 22000
        },
        {
            id: 3,
            nombre: "Fiesta de 15 Años de Valeria",
            tipo: "Fiesta de 15 años",
            fecha: "2024-05-20",
            hora: "19:00",
            salon: "Jardín Botánico",
            invitados: 80,
            estado: "pendiente",
            precio: 18000
        },
        {
            id: 4,
            nombre: "Cena Anual de Empresa",
            tipo: "Corporativo",
            fecha: "2023-12-15",
            hora: "20:00",
            salon: "Terraza Panorámica",
            invitados: 90,
            estado: "completado",
            precio: 32000
        }
    ];

    const eventosFiltrados = eventos.filter(evento => {
        const hoy = new Date();
        const fechaEvento = new Date(evento.fecha);
        if (activeTab === "proximos") return fechaEvento >= hoy && evento.estado !== "completado";
        if (activeTab === "pasados") return fechaEvento < hoy || evento.estado === "completado";
        if (activeTab === "pendientes") return evento.estado === "pendiente";
        return true;
    });

    const getBadgeClass = (estado) => {
        switch (estado) {
            case "confirmado": return "badge badge-success";
            case "pendiente": return "badge badge-warning";
            case "completado": return "badge badge-neutral";
            default: return "badge badge-outline";
        }
    };

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Mis Eventos</h1>
                <div className="tabs tabs-boxed mb-8">
                    <button className={`tab ${activeTab === "proximos" ? "tab-active" : ""}`} onClick={() => setActiveTab("proximos")}>Próximos eventos</button>
                    <button className={`tab ${activeTab === "pasados" ? "tab-active" : ""}`} onClick={() => setActiveTab("pasados")}>Eventos pasados</button>
                    <button className={`tab ${activeTab === "pendientes" ? "tab-active" : ""}`} onClick={() => setActiveTab("pendientes")}>Pendientes</button>
                </div>
                {eventosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {eventosFiltrados.map(evento => (
                            <div key={evento.id} className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div>
                                            <h2 className="card-title">{evento.nombre}</h2>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className={getBadgeClass(evento.estado)}>{evento.estado}</span>
                                                <span className="badge badge-outline">{evento.tipo}</span>
                                            </div>
                                        </div>
                                        <div className="text-right mt-4 md:mt-0">
                                            <p className="text-2xl font-bold">${evento.precio.toLocaleString()}</p>
                                            <p className="text-sm">{evento.invitados} invitados</p>
                                        </div>
                                    </div>
                                    <div className="divider my-2"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="font-semibold">Fecha y hora</p>
                                            <p>{new Date(evento.fecha).toLocaleDateString()} - {evento.hora}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Salón</p>
                                            <p>{evento.salon}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Acciones</p>
                                            <div className="flex gap-2 mt-1">
                                                <button className="btn btn-sm btn-outline">Detalles</button>
                                                <button className="btn btn-sm btn-primary">Editar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-bold mb-2">No hay eventos</h3>
                        <button className="btn btn-primary mt-4">Crear nuevo evento</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisEventos;
