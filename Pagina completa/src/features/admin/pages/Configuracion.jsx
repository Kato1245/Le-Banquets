// src/features/admin/pages/Configuracion.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Configuracion = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState("perfil");
    const [isLoading, setIsLoading] = useState(false);

    // Initial state from context
    const [formData, setFormData] = useState({
        nombre: user?.nombre || "",
        email: user?.email || "",
        telefono: user?.telefono || "",
        documento: user?.documento || "",
        rut: user?.rut || ""
    });

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Placeholder: simulate API call or use context
            if (updateUser) {
                await updateUser(formData);
                toast.success("Perfil actualizado con éxito");
            } else {
                toast.info("Función de actualización en preparación");
            }
        } catch (error) {
            toast.error("Error al actualizar perfil");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error("Las contraseñas nuevas no coinciden");
            return;
        }
        toast.info("Cambio de contraseña próximamente disponible");
    };

    const sidebarItems = [
        { id: "perfil", label: "Información General", icon: "👤" },
        { id: "seguridad", label: "Seguridad y Acceso", icon: "🔒" },
        { id: "notificaciones", label: "Notificaciones", icon: "🔔" },
        { id: "preferencias", label: "Preferencias Pro", icon: "⚙️" }
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-base-100 py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header Title */}
                <div className="mb-12 border-b border-base-content/5 pb-8">
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Ajustes de Sistema</h1>
                    <p className="text-lg opacity-40 font-medium italic">Configuración de Experiencia y Seguridad de Cuenta</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-base-200/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-base-300 sticky top-24">
                            <ul className="space-y-2">
                                {sidebarItems.map(item => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id
                                                    ? "bg-primary text-primary-content shadow-lg scale-[1.02]"
                                                    : "hover:bg-base-300 opacity-60 hover:opacity-100"
                                                }`}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:w-3/4">
                        <div className="bg-base-100 border border-base-200 shadow-2xl rounded-[3rem] p-10 md:p-16 animate-in fade-in slide-in-from-right-5 duration-500">

                            {/* Profile Tab */}
                            {activeTab === "perfil" && (
                                <div className="space-y-10">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-24 h-24 bg-primary text-primary-content rounded-full flex items-center justify-center text-4xl font-black shadow-xl">
                                            {user.nombre?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black mb-1">{user.nombre}</h2>
                                            <p className="badge badge-outline py-3 px-4 rounded-lg font-bold uppercase tracking-widest text-[10px] opacity-40">
                                                {user.userType || user.role || 'Usuario'} Premium
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Nombre Completo</label>
                                            <input
                                                type="text" name="nombre" value={formData.nombre} onChange={handleInputChange}
                                                className="input input-bordered focus:input-primary rounded-2xl font-bold h-14 bg-base-200/30"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Correo Electrónico</label>
                                            <input
                                                type="email" name="email" value={formData.email} onChange={handleInputChange} disabled
                                                className="input input-bordered rounded-2xl font-bold h-14 opacity-50 cursor-not-allowed bg-base-200/30"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Teléfono de Contacto</label>
                                            <input
                                                type="text" name="telefono" value={formData.telefono} onChange={handleInputChange}
                                                className="input input-bordered focus:input-primary rounded-2xl font-bold h-14 bg-base-200/30"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Identificación / Documento</label>
                                            <input
                                                type="text" name="documento" value={formData.documento} onChange={handleInputChange}
                                                className="input input-bordered focus:input-primary rounded-2xl font-bold h-14 bg-base-200/30"
                                            />
                                        </div>

                                        <div className="md:col-span-2 pt-8">
                                            <button
                                                type="submit" disabled={isLoading}
                                                className="btn btn-primary btn-lg rounded-2xl px-12 font-black uppercase text-sm tracking-widest shadow-xl"
                                            >
                                                {isLoading ? <span className="loading loading-spinner"></span> : "Sincronizar Datos"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "seguridad" && (
                                <div className="space-y-10">
                                    <h2 className="text-3xl font-black mb-8 border-b border-base-content/5 pb-4">Credenciales de Acceso</h2>

                                    <form onSubmit={handleUpdatePassword} className="max-w-md space-y-6">
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Contraseña Actual</label>
                                            <input
                                                type="password" name="current" value={passwords.current} onChange={handlePasswordChange}
                                                className="input input-bordered focus:input-primary rounded-2xl font-bold h-14 bg-base-200/30"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Nueva Contraseña</label>
                                            <input
                                                type="password" name="new" value={passwords.new} onChange={handlePasswordChange}
                                                className="input input-bordered focus:input-primary rounded-2xl font-bold h-14 bg-base-200/30"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label-text font-black uppercase tracking-widest text-[10px] mb-2 opacity-40">Confirmar Nueva Contraseña</label>
                                            <input
                                                type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange}
                                                className="input input-bordered focus:input-primary rounded-2xl font-bold h-14 bg-base-200/30"
                                            />
                                        </div>

                                        <div className="pt-8">
                                            <button type="submit" className="btn btn-neutral btn-lg rounded-2xl px-10 font-black uppercase text-xs tracking-widest">
                                                Blindar Cuenta
                                            </button>
                                        </div>
                                    </form>

                                    <div className="bg-error/5 p-8 rounded-3xl border border-error/10 mt-16">
                                        <h4 className="text-error font-black uppercase tracking-widest text-xs mb-4">Zona de Peligro</h4>
                                        <p className="text-sm opacity-60 mb-6 font-medium">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de haber cerrado todos tus eventos pendientes.</p>
                                        <button className="btn btn-error btn-outline btn-sm rounded-xl font-bold px-6">Desactivar Cuenta Definitivamente</button>
                                    </div>
                                </div>
                            )}

                            {/* Placeholder Tabs */}
                            {(activeTab === "notificaciones" || activeTab === "preferencias") && (
                                <div className="py-20 text-center opacity-30">
                                    <div className="text-7xl mb-6">🛰️</div>
                                    <h3 className="text-2xl font-black uppercase tracking-widest">Módulo en Desarrollo</h3>
                                    <p className="mt-4 font-medium italic">Estamos calibrando las frecuencias para una experiencia óptima.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;
