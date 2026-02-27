// src/pages/Perfil.jsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

const Perfil = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    documento: ""
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const endpoint = user.userType === 'propietario'
        ? 'http://localhost:3000/api/auth/profile/propietario'
        : 'http://localhost:3000/api/auth/profile/usuario';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          nombre: data.nombre || "",
          email: data.email || user.email,
          telefono: data.telefono || "",
          fecha_nacimiento: data.fecha_nacimiento || "",
          documento: data.documento || ""
        });
      } else {
        // Si falla, usar datos básicos del user
        setUserData({
          nombre: user.userData?.nombre || user.email.split('@')[0],
          email: user.email,
          telefono: user.userData?.telefono || "",
          fecha_nacimiento: user.userData?.fecha_nacimiento || "",
          documento: user.userData?.documento || ""
        });
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setUserData({
        nombre: user.userData?.nombre || user.email.split('@')[0],
        email: user.email,
        telefono: user.userData?.telefono || "",
        fecha_nacimiento: user.userData?.fecha_nacimiento || "",
        documento: user.userData?.documento || ""
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setMessage("Guardando cambios...");
      const token = localStorage.getItem("token");

      const endpoint = user.userType === 'propietario'
        ? 'http://localhost:3000/api/auth/profile/propietario'
        : 'http://localhost:3000/api/auth/profile/usuario';

      const response = await fetch(endpoint, {
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

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Perfil actualizado correctamente");
        setIsEditing(false);

        // Actualizar localStorage
        const updatedUser = {
          ...user,
          userData: {
            ...user.userData,
            nombre: userData.nombre,
            email: userData.email,
            telefono: userData.telefono,
            fecha_nacimiento: userData.fecha_nacimiento,
            documento: userData.documento
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMessage("❌ Error de conexión");
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
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mi Perfil</h1>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'} mb-6`}>
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información del usuario */}
          <div className="md:col-span-2">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Información Personal</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nombre completo</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nombre"
                        value={userData.nombre}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.nombre}</p>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Correo electrónico</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.email}</p>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Teléfono</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="telefono"
                        value={userData.telefono}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.telefono || "No especificado"}</p>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Fecha de Nacimiento</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="fecha_nacimiento"
                        value={userData.fecha_nacimiento}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.fecha_nacimiento || "No especificada"}</p>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Documento</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="documento"
                        value={userData.documento}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.documento || "No especificado"}</p>
                    )}
                  </div>
                </div>


                <div className="card-actions justify-end mt-6">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
                        Cancelar
                      </button>
                      <button onClick={handleSave} className="btn btn-primary">
                        Guardar Cambios
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

          {/* Sidebar con información adicional */}
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Mi Avatar</h3>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold mb-4">
                    {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {isEditing && (
                    <button className="btn btn-sm btn-outline">
                      Cambiar Avatar
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Estadísticas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Eventos creados</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invitaciones</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miembro desde</span>
                    <span className="font-bold">{new Date(user.userData?.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {user.userType === 'propietario' && (
                    <div className="flex justify-between">
                      <span>Banquetes registrados</span>
                      <span className="font-bold">0</span>
                    </div>
                  )}
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