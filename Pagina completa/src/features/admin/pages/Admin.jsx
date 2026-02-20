// src/pages/Admin.jsx
import { useState } from 'react';

const Admin = () => {
  const [activeTable, setActiveTable] = useState('usuarios');
  const { data, loading, error, insert, update, remove } = useTable(activeTable);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [message, setMessage] = useState('');

  const tables = [
    { id: 'usuarios', name: 'Usuarios' },
    { id: 'propietarios', name: 'Propietarios' },
    { id: 'eventos', name: 'Eventos' },
    { id: 'salones', name: 'Salones' }
  ];

  const handleCreate = async () => {
    const result = await insert(newItem);
    if (result.success) {
      setNewItem({});
      setMessage('✅ Item creado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('❌ Error al crear item: ' + result.error);
    }
  };

  const handleUpdate = async () => {
    const result = await update(editingItem.id, editingItem);
    if (result.success) {
      setEditingItem(null);
      setMessage('✅ Item actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('❌ Error al actualizar item: ' + result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este item?')) {
      const result = await remove(id);
      if (result.success) {
        setMessage('✅ Item eliminado correctamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error al eliminar item: ' + result.error);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>
        
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'} mb-6`}>
            <span>{message}</span>
          </div>
        )}
        
        <div className="tabs tabs-boxed mb-8">
          {tables.map(table => (
            <button
              key={table.id}
              className={`tab ${activeTable === table.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTable(table.id)}
            >
              {table.name}
            </button>
          ))}
        </div>

        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Gestionar {tables.find(t => t.id === activeTable)?.name}</h2>
          
          {/* Formulario para crear nuevo item */}
          <div className="mb-6 p-4 bg-base-100 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Crear nuevo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {activeTable === 'usuarios' && (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nombre</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Nombre" 
                      className="input input-bordered" 
                      value={newItem.nombre || ''} 
                      onChange={e => setNewItem({...newItem, nombre: e.target.value})} 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="input input-bordered"
                      value={newItem.email || ''} 
                      onChange={e => setNewItem({...newItem, email: e.target.value})} 
                    />
                  </div>
                </>
              )}
              {activeTable === 'eventos' && (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nombre</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Nombre del evento" 
                      className="input input-bordered" 
                      value={newItem.nombre || ''} 
                      onChange={e => setNewItem({...newItem, nombre: e.target.value})} 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tipo</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Tipo de evento" 
                      className="input input-bordered"
                      value={newItem.tipo || ''} 
                      onChange={e => setNewItem({...newItem, tipo: e.target.value})} 
                    />
                  </div>
                </>
              )}
              <button className="btn btn-primary" onClick={handleCreate}>Crear</button>
            </div>
          </div>

          {/* Tabla de datos */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  {activeTable === 'usuarios' && (
                    <>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </>
                  )}
                  {activeTable === 'eventos' && (
                    <>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {activeTable === 'usuarios' && (
                      <>
                        <td>{item.nombre}</td>
                        <td>{item.email}</td>
                        <td>
                          <span className={`badge ${item.esta_activo ? 'badge-success' : 'badge-error'}`}>
                            {item.esta_activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-primary mr-2" 
                            onClick={() => setEditingItem(item)}>Editar</button>
                          <button className="btn btn-sm btn-error" 
                            onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </td>
                      </>
                    )}
                    {activeTable === 'eventos' && (
                      <>
                        <td>{item.nombre}</td>
                        <td>{item.tipo}</td>
                        <td>{item.fecha}</td>
                        <td>
                          <button className="btn btn-sm btn-primary mr-2" 
                            onClick={() => setEditingItem(item)}>Editar</button>
                          <button className="btn btn-sm btn-error" 
                            onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de edición */}
        {editingItem && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Editar {activeTable.slice(0, -1)}</h3>
              <div className="py-4 space-y-4">
                {activeTable === 'usuarios' && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nombre</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered" 
                        value={editingItem.nombre || ''} 
                        onChange={e => setEditingItem({...editingItem, nombre: e.target.value})} 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input 
                        type="email" 
                        className="input input-bordered" 
                        value={editingItem.email || ''} 
                        onChange={e => setEditingItem({...editingItem, email: e.target.value})} 
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => setEditingItem(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;