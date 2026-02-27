// src/features/banquetes/pages/MisBanquetes.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../config/api";

const MisBanquetes = () => {
    const { user, token } = useAuth();
    const [banquetes, setBanquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user && (user.userType === "propietario" || user.role === "propietario")) {
            fetchBanquetes();
        }
    }, [user]);

    const fetchBanquetes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/banquetes/mis-banquetes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBanquetes(data.banquetes || data.data || []);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error al cargar banquetes");
            }
        } catch (error) {
            setError("Error de conexión con el servidor");
            toast.error("Error al conectar con la base de datos");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mi Portafolio de Espacios</h1>
                        <p className="text-lg opacity-60">Gestiona tus salones y banquetes disponibles para reserva.</p>
                    </div>
                    <button className="btn btn-primary rounded-xl px-10 shadow-lg normal-case font-bold" onClick={() => toast.info("Módulo de creación próximamente")}>
                        + Publicar Nuevo Salón
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error mb-8 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                {banquetes.length === 0 ? (
                    <div className="text-center py-20 bg-base-200/50 rounded-[3rem] border border-dashed border-base-content/20">
                        <div className="text-8xl mb-6 opacity-20">🏰</div>
                        <h3 className="text-2xl font-bold mb-4">Aún no tienes banquetes publicados</h3>
                        <p className="max-w-md mx-auto opacity-50 mb-8">
                            Empieza a rentabilizar tus espacios. Publica tu primer salón y llega a miles de clientes potenciales.
                        </p>
                        <button className="btn btn-outline btn-primary rounded-xl px-8" onClick={() => toast.info("Módulo de creación próximamente")}>
                            Crear mi primera publicación
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {banquetes.map(b => (
                            <div key={b._id} className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
                                <figure className="h-60 relative">
                                    <img
                                        src={b.imagenes?.[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                                        alt={b.nombre}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <div className={`badge ${b.estado === 'activo' ? 'badge-success' : 'badge-ghost'} py-3 font-bold uppercase text-[10px] tracking-widest`}>
                                            {b.estado || 'En Revisión'}
                                        </div>
                                    </div>
                                </figure>
                                <div className="card-body p-8">
                                    <h2 className="card-title text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{b.nombre}</h2>
                                    <p className="text-sm opacity-60 line-clamp-2 mb-6">{b.descripcion || "Sin descripción disponible."}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-base-content/5 mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase font-bold opacity-30 tracking-tighter">Capacidad</span>
                                            <span className="font-bold">{b.capacidad || 0} personas</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs uppercase font-bold opacity-30 tracking-tighter">Precio Base</span>
                                            <span className="text-xl font-extrabold text-primary">${(b.precio || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end mt-8 gap-3">
                                        <button className="btn btn-ghost btn-sm rounded-lg opacity-40 hover:opacity-100" onClick={() => toast.info("Edición no disponible")}>Editar</button>
                                        <button className="btn btn-outline btn-primary btn-sm rounded-lg" onClick={() => toast.info("Ver estadísticas")}>Estadísticas</button>
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

export default MisBanquetes;
