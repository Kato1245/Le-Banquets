// src/features/perfil/pages/Perfil.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import toast from "react-hot-toast"
import API_BASE_URL from "../../../config/api"

const Perfil = () => {
    const { user, token, setUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        fecha_nacimiento: "",
        documento: ""
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) loadUserData();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Carga los datos del perfil desde el servidor
    const loadUserData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const u = data.data?.user || data.data || {};
                setUserData({
                    nombre: u.nombre || "",
                    email: u.email || user.email,
                    telefono: u.telefono || "",
                    fecha_nacimiento: u.fecha_nacimiento || "",
                    documento: u.documento || ""
                });
            } else {
                // Fallback: usar datos del contexto
                setUserData({
                    nombre: user.nombre || "",
                    email: user.email || "",
                    telefono: user.telefono || "",
                    fecha_nacimiento: user.fecha_nacimiento || "",
                    documento: user.documento || ""
                });
            }
        } catch {
            setUserData({
                nombre: user.nombre || "",
                email: user.email || "",
                telefono: user.telefono || "",
                fecha_nacimiento: user.fecha_nacimiento || "",
                documento: user.documento || ""
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: userData.nombre,
                    email: userData.email,
                    telefono: userData.telefono
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Perfil actualizado correctamente");
                setIsEditing(false);
                // Actualizar estado global del usuario
                setUser(prev => ({ ...prev, nombre: userData.nombre, email: userData.email }));
                localStorage.setItem('user', JSON.stringify({ ...user, nombre: userData.nombre, email: userData.email }));
            } else {
                toast.error(data.message || "Error al actualizar el perfil");
            }
        } catch {
            toast.error("Error de conexión al guardar el perfil");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
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
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Mi Perfil</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Información Personal</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Nombre completo</span></label>
                                        {isEditing ? (
                                            <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} className="input input-bordered" />
                                        ) : (
                                            <p className="text-lg">{userData.nombre || "No especificado"}</p>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Correo electrónico</span></label>
                                        {isEditing ? (
                                            <input type="email" name="email" value={userData.email} onChange={handleChange} className="input input-bordered" />
                                        ) : (
                                            <p className="text-lg">{userData.email}</p>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Teléfono</span></label>
                                        {isEditing ? (
                                            <input type="tel" name="telefono" value={userData.telefono} onChange={handleChange} className="input input-bordered" />
                                        ) : (
                                            <p className="text-lg">{userData.telefono || "No especificado"}</p>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Fecha de Nacimiento</span></label>
                                        {isEditing ? (
                                            <input type="date" name="fecha_nacimiento" value={userData.fecha_nacimiento} onChange={handleChange} className="input input-bordered" />
                                        ) : (
                                            <p className="text-lg">{userData.fecha_nacimiento || "No especificada"}</p>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Documento</span></label>
                                        {isEditing ? (
                                            <input type="text" name="documento" value={userData.documento} onChange={handleChange} className="input input-bordered" />
                                        ) : (
                                            <p className="text-lg">{userData.documento || "No especificado"}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="card-actions justify-end mt-6">
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => setIsEditing(false)} className="btn btn-ghost" disabled={saving}>
                                                Cancelar
                                            </button>
                                            <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                                                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Guardar Cambios"}
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                                            Editar Perfil
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title">Mi Avatar</h3>
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold mb-4">
                                        {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <p className="text-sm text-base-content/60 text-center">
                                        {user?.userType === 'propietario' ? 'Propietario' : 'Usuario'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Perfil
