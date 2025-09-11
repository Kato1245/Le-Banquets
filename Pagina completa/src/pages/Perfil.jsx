// src/pages/Perfil.jsx
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const Perfil = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    telefono: "",
    direccion: "",
    preferencias: []
  })

 const handleSave = async () => {
  try {
    const token = localStorage.getItem("token"); // tu JWT

    const response = await fetch("http://localhost:3000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username: userData.username, // frontend manda username
        email: userData.email,
        telefono: userData.telefono
      })
    });

    const data = await response.json();
    console.log("Respuesta del backend:", data);

    if (data.success) {
      alert("Perfil actualizado correctamente");
      setIsEditing(false);
    } else {
      alert("Error: " + data.message);
    }

  } catch (error) {
    console.error("Error actualizando perfil:", error);
    alert("Ocurrió un error al actualizar el perfil");
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

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mi Perfil</h1>
        
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
                
                {isEditing && (
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Preferencias de evento</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Bodas", "Corporativos", "Fiestas", "Celebraciones"].map(pref => (
                        <label key={pref} className="cursor-pointer label">
                          <input
                            type="checkbox"
                            value={pref}
                            checked={userData.preferencias.includes(pref)}
                            onChange={handleChange}
                            className="checkbox checkbox-primary checkbox-sm"
                          />
                          <span className="label-text ml-2">{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
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
                    <span className="font-bold">{new Date().toLocaleDateString()}</span>
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