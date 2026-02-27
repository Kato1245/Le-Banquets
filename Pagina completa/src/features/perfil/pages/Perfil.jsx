import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/shared/services/apiClient";
import toast from "react-hot-toast";

const Perfil = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.put("/auth/profile", {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
      });

      if (res.data.success) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Perfil actualizado correctamente");
      }
    } catch (err) {
      toast.error(err.friendlyMessage || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Header / Portada */}
      <div className="relative h-64 w-full bg-primary/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 max-w-5xl pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lado Izquierdo: Tarjeta de Identidad */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-2xl border border-primary/10 overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <div className="card-body items-center text-center pt-8 pb-10">
                <div className="avatar mb-6">
                  <div className="bg-base-300 rounded-full w-32 ring-4 ring-base-100 shadow-xl flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-base-content/40 mt-3">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h2 className="card-title text-3xl font-extrabold">{user.nombre || "Usuario"}</h2>
                <p className="text-base-content/60 text-sm mb-4">{user.email}</p>
                <div className="badge badge-primary font-bold uppercase tracking-widest text-[10px] px-4 py-3">
                  {user.userType || user.role || 'Usuario'}
                </div>

                <div className="divider opacity-50"></div>

                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-50 font-medium">Estado de Cuenta</span>
                    <span className="badge badge-success badge-sm badge-outline font-bold">ACTIVO</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-50 font-medium">ID Miembro</span>
                    <span className="font-mono text-xs opacity-70">#{user.id?.slice(-8) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Contenido Interactivo */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card bg-base-100 shadow-xl border border-primary/5">
              <div className="card-body p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Información Personal</h3>
                  {!isEditing && (
                    <button
                      className="btn btn-primary btn-sm btn-outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-bold">Nombre Completo</span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'bg-base-200'}`}
                        required
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-bold">Correo Electrónico</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'bg-base-200'}`}
                        required
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-bold">Teléfono de Contacto</span>
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'bg-base-200'}`}
                        placeholder="Ej: +57 321 456 7890"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 justify-end mt-8 border-t pt-6">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary px-8"
                        disabled={loading}
                      >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : "Guardar Cambios"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-primary/5">
              <div className="card-body p-6">
                <h4 className="font-bold text-sm opacity-50 uppercase tracking-wider mb-4">Seguridad</h4>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-bold">Contraseña</p>
                    <p className="text-sm opacity-70">Actualiza tu contraseña periódicamente</p>
                  </div>
                  <button className="btn btn-ghost btn-sm border-base-300">Cambiar Contraseña</button>
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
