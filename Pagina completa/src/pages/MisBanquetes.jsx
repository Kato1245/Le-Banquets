// src/pages/MisBanquetes.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const MisBanquetes = () => {
  const { user } = useAuth();
  const [banquetes, setBanquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBanquete, setEditingBanquete] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    capacidad: "",
    descripcion: "",
    precio_base: ""
  });

  useEffect(() => {
    if (user && user.userType === 'propietario') {
      fetchBanquetes();
    }
  }, [user]);

  const fetchBanquetes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch('http://localhost:3000/api/banquetes/mis-banquetes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBanquetes(data.banquetes || []);
      } else {
        setError("Error al cargar los banquetes");
      }
    } catch (error) {
      console.error("Error fetching banquetes:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingBanquete 
        ? `http://localhost:3000/api/banquetes/${editingBanquete.id}`
        : 'http://localhost:3000/api/banquetes';
      
      const method = editingBanquete ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingBanquete(null);
        setFormData({
          nombre: "",
          direccion: "",
          capacidad: "",
          descripcion: "",
          precio_base: ""
        });
        fetchBanquetes(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error saving banquete:", error);
    }
  };

  const handleEdit = (banquete) => {
    setEditingBanquete(banquete);
    setFormData({
      nombre: banquete.nombre,
      direccion: banquete.direccion,
      capacidad: banquete.capacidad,
      descripcion: banquete.descripcion,
      precio_base: banquete.precio_base
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este banquete?')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/banquetes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchBanquetes(); // Recargar la lista
      }
    } catch (error) {
      console.error("Error deleting banquete:", error);
    }
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mis Banquetes</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            + Nuevo Banquete
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {banquetes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏰</div>
            <h3 className="text-2xl font-bold mb-2">No tienes banquetes registrados</h3>
            <p className="mb-4">Comienza registrando tu primer banquete para gestionar tus eventos</p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Crear mi primer banquete
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banquetes.map((banquete) => (
              <div key={banquete.id} className="card bg-base-100 shadow-xl">
                <figure className="h-48">
                  <img 
                    src={banquete.imagen_url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"} 
                    alt={banquete.nombre}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{banquete.nombre}</h2>
                  <p>{banquete.descripcion}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="badge badge-primary">{banquete.capacidad} personas</span>
                    <span className="font-bold">${banquete.precio_base}</span>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button 
                      onClick={() => handleEdit(banquete)}
                      className="btn btn-sm btn-primary"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(banquete.id)}
                      className="btn btn-sm btn-error"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear/editar banquete */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                {editingBanquete ? 'Editar Banquete' : 'Nuevo Banquete'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre del Banquete</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Dirección</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Capacidad</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.capacidad}
                    onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Precio Base</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.precio_base}
                    onChange={(e) => setFormData({...formData, precio_base: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    required
                  />
                </div>
                <div className="modal-action">
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBanquete(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBanquete ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisBanquetes;