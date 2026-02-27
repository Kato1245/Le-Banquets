// src/features/perfil/pages/Perfil.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { toast } from "react-hot-toast"
import API_BASE_URL from "../../../config/api"

const Perfil = () => {
  const { user, token, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    documento: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const u = data.data?.user || data.data || {};
        setUserData({
          nombre: u.nombre || user.nombre || "",
          email: u.email || user.email || "",
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
    } catch (error) {
      console.error("Error cargando datos:", error);
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
          telefono: userData.telefono,
          fecha_nacimiento: userData.fecha_nacimiento,
          documento: userData.documento
        })
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
          ...userData
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
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
          <h1 className="text-4xl font-extrabold tracking-tight">Configuración de Perfil</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary px-8 rounded-xl shadow-lg hover:scale-105 transition-transform">
              Editar Perfil
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Izquierdo: Avatar y Estado */}
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl border border-base-300">
              <div className="card-body items-center text-center p-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl font-bold shadow-2xl transition-transform group-hover:scale-105">
                    {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-secondary shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                <h2 className="mt-4 text-2xl font-bold">{userData.nombre || "Usuario"}</h2>
                <p className="text-base-content/60 font-medium">
                  {user?.role === 'admin' ? 'Administrador' : user?.userType === 'propietario' ? 'Propietario' : 'Cliente'}
                </p>
                <div className="divider my-2"></div>
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60">ID Usuario</span>
                    <span className="font-mono text-xs">{user?.id?.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60">Miembro desde</span>
                    <span className="font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Seguridad Rápida */}
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Seguridad
                </h3>
                <button className="btn btn-outline btn-sm w-full justify-start normal-case">
                  Cambiar Contraseña
                </button>
                <button className="btn btn-outline btn-error btn-sm w-full justify-start normal-case mt-2">
                  Desactivar Cuenta
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho: Formulario de Información */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-2xl border border-base-200">
              <div className="card-body p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold opacity-70">Nombre Completo</span></label>
                    {isEditing ? (
                      <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} className="input input-bordered focus:input-primary transition-all rounded-xl" placeholder="Ej. Juan Pérez" />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">{userData.nombre || "—"}</div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold opacity-70">Correo Electrónico</span></label>
                    {isEditing ? (
                      <input type="email" name="email" value={userData.email} onChange={handleChange} className="input input-bordered focus:input-primary transition-all rounded-xl" placeholder="tu@correo.com" />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">{userData.email}</div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold opacity-70">Teléfono Móvil</span></label>
                    {isEditing ? (
                      <input type="tel" name="telefono" value={userData.telefono} onChange={handleChange} className="input input-bordered focus:input-primary transition-all rounded-xl" placeholder="+52 000 000 0000" />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">{userData.telefono || "No registrado"}</div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold opacity-70">Fecha de Nacimiento</span></label>
                    {isEditing ? (
                      <input type="date" name="fecha_nacimiento" value={userData.fecha_nacimiento} onChange={handleChange} className="input input-bordered focus:input-primary transition-all rounded-xl" />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">{userData.fecha_nacimiento || "No registrada"}</div>
                    )}
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-bold opacity-70">Documento de Identidad (DNI/INE/Cédula)</span></label>
                    {isEditing ? (
                      <input type="text" name="documento" value={userData.documento} onChange={handleChange} className="input input-bordered focus:input-primary transition-all rounded-xl w-full" placeholder="Número de documento" />
                    ) : (
                      <div className="p-3 bg-base-200 rounded-xl font-medium">{userData.documento || "No especificado"}</div>
                    )}
                  </div>
                </div>

                <div className="card-actions justify-end mt-10 gap-3">
                  {isEditing && (
                    <>
                      <button onClick={() => setIsEditing(false)} className="btn btn-ghost rounded-xl px-8" disabled={saving}>
                        Descartar
                      </button>
                      <button onClick={handleSave} className="btn btn-primary rounded-xl px-8 shadow-lg min-w-[160px]" disabled={saving}>
                        {saving ? <span className="loading loading-spinner loading-sm"></span> : "Guardar Cambios"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
