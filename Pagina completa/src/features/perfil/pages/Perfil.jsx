// src/features/perfil/pages/Perfil.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../../../config/api";

const Perfil = () => {
  const { user, token, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    documento: "",
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para eliminar cuenta
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const u = data.data?.user || data.data || {};
        setFotoPerfil(u.foto_perfil || null);
        setUserData({
          nombre: u.nombre || user.nombre || "",
          email: u.email || user.email || "",
          telefono: u.telefono || "",
          fecha_nacimiento: (u.fecha_nacimiento || "").substring(0, 10),
          documento: u.documento || "",
        });
      } else {
        // Fallback: usar datos del contexto
        setUserData({
          nombre: user.nombre || "",
          email: user.email || "",
          telefono: user.telefono || "",
          fecha_nacimiento: (user.fecha_nacimiento || "").substring(0, 10),
          documento: user.documento || "",
        });
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setUserData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
        fecha_nacimiento: (user.fecha_nacimiento || "").substring(0, 10),
        documento: user.documento || "",
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: userData.nombre,
          email: userData.email,
          telefono: userData.telefono,
          fecha_nacimiento: userData.fecha_nacimiento,
          documento: userData.documento,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Perfil actualizado correctamente");
        setIsEditing(false);

        // Actualizar estado global
        const updatedUser = {
          ...user,
          nombre: userData.nombre,
          email: userData.email,
          // Asegurarnos de guardar los datos adicionales si los hay
          ...userData,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      toast.error("Error de conexión al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5 MB");
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // apiClient uses the interceptor for the token automatically
      const res = await apiClient.post("/auth/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      if (data.success) {
        setFotoPerfil(data.data.foto_perfil);
        const updatedUser = { ...user, foto_perfil: data.data.foto_perfil };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Foto de perfil actualizada");
      } else {
        toast.error(data.message || "Error al subir la imagen");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error de conexión al subir la imagen",
      );
    } finally {
      setAvatarUploading(false);
      // Limpiar input para permitir volver a seleccionar el mismo archivo
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Debes ingresar tu contraseña para eliminar la cuenta");
      return;
    }

    setDeletingAccount(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contrasena: deletePassword }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Cuenta eliminada correctamente");
        // El AuthContext maneja el logout y limpieza, sin embargo necesitamos
        // emitir el evento o llamar la función. Pero como necesitamos context:
        // Se disparó evento o podemos limpiar localStorage y redirigir
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error(data.message || "Error al eliminar la cuenta");
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      toast.error("Error de conexión al eliminar la cuenta");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 py-8 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Configuración de Perfil
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary px-8 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Editar Perfil
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Izquierdo: Avatar y Estado */}
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl border border-base-300">
              <div className="card-body items-center text-center p-8">
                {/* Input file oculto */}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cambiar foto de perfil"
                >
                  {fotoPerfil ? (
                    <img
                      src={fotoPerfil}
                      alt="Foto de perfil"
                      className="w-32 h-32 rounded-full object-cover shadow-2xl transition-transform group-hover:scale-105 group-hover:brightness-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl font-bold shadow-2xl transition-transform group-hover:scale-105 group-hover:brightness-75">
                      {userData.nombre
                        ? userData.nombre.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}

                  {/* Overlay de cámara siempre visible en hover */}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                <h2 className="mt-4 text-2xl font-bold">
                  {userData.nombre || "Usuario"}
                </h2>
                <p className="text-base-content/60 font-medium">
                  {user?.role === "admin"
                    ? "Administrador"
                    : user?.userType === "propietario"
                      ? "Propietario"
                      : "Cliente"}
                </p>
                <div className="divider my-2"></div>
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60">Miembro desde</span>
                    <span className="font-medium">
                      {new Date(
                        user?.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Seguridad Rápida */}
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-warning"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Seguridad
                </h3>
                <button className="btn btn-outline btn-sm w-full justify-start normal-case">
                  Cambiar Contraseña
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="btn btn-outline btn-error btn-sm w-full justify-start normal-case mt-2"
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho: Formulario de Información */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-2xl border border-base-200">
              <div className="card-body p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold opacity-70">
                        Nombre Completo
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nombre"
                        value={userData.nombre}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all rounded-xl"
                        placeholder="Ej. Juan Pérez"
                      />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">
                        {userData.nombre || "—"}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold opacity-70">
                        Correo Electrónico
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all rounded-xl"
                        placeholder="tu@correo.com"
                      />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">
                        {userData.email}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold opacity-70">
                        Teléfono Móvil
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="telefono"
                        value={userData.telefono}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all rounded-xl"
                        placeholder="+52 000 000 0000"
                      />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">
                        {userData.telefono || "No registrado"}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold opacity-70">
                        Fecha de Nacimiento
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="fecha_nacimiento"
                        value={userData.fecha_nacimiento}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all rounded-xl"
                      />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">
                        {userData.fecha_nacimiento || "No registrada"}
                      </div>
                    )}
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-bold opacity-70">
                        Documento de Identidad (DNI/INE/Cédula)
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="documento"
                        value={userData.documento}
                        onChange={handleChange}
                        className="input input-bordered focus:input-primary transition-all rounded-xl w-full"
                        placeholder="Número de documento"
                      />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">
                        {userData.documento || "No especificado"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions justify-end mt-10 gap-3">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-ghost rounded-xl px-8"
                        disabled={saving}
                      >
                        Descartar
                      </button>
                      <button
                        onClick={handleSave}
                        className="btn btn-primary rounded-xl px-8 shadow-lg min-w-[160px]"
                        disabled={saving}
                      >
                        {saving ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Guardar Cambios"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para eliminar cuenta */}
      {isDeleteDialogOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative bg-base-100 rounded-[2rem] p-8 max-w-sm">
            <button
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletePassword("");
              }}
              className="btn btn-sm btn-circle absolute right-4 top-4"
              disabled={deletingAccount}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-error mb-4">
              ¿Eliminar cuenta?
            </h3>
            <p className="py-2 text-base-content/70">
              Esta acción es permanente y no se puede deshacer. Por tu
              seguridad, ingresa tu contraseña para confirmar.
            </p>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-bold">Contraseña</span>
              </label>
              <input
                type="password"
                className="input input-bordered focus:input-error w-full rounded-xl"
                placeholder="Ingresa tu contraseña"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={deletingAccount}
              />
            </div>
            <div className="modal-action mt-8">
              <button
                className="btn btn-ghost rounded-xl"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletePassword("");
                }}
                disabled={deletingAccount}
              >
                Cancelar
              </button>
              <button
                className="btn btn-error rounded-xl shadow-lg px-8"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Eliminar definitivamente"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
