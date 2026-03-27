// src/features/perfil/pages/Configuracion.jsx
import { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import apiClient from "../../../shared/services/apiClient";

const Configuracion = () => {
  const { user, updateUser, changePassword, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(user?.foto_perfil || null);

  const [userData, setUserData] = useState({
    nombre: user?.nombre || user?.name || "Usuario",
    email: user?.email || "",
    telefono: user?.telefono || "",
    empresa: user?.empresa || "",
    puesto: user?.puesto || "",
  });

  const [notifications, setNotifications] = useState({
    email: user?.notificaciones?.email ?? true,
    promociones: user?.notificaciones?.promociones ?? true,
    recordatorios: user?.notificaciones?.recordatorios ?? true,
    newsletter: user?.notificaciones?.newsletter ?? false,
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
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5 MB");
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await apiClient.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setFotoPerfil(res.data.data.foto_perfil);
        toast.success("Foto de perfil actualizada");
      } else {
        toast.error(res.data.message || "Error al subir la imagen");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error de conexión al subir la imagen",
      );
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (updateUser) {
        await updateUser(userData);
        toast.success("Cambios guardados correctamente");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error al actualizar perfil",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwords.actual || !passwords.nueva) {
      toast.error("Debes llenar la contraseña actual y la nueva");
      return;
    }
    if (passwords.nueva !== passwords.confirmar) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    setIsPasswordUpdating(true);
    try {
      await changePassword(passwords.actual, passwords.nueva);
      toast.success("Contraseña actualizada exitosamente");
      setPasswords({ actual: "", nueva: "", confirmar: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error al actualizar contraseña",
      );
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Debes ingresar tu contraseña actual");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Contraseña incorrecta o error al eliminar",
      );
    } finally {
      setIsDeleting(false);
    }
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
            <h1 className="text-5xl font-extrabold tracking-tighter mb-2">
              Configuración
            </h1>
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

                {/* Avatar + nombre (Usuario) */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 bg-gradient-to-br from-base-200/30 to-base-300/10 rounded-[2rem] border border-base-300/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    title="Cambiar foto de perfil"
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-28 h-28 bg-base-100 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-base-100 ring-2 ring-primary/20 overflow-hidden">
                      {fotoPerfil ? (
                        <img
                          src={fotoPerfil}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                          {(userData.nombre || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Overlay de cámara siempre visible en hover */}
                    <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/30">
                      {avatarUploading ? (
                        <span className="loading loading-spinner loading-md text-white"></span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white drop-shadow"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
                      {userData.nombre}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="badge badge-primary badge-lg py-4 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                        {user.userType || user.role || "Usuario"}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        label: "Nombre completo",
                        name: "nombre",
                        type: "text",
                      },
                      {
                        label: "Correo electrónico",
                        name: "email",
                        type: "email",
                      },
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
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner" />
                      ) : (
                        "Guardar Cambios"
                      )}
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
                  Selecciona qué tipo de notificaciones deseas recibir en tu
                  cuenta.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      name: "email",
                      label: "Notificaciones por correo electrónico",
                      desc: "Recibe alertas directamente en tu bandeja de entrada",
                    },
                    {
                      name: "promociones",
                      label: "Promociones y ofertas especiales",
                      desc: "Entérate primero de nuestras ofertas exclusivas",
                    },
                    {
                      name: "recordatorios",
                      label: "Recordatorios de eventos",
                      desc: "Avisos anticipados sobre tus próximos eventos",
                    },
                    {
                      name: "newsletter",
                      label: "Newsletter mensual",
                      desc: "Resumen mensual de novedades y tendencias",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-6 bg-base-200/50 rounded-2xl border border-base-300 hover:border-primary/30 transition-all"
                    >
                      <div>
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className="text-xs opacity-50 mt-0.5 font-medium">
                          {item.desc}
                        </p>
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
                    disabled={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        if (updateUser) {
                          await updateUser({ notificaciones });
                          toast.success("Preferencias de notificación guardadas");
                        }
                      } catch (error) {
                        toast.error("Error al guardar preferencias");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner" />
                    ) : (
                      "Guardar Preferencias"
                    )}
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

                <form onSubmit={handleUpdatePassword}>
                  <div className="space-y-6 mb-10">
                    {[
                      { label: "Contraseña actual", name: "actual" },
                      { label: "Nueva contraseña", name: "nueva" },
                      {
                        label: "Confirmar nueva contraseña",
                        name: "confirmar",
                      },
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
                      type="submit"
                      disabled={isPasswordUpdating}
                      className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                    >
                      {isPasswordUpdating ? (
                        <span className="loading loading-spinner" />
                      ) : (
                        "Cambiar Contraseña"
                      )}
                    </button>
                  </div>
                </form>

                <div>
                  <p className="text-xs font-bold opacity-30 uppercase tracking-widest mb-6">
                    Sesiones Activas
                  </p>
                  <div className="flex items-center justify-between p-6 bg-base-200/50 rounded-2xl border border-base-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Chrome en Windows</p>
                        <p className="text-xs opacity-50 font-medium">
                          Bogotá, Colombia — Sesión actual
                        </p>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline btn-error rounded-xl btn-sm px-6 normal-case font-bold"
                      onClick={() => toast.error("Sesión cerrada (Demo)")}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>

                {/* Zona de peligro */}
                <div className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-error/5 to-transparent border border-error/10 overflow-hidden relative">
                  <div className="relative z-10 text-center sm:text-left">
                    <h4 className="text-error font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center justify-center sm:justify-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Zona de Peligro
                    </h4>
                    <p className="text-sm opacity-60 mb-6 font-medium max-w-xl leading-relaxed">
                      Una vez que elimines tu cuenta, no hay vuelta atrás.
                      Asegúrate de haber guardado tu información relevante.
                      Todos tus datos serán borrados permanentemente.
                    </p>
                    <button
                      className="btn btn-error btn-outline border-2 rounded-xl font-black px-10 normal-case hover:bg-error hover:text-white transition-all shadow-sm"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Eliminar Cuenta
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
                      options: [
                        "(UTC-05:00) Bogotá, Lima",
                        "(UTC-06:00) Centro de México",
                        "(UTC-08:00) Pacífico",
                      ],
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
                      <p className="text-xs opacity-50 mt-0.5 font-medium">
                        Cambia la apariencia de la aplicación
                      </p>
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
                    <span className="text-4xl font-black text-primary mb-2">
                      v2.0
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">
                      Versión App
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
                    <span className="text-4xl font-black text-secondary mb-2">
                      100%
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">
                      Perfil Completo
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 bg-base-200/50 rounded-3xl border border-base-300">
                    <span className="text-4xl font-black text-accent mb-2">
                      Pro
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">
                      Plan Actual
                    </span>
                  </div>
                </div>

                <div className="card-actions mt-8">
                  <button
                    className="btn btn-primary rounded-xl px-10 normal-case font-bold shadow-lg"
                    onClick={() =>
                      toast.success("Preferencias guardadas exitosamente")
                    }
                  >
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Modal de Eliminar Cuenta */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-base-100 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="font-black text-2xl text-error mb-4">
                ¡Peligro! Eliminar Cuenta
              </h3>
              <p className="opacity-70 text-sm mb-6">
                Esta acción no se puede deshacer. Por favor ingresa tu
                contraseña actual para confirmar la eliminación de tu cuenta.
              </p>
              <div className="form-control mb-6">
                <input
                  type="password"
                  placeholder="Tu contraseña actual"
                  className="input input-bordered w-full"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;
