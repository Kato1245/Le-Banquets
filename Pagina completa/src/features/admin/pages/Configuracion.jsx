// src/features/admin/pages/Configuracion.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Configuracion = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState("perfil");
    const [isLoading, setIsLoading] = useState(false);

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

    const [notifications, setNotifications] = useState({
        email: true,
        reservas: true,
        recordatorios: true,
        newsletter: false,
    });




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    };



    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (updateUser) {
                await updateUser(formData);
                toast.success("Perfil actualizado con éxito");
            } else {
                toast.info("Función de actualización en preparación");
            }
        } catch {
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

    const tabs = [
        { id: "perfil", label: "Perfil" },
        { id: "notificaciones", label: "Notificaciones" },
        { id: "seguridad", label: "Seguridad" },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-base-100 py-16">
            <div className="max-w-4xl mx-auto px-4 md:px-8">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tighter mb-2">Configuración</h1>
                        <p className="text-lg opacity-60 font-medium lowercase italic">
                            Gestión de cuenta, seguridad y preferencias personales
                        </p>
                    </div>

                    {/* Tabs — mismo estilo que MisEventos */}
                    <div className="tabs tabs-boxed bg-base-200 p-1 rounded-2xl flex-nowrap">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm ${activeTab === tab.id
                                    ? "tab-active bg-primary text-primary-content shadow-lg"
                                    : ""
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Card principal ── */}
                <div className="card bg-base-100 shadow-xl border border-base-200 rounded-[2.5rem] overflow-hidden">
                    <div className="card-body p-8 sm:p-12">

                        {/* ── PERFIL ── */}
                        {activeTab === "perfil" && (
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="badge badge-primary py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]">
                                        Cuenta
                                    </div>
                                    <div className="badge badge-outline py-4 px-6 rounded-xl font-bold opacity-30 text-[10px] tracking-widest">
                                        Datos Personales
                                    </div>
                                </div>

                                {/* Avatar + nombre */}
                                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 bg-gradient-to-br from-base-200/30 to-base-300/10 rounded-[2rem] border border-base-300/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative w-28 h-28 bg-base-100 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-base-100 ring-2 ring-primary/20 overflow-hidden">
                                            <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                                                {user.nombre?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">{user.nombre}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            <span className="badge badge-primary badge-lg py-4 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                                {user.userType || user.role || "Usuario"} Premium
                                            </span>
                                            <span className="badge badge-outline badge-lg py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] opacity-50 border-base-content/20">
                                                ID: {user.id?.slice(-8) || "SENA-2024"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { label: "Nombre Completo", name: "nombre", type: "text", disabled: false },
                                            { label: "Correo Electrónico", name: "email", type: "email", disabled: true },
                                            { label: "Teléfono de Contacto", name: "telefono", type: "text", disabled: false },
                                            { label: "Identificación / Documento", name: "documento", type: "text", disabled: false },
                                            { label: "RUT / Registro Único", name: "rut", type: "text", disabled: false },
                                        ].map(field => (
                                            <div key={field.name} className="form-control group animate-in slide-in-from-left-4 duration-500">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3 ml-1 group-focus-within:text-primary group-focus-within:opacity-100 transition-all">
                                                    {field.label}
                                                </p>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleInputChange}
                                                    disabled={field.disabled}
                                                    placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                                                    className={`input input-bordered w-full rounded-2xl bg-base-200/40 border-base-300/50 focus:border-primary/50 focus:bg-base-100 focus:outline-none transition-all font-bold h-12 px-6 text-sm shadow-sm ${field.disabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:border-primary/30"}`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="card-actions mt-10 pt-8 border-t border-base-content/5">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                                        >
                                            {isLoading ? <span className="loading loading-spinner" /> : "Editar Perfil"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost rounded-xl px-8 normal-case font-bold opacity-60"
                                            onClick={() => toast.info("Cambios descartados")}
                                        >
                                            Descartar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── NOTIFICACIONES ── */}
                        {activeTab === "notificaciones" && (
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="badge badge-secondary py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]">
                                        Alertas
                                    </div>
                                    <div className="badge badge-outline py-4 px-6 rounded-xl font-bold opacity-30 text-[10px] tracking-widest">
                                        Canal de Comunicación
                                    </div>
                                </div>
                                <h2 className="text-4xl font-extrabold tracking-tight mb-4">
                                    Preferencias de Notificación
                                </h2>
                                <p className="opacity-50 font-medium mb-10 text-sm">
                                    Selecciona qué tipo de notificaciones deseas recibir en tu cuenta.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        {
                                            name: "email",
                                            label: "Notificaciones por correo electrónico",
                                            desc: "Recibe alertas directamente en tu bandeja de entrada",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            name: "reservas",
                                            label: "Actualizaciones de reservas",
                                            desc: "Cambios de estado en tus eventos y reservas",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            name: "recordatorios",
                                            label: "Recordatorios de eventos",
                                            desc: "Avisos anticipados sobre tus próximos eventos",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            )
                                        },
                                        {
                                            name: "newsletter",
                                            label: "Newsletter mensual",
                                            desc: "Resumen mensual de novedades y tendencias",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            )
                                        },
                                    ].map(item => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between p-6 bg-base-200/40 rounded-3xl border border-base-300/50 hover:bg-base-200/60 hover:border-primary/20 transition-all group animate-in slide-in-from-right-4 duration-500"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-base-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm tracking-tight">{item.label}</p>
                                                    <p className="text-[11px] uppercase tracking-wider opacity-40 mt-1 font-black">{item.desc}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                checked={notifications[item.name]}
                                                onChange={handleNotificationChange}
                                                className="toggle toggle-primary toggle-lg shadow-sm"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="card-actions mt-10 pt-8 border-t border-base-content/5">
                                    <button
                                        className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                                        onClick={() => toast.success("Preferencias de notificación guardadas")}
                                    >
                                        Guardar Preferencias
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── SEGURIDAD ── */}
                        {activeTab === "seguridad" && (
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="badge badge-warning text-warning-content py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]">
                                        Protección
                                    </div>
                                    <div className="badge badge-outline py-4 px-6 rounded-xl font-bold opacity-30 text-[10px] tracking-widest">
                                        Credenciales
                                    </div>
                                </div>
                                <h2 className="text-4xl font-extrabold tracking-tight mb-10">
                                    Seguridad de la Cuenta
                                </h2>

                                <form onSubmit={handleUpdatePassword} className="space-y-6 mb-10">
                                    {[
                                        { label: "Contraseña Actual", name: "current" },
                                        { label: "Nueva Contraseña", name: "new" },
                                        { label: "Confirmar Nueva Contraseña", name: "confirm" },
                                    ].map(field => (
                                        <div key={field.name} className="form-control group animate-in slide-in-from-left-4 duration-500">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3 ml-1 group-focus-within:text-primary group-focus-within:opacity-100 transition-all">
                                                {field.label}
                                            </p>
                                            <input
                                                type="password"
                                                name={field.name}
                                                value={passwords[field.name]}
                                                onChange={handlePasswordChange}
                                                placeholder={`••••••••`}
                                                className="input input-bordered w-full rounded-2xl bg-base-200/40 border-base-300/50 focus:border-primary/50 focus:bg-base-100 focus:outline-none transition-all font-bold h-12 px-6 text-sm shadow-sm hover:border-primary/30"
                                            />
                                        </div>
                                    ))}

                                    <div className="card-actions pt-4">
                                        <button type="submit" className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg">
                                            Cambiar Contraseña
                                        </button>
                                    </div>
                                </form>



                                {/* Zona de peligro */}
                                <div className="group p-8 rounded-[2.5rem] bg-gradient-to-br from-error/5 to-transparent border border-error/10 hover:border-error/20 transition-all duration-500 overflow-hidden relative">
                                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="relative z-10 text-center sm:text-left">
                                        <h4 className="text-error font-black uppercase tracking-[0.3em] text-[10px] mb-4 flex items-center justify-center sm:justify-start gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            Zona de Peligro
                                        </h4>
                                        <p className="text-sm opacity-60 mb-8 font-medium max-w-xl leading-relaxed">
                                            Una vez que elimines tu cuenta, no hay vuelta atrás. Asegúrate de haber cerrado todos tus eventos pendientes. Todos tus datos serán borrados permanentemente.
                                        </p>
                                        <button
                                            className="btn btn-error btn-outline border-2 rounded-2xl font-black px-10 normal-case hover:bg-error hover:text-white transition-all shadow-lg shadow-error/10"
                                            onClick={() => toast.error("Acción peligrosa — confirma en el popup")}
                                        >
                                            Desactivar Cuenta Definitivamente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;
