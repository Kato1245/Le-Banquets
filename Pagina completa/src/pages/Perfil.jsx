// src/pages/Perfil.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

const Perfil = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    telefono: "",
    direccion: "",
    preferencias: []
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
      
      // Obtener datos del usuario desde la tabla usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!error && data) {
        setUserData({
          username: data.nombre || user.user_metadata?.username || user.email.split('@')[0],
          email: data.email || user.email,
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          preferencias: data.preferencias || []
        });
      } else {
        // Si no existe, usar datos básicos de auth
        setUserData({
          username: user.user_metadata?.username || user.email.split('@')[0],
          email: user.email,
          telefono: "",
          direccion: "",
          preferencias: []
        });
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setMessage("Guardando cambios...");
      
      // Actualizar en la tabla usuarios
      const { error } = await supabase
        .from('usuarios')
        .upsert({
          email: user.email,
          nombre: userData.username,
          telefono: userData.telefono,
          direccion: userData.direccion,
          preferencias: userData.preferencias,
          esta_verificado: true,
          esta_activo: true
        }, {
          onConflict: 'email'
        });

      if (error) throw error;
      
      setMessage("✅ Perfil actualizado correctamente");
      setIsEditing(false);
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMessage("❌ Error al actualizar el perfil");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox") {
      if (checked) {
        setUserData(prev => ({
          ...prev,
          preferencias: [...prev.preferencias, value]
        }))
      } else {
        setUserData(prev => ({
          ...prev,
          preferencias: prev.preferencias.filter(item => item !== value)
        }))
      }
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

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
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.username}</p>
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
                        disabled
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
                      <span className="label-text">Dirección</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="direccion"
                        value={userData.direccion}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    ) : (
                      <p className="text-lg">{userData.direccion || "No especificada"}</p>
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
                    {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
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
                    <span className="font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
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