// src/features/admin/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../config/api";
import toast from "react-hot-toast";

const Admin = () => {
  const { user, token } = useAuth();
  const [activeTable, setActiveTable] = useState('usuarios');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});

  const tables = [
    { id: 'usuarios', name: 'Usuarios' },
    { id: 'propietarios', name: 'Propietarios' },
    { id: 'banquetes', name: 'Banquetes' },
    { id: 'eventos', name: 'Eventos' }
  ];

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [activeTable, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Placeholder: en una app real, cada tabla tendría su endpoint
      const endpoint = `${API_BASE_URL}/admin/${activeTable}`;
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const resData = await response.json();
        setData(resData.data || []);
      } else {
        // Mock data para propósitos de demostración si el endpoint no existe
        setData([]);
        console.warn(`Endpoint ${endpoint} no disponible`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    toast.info("Función de creación en desarrollo");
  };

  const handleUpdate = async () => {
    toast.info("Función de actualización en desarrollo");
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      toast.info("Función de eliminación en desarrollo");
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-error/10 border border-error/20 max-w-md w-full p-8 text-center rounded-3xl">
          <h1 className="text-2xl font-bold text-error mb-2">Acceso No Autorizado</h1>
          <p className="text-base-content/60 font-medium">Se requiere nivel de Administrador para este módulo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl font-black tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-8">Base de Datos Maestra</h1>
          <div className="tabs tabs-boxed bg-base-200 p-1 rounded-2xl">
            {tables.map(table => (
              <button
                key={table.id}
                className={`tab px-6 rounded-xl font-bold transition-all ${activeTable === table.id ? 'tab-active bg-primary text-primary-content shadow-lg' : ''}`}
                onClick={() => setActiveTable(table.id)}
              >
                {table.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 bg-base-200/50 border-b border-base-300 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              Listado de {tables.find(t => t.id === activeTable)?.name}
            </h2>
            <button className="btn btn-primary btn-sm rounded-xl px-6 font-bold" onClick={() => toast.info("Módulo de creación próximamente")}>
              + Nuevo Registro
            </button>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="py-20 flex justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : data.length === 0 ? (
              <div className="py-20 text-center opacity-30">
                <div className="text-6xl mb-4">📂</div>
                <p className="font-bold uppercase tracking-widest text-sm">No se encontraron registros en la tabla {activeTable}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                  <thead className="bg-base-200/80">
                    <tr>
                      <th className="font-black uppercase opacity-40">Identificador</th>
                      {activeTable === 'usuarios' && (
                        <>
                          <th className="font-black uppercase opacity-40">Nombre</th>
                          <th className="font-black uppercase opacity-40">Email</th>
                          <th className="font-black uppercase opacity-40">Rol</th>
                        </>
                      )}
                      <th className="font-black uppercase opacity-40 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item.id || item._id} className="hover">
                        <td className="font-mono text-xs opacity-50">{(item.id || item._id)?.substring(0, 12)}...</td>
                        {activeTable === 'usuarios' && (
                          <>
                            <td className="font-bold">{item.nombre}</td>
                            <td>{item.email}</td>
                            <td><div className="badge badge-outline">{item.role || 'user'}</div></td>
                          </>
                        )}
                        <td className="text-right space-x-2">
                          <button className="btn btn-ghost btn-xs text-primary font-bold" onClick={() => setEditingItem(item)}>Editar</button>
                          <button className="btn btn-ghost btn-xs text-error font-bold" onClick={() => handleDelete(item.id || item._id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición Simple */}
      {editingItem && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="font-bold text-2xl mb-6">Editor de Registro</h3>
            <p className="py-4 opacity-70">Esta función está siendo configurada para conectarse con la API Maestra.</p>
            <div className="modal-action">
              <button className="btn btn-ghost rounded-xl" onClick={() => setEditingItem(null)}>Cancelar</button>
              <button className="btn btn-primary rounded-xl px-10" onClick={handleUpdate}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
