import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/shared/services/apiClient";
import toast from "react-hot-toast";

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
    precio_base: "",
  });

  // Estados para imágenes
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 5;

  useEffect(() => {
    if (user && (user.userType === "propietario" || user.role === "propietario")) {
      fetchBanquetes();
    }
  }, [user]);

  const fetchBanquetes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/banquetes/mis-banquetes");
      setBanquetes(response.data.banquetes || []);
    } catch (err) {
      setError(err.friendlyMessage || "Error al cargar los banquetes");
      toast.error(err.friendlyMessage || "Error al cargar los banquetes");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const totalImages = selectedFiles.length + existingImages.length + fileArray.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = fileArray.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`"${file.name}" no es un formato válido.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" excede los 5MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, { url: e.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Guardando banquete...");
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));

      if (editingBanquete) {
        data.append("imagenes_existentes", JSON.stringify(existingImages));
      }

      selectedFiles.forEach((file) => {
        data.append("imagenes", file);
      });

      const method = editingBanquete ? "put" : "post";
      const url = editingBanquete ? `/banquetes/${editingBanquete._id}` : "/banquetes";

      await apiClient[method](url, data);

      toast.success("Banquete guardado con éxito", { id: toastId });
      setShowModal(false);
      fetchBanquetes();
    } catch (err) {
      toast.error(err.friendlyMessage || "Error al guardar el banquete", { id: toastId });
    }
  };

  const handleEdit = (banquete) => {
    setEditingBanquete(banquete);
    setFormData({
      nombre: banquete.nombre,
      direccion: banquete.direccion,
      capacidad: banquete.capacidad,
      descripcion: banquete.descripcion,
      precio_base: banquete.precio_base,
    });
    setExistingImages(banquete.imagenes || []);
    setSelectedFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este banquete?")) return;

    try {
      await apiClient.delete(`/banquetes/${id}`);
      toast.success("Banquete eliminado");
      fetchBanquetes();
    } catch (err) {
      toast.error(err.friendlyMessage || "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Mis Propiedades</h1>
            <p className="opacity-60 mt-2">Gestiona tus salones y banquetes para eventos premium</p>
          </div>
          <button
            onClick={() => {
              setEditingBanquete(null);
              setFormData({ nombre: "", direccion: "", capacidad: "", descripcion: "", precio_base: "" });
              setExistingImages([]);
              setSelectedFiles([]);
              setImagePreviews([]);
              setShowModal(true);
            }}
            className="btn btn-primary btn-lg shadow-xl shadow-primary/20"
          >
            + Nuevo Banquete
          </button>
        </div>

        {banquetes.length === 0 ? (
          <div className="card bg-base-100 shadow-xl p-12 text-center border border-primary/5">
            <div className="text-7xl mb-6">🏰</div>
            <h2 className="text-2xl font-bold mb-3">No tienes banquetes registrados</h2>
            <p className="opacity-60 mb-8 max-w-md mx-auto">
              Comienza registrando tu primer banquete para que los usuarios puedan encontrarlo y reservarlo.
            </p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Registrar mi primer banquete</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {banquetes.map((banquete) => (
              <div key={banquete._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/5 group overflow-hidden">
                <figure className="h-56 relative overflow-hidden">
                  <img
                    src={banquete.imagenes?.[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'}
                    alt={banquete.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                    ${Number(banquete.precio_base).toLocaleString()}
                  </div>
                </figure>
                <div className="card-body p-6">
                  <h2 className="card-title text-xl font-bold mb-1">{banquete.nombre}</h2>
                  <p className="text-sm opacity-60 line-clamp-2 mb-4">{banquete.descripcion}</p>

                  <div className="flex items-center gap-4 text-xs font-medium opacity-70 mb-6">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {banquete.capacidad} pax
                    </span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {banquete.direccion.split(',')[0]}
                    </span>
                  </div>

                  <div className="card-actions justify-end gap-2 pt-4 border-t">
                    <button onClick={() => handleEdit(banquete)} className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-colors">Editar</button>
                    <button onClick={() => handleDelete(banquete._id)} className="btn btn-sm btn-ghost hover:bg-error/10 hover:text-error transition-colors">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Moderno */}
        {showModal && (
          <div className="modal modal-open overflow-y-auto">
            <div className="modal-box max-w-3xl bg-base-100 p-8 rounded-3xl shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-circle absolute right-4 top-4 btn-ghost">✕</button>
              <h3 className="text-2xl font-black mb-6">{editingBanquete ? "Editar Propiedad" : "Nueva Propiedad"}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Título del Banquete</span></label>
                  <input type="text" className="input input-bordered" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Ubicación / Dirección</span></label>
                  <input type="text" className="input input-bordered" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Capacidad Máxima</span></label>
                  <input type="number" className="input input-bordered" value={formData.capacidad} onChange={e => setFormData({ ...formData, capacidad: e.target.value })} required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Precio Base</span></label>
                  <input type="number" className="input input-bordered" value={formData.precio_base} onChange={e => setFormData({ ...formData, precio_base: e.target.value })} required />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label"><span className="label-text font-bold">Descripción Detallada</span></label>
                  <textarea className="textarea textarea-bordered min-h-24" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} required />
                </div>

                {/* Upload Section */}
                <div className="md:col-span-2 space-y-4">
                  <label className="label"><span className="label-text font-bold">Galería de Imágenes ({selectedFiles.length + existingImages.length}/{MAX_IMAGES})</span></label>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-base-300 hover:border-primary/50"}`}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*" onChange={e => handleFileSelect(e.target.files)} />
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-primary/10 p-4 rounded-full text-primary mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="font-bold opacity-70">Haz clic o arrastra imágenes aquí</p>
                      <p className="text-xs opacity-40">Formatos: JPEG, PNG, WEBP (Máx. 5MB cada una)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {existingImages.map((img, i) => (
                      <div key={`ex-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border border-base-300">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(i)} className="btn btn-circle btn-xs btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    ))}
                    {imagePreviews.map((p, i) => (
                      <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-primary/50">
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(i)} className="btn btn-circle btn-xs btn-error absolute top-1 right-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary px-8">Guardar Propiedad</button>
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
