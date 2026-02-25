// src/features/banquetes/pages/MisBanquetes.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../config/api";

const MisBanquetes = () => {
    const { token } = useAuth();
    const [banquetes, setBanquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBanquetes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchBanquetes = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_BASE_URL}/banquetes/mis-banquetes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Error al cargar los banquetes');
            }

            const data = await res.json();
            setBanquetes(data.banquetes || []);
        } catch (err) {
            setError(err.message || "Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 py-8 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Mis Banquetes</h1>

                {/* Estado de error */}
                {error && (
                    <div className="alert alert-error mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                        <button className="btn btn-sm btn-ghost" onClick={fetchBanquetes}>Reintentar</button>
                    </div>
                )}

                {/* Estado vacío */}
                {!error && banquetes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <h2 className="text-xl font-semibold mb-2">No tienes banquetes registrados</h2>
                        <p className="text-base-content/60">Crea tu primer banquete para que aparezca aquí.</p>
                    </div>
                )}

                {/* Lista de banquetes */}
                {banquetes.map(b => (
                    <div key={b._id} className="card bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h2 className="card-title">{b.nombre}</h2>
                            <p>{b.descripcion}</p>
                            {b.precio_base && (
                                <p className="text-sm text-base-content/60">
                                    Precio base: ${b.precio_base.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisBanquetes;
