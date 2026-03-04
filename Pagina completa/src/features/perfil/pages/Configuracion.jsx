// src/features/perfil/pages/Configuracion.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Configuracion = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");

  const [userData, setUserData] = useState({
    nombre: user?.nombre || user?.name || "Usuario",
    email: user?.email || "",
    telefono: user?.telefono || "",
    empresa: user?.empresa || "",
    puesto: user?.puesto || "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    promociones: true,
    recordatorios: true,
    newsletter: false,
  });

  const [passwords, setPasswords] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const [preferences, setPreferences] = useState({
    idioma: "Español",
    zona: "(UTC-05:00) Bogotá, Lima",
    formato: "DD/MM/AAAA",
    modoOscuro: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Cambios guardados correctamente");
  };

  const tabs = [
    { id: "perfil", label: "Perfil" },
    { id: "notificaciones", label: "Notificaciones" },
    { id: "seguridad", label: "Seguridad" },
    { id: "preferencias", label: "Preferencias" },
  ];

  return (
    <div className="min-h-screen bg-base-100 py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter mb-2">Configuración</h1>
            <p className="text-lg opacity-60 font-medium lowercase italic">
              Gestión de cuenta, seguridad y preferencias personales
            </p>
          </div>
          {/* Tabs */}
          <div className="tabs tabs-boxed bg-base-200 p-1 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab px-6 rounded-xl font-bold transition-all ${activeTab === tab.id
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

        {/* Contenido */}
        <div className="card bg-base-100 shadow-xl border border-base-200 rounded-[2.5rem] overflow-hidden">
          <div className="card-body p-10">

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
                <h2 className="text-4xl font-extrabold tracking-tight mb-8">
                  Información del Perfil
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Nombre completo", name: "nombre", type: "text" },
                      { label: "Correo electrónico", name: "email", type: "email" },
                      { label: "Teléfono", name: "telefono", type: "tel" },
                      { label: "Empresa", name: "empresa", type: "text" },
                    ].map((field) => (
                      <div key={field.name} className="form-control">
                        <label className="label">
                          <span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">
                            {field.label}
                          </span>
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={userData[field.name]}
                          onChange={handleInputChange}
                          className="input input-bordered rounded-2xl bg-base-200/50 border-base-300 focus:border-primary focus:outline-none transition-all"
                        />
                      </div>
                    ))}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">
                          Puesto
                        </span>
                      </label>
                      <input
                        type="text"
                        name="puesto"
                        value={userData.puesto}
                        onChange={handleInputChange}
                        className="input input-bordered rounded-2xl bg-base-200/50 border-base-300 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="card-actions mt-10 pt-8 border-t border-base-content/5">
                    <button type="submit" className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg">
                      Guardar Cambios
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
                    { name: "email", label: "Notificaciones por correo electrónico", desc: "Recibe alertas directamente en tu bandeja de entrada" },
                    { name: "promociones", label: "Promociones y ofertas especiales", desc: "Entérate primero de nuestras ofertas exclusivas" },
                    { name: "recordatorios", label: "Recordatorios de eventos", desc: "Avisos anticipados sobre tus próximos eventos" },
                    { name: "newsletter", label: "Newsletter mensual", desc: "Resumen mensual de novedades y tendencias" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-6 bg-base-200/50 rounded-2xl border border-base-300 hover:border-primary/30 transition-all"
                    >
                      <div>
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-xs opacity-50 mt-0.5 font-medium">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={notifications[item.name]}
                        onChange={handleNotificationChange}
                        className="toggle toggle-primary"
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

                <div className="space-y-6 mb-10">
                  {[
                    { label: "Contraseña actual", name: "actual" },
                    { label: "Nueva contraseña", name: "nueva" },
                    { label: "Confirmar nueva contraseña", name: "confirmar" },
                  ].map((field) => (
                    <div key={field.name} className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">
                          {field.label}
                        </span>
                      </label>
                      <input
                        type="password"
                        name={field.name}
                        value={passwords[field.name]}
                        onChange={handlePasswordChange}
                        className="input input-bordered rounded-2xl bg-base-200/50 border-base-300 focus:border-primary focus:outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="card-actions mb-10 pb-10 border-b border-base-content/5">
                  <button
                    className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                    onClick={() => toast.success("Contraseña actualizada exitosamente")}
                  >
                    Cambiar Contraseña
                  </button>
                </div>

                <div>
                  <p className="text-xs font-bold opacity-30 uppercase tracking-widest mb-6">
                    Sesiones Activas
                  </p>
                  <div className="flex items-center justify-between p-6 bg-base-200/50 rounded-2xl border border-base-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Chrome en Windows</p>
                        <p className="text-xs opacity-50 font-medium">Bogotá, Colombia — Sesión actual</p>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline btn-error rounded-xl btn-sm px-6 normal-case font-bold"
                      onClick={() => toast.error("Sesión cerrada")}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── PREFERENCIAS ── */}
            {activeTab === "preferencias" && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="badge badge-accent py-4 px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em]">
                    Personalización
                  </div>
                  <div className="badge badge-outline py-4 px-6 rounded-xl font-bold opacity-30 text-[10px] tracking-widest">
                    Experiencia de Usuario
                  </div>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-10">
                  Preferencias de la Aplicación
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      label: "Idioma",
                      name: "idioma",
                      options: ["Español", "English"],
                    },
                    {
                      label: "Zona horaria",
                      name: "zona",
                      options: ["(UTC-05:00) Bogotá, Lima", "(UTC-06:00) Centro de México", "(UTC-08:00) Pacífico"],
                    },
                    {
                      label: "Formato de fecha",
                      name: "formato",
                      options: ["DD/MM/AAAA", "MM/DD/AAAA", "AAAA-MM-DD"],
                    },
                  ].map((field) => (
                    <div key={field.name} className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-bold uppercase tracking-widest opacity-40">
                          {field.label}
                        </span>
                      </label>
                      <select
                        name={field.name}
                        value={preferences[field.name]}
                        onChange={handlePreferenceChange}
                        className="select select-bordered rounded-2xl bg-base-200/50 border-base-300 focus:border-primary focus:outline-none transition-all"
                      >
                        {field.options.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-6 bg-base-200/50 rounded-2xl border border-base-300 hover:border-primary/30 transition-all">
                    <div>
                      <p className="font-bold text-sm">Modo oscuro</p>
                      <p className="text-xs opacity-50 mt-0.5 font-medium">Cambia la apariencia de la aplicación</p>
                    </div>
                    <input
                      type="checkbox"
                      name="modoOscuro"
                      checked={preferences.modoOscuro}
                      onChange={handlePreferenceChange}
                      className="toggle toggle-primary"
                    />
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-base-content/5">
                  <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
                    <span className="text-4xl font-black text-primary mb-2">v2.0</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Versión App</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
                    <span className="text-4xl font-black text-secondary mb-2">100%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Perfil Completo</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
                    <span className="text-4xl font-black text-accent mb-2">Pro</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Plan Actual</span>
                  </div>
                </div>

                <div className="card-actions mt-8">
                  <button
                    className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                    onClick={() => toast.success("Preferencias guardadas exitosamente")}
                  >
                    Guardar Preferencias
                  </button>
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