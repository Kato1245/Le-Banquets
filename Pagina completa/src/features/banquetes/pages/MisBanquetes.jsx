// src/features/banquetes/pages/MisBanquetes.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";

const MisBanquetes = () => {
    const { user } = useAuth();
    const [banquetes, setBanquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user && user.userType === "propietario") fetchBanquetes();
    }, [user]);

    const fetchBanquetes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/banquetes/mis-banquetes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBanquetes(data.banquetes || []);
            }
        } catch (error) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Mis Banquetes</h1>
                {banquetes.map(b => (
                    <div key={b._id} className="card bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h2 className="card-title">{b.nombre}</h2>
                            <p>{b.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MisBanquetes;
