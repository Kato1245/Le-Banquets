// src/pages/MisBanquetes.jsx
import { useState, useEffect, useRef } from "react";
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
    if (user && user.userType === "propietario") {
      fetchBanquetes();
    }
  }, [user]);

  const fetchBanquetes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/banquetes/mis-banquetes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

  // === Manejo de imágenes ===
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const totalImages =
      selectedFiles.length + existingImages.length + fileArray.length;

    if (totalImages > MAX_IMAGES) {
      alert(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes en total.`);
      return;
    }

    // Validar tipos
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = fileArray.filter((file) => {
      if (!validTypes.includes(file.type)) {
        alert(
          `"${file.name}" no es un formato válido. Solo se aceptan: JPEG, PNG, WEBP`,
        );
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" excede el tamaño máximo de 5MB.`);
        return false;
      }
      return true;
    });

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);

    // Generar previsualizaciones
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [
          ...prev,
          { url: e.target.result, name: file.name },
        ]);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const resetImageState = () => {
    setSelectedFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  // === Formulario ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingBanquete
        ? `http://localhost:3000/api/banquetes/${editingBanquete._id}`
        : "http://localhost:3000/api/banquetes";

      const method = editingBanquete ? "PUT" : "POST";

      // Usar FormData para enviar archivos
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("direccion", formData.direccion);
      data.append("capacidad", formData.capacidad);
      data.append("descripcion", formData.descripcion);
      data.append("precio_base", formData.precio_base);

      // Agregar imágenes existentes que se conservan (solo en edición)
      if (editingBanquete) {
        data.append("imagenes_existentes", JSON.stringify(existingImages));
      }

      // Agregar archivos nuevos
      selectedFiles.forEach((file) => {
        data.append("imagenes", file);
      });

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          // NO poner Content-Type, FormData lo maneja automáticamente
        },
        body: data,
      });

      if (response.ok) {
        setShowModal(false);
        setEditingBanquete(null);
        setFormData({
          nombre: "",
          direccion: "",
          capacidad: "",
          descripcion: "",
          precio_base: "",
        });
        resetImageState();
        fetchBanquetes();
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
      precio_base: banquete.precio_base,
    });
    // Cargar imágenes existentes
    setExistingImages(banquete.imagenes || []);
    setSelectedFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este banquete?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/banquetes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchBanquetes();
      }
    } catch (error) {
      console.error("Error deleting banquete:", error);
    }
  };

  const openCreateModal = () => {
    setEditingBanquete(null);
    setFormData({
      nombre: "",
      direccion: "",
      capacidad: "",
      descripcion: "",
      precio_base: "",
    });
    resetImageState();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanquete(null);
    resetImageState();
  };

  const totalImagesCount = selectedFiles.length + existingImages.length;
  const canAddMore = totalImagesCount < MAX_IMAGES;

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
          <button onClick={openCreateModal} className="btn btn-primary">
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
            <h3 className="text-2xl font-bold mb-2">
              No tienes banquetes registrados
            </h3>
            <p className="mb-4">
              Comienza registrando tu primer banquete para gestionar tus eventos
            </p>
            <button onClick={openCreateModal} className="btn btn-primary">
              Crear mi primer banquete
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banquetes.map((banquete) => (
              <div key={banquete._id} className="card bg-base-100 shadow-xl">
                <figure className="h-48 relative">
                  {banquete.imagenes && banquete.imagenes.length > 0 ? (
                    <img
                      src={`http://localhost:3000${banquete.imagenes[0]}`}
                      alt={banquete.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                      alt={banquete.nombre}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {banquete.imagenes && banquete.imagenes.length > 1 && (
                    <div className="absolute bottom-2 right-2 badge badge-neutral badge-sm">
                      📷 {banquete.imagenes.length}
                    </div>
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{banquete.nombre}</h2>
                  <p>{banquete.descripcion}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="badge badge-primary">
                      {banquete.capacidad} personas
                    </span>
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
                      onClick={() => handleDelete(banquete._id)}
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
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg">
                {editingBanquete ? "Editar Banquete" : "Nuevo Banquete"}
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
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Capacidad</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={formData.capacidad}
                      onChange={(e) =>
                        setFormData({ ...formData, capacidad: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          precio_base: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ====== SECCIÓN DE SUBIDA DE IMÁGENES ====== */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      📷 Imágenes del Banquete
                    </span>
                    <span className="label-text-alt">
                      {totalImagesCount}/{MAX_IMAGES}
                    </span>
                  </label>

                  {/* Zona de arrastrar y soltar */}
                  {canAddMore && (
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.02]"
                          : "border-base-300 hover:border-primary hover:bg-base-200"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-base-content/40"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-base-content/70">
                            {isDragging
                              ? "¡Suelta las imágenes aquí!"
                              : "Arrastra imágenes aquí o haz clic para seleccionar"}
                          </p>
                          <p className="text-xs text-base-content/50 mt-1">
                            JPEG, PNG, WEBP • Máx. 5MB por imagen • Hasta{" "}
                            {MAX_IMAGES - totalImagesCount} más
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Previsualizaciones de imágenes existentes (al editar) */}
                  {existingImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-base-content/60 mb-2">
                        Imágenes actuales:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {existingImages.map((img, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative group rounded-lg overflow-hidden aspect-square"
                          >
                            <img
                              src={`http://localhost:3000${img}`}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previsualizaciones de imágenes nuevas */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-base-content/60 mb-2">
                        Nuevas imágenes:
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={`new-${index}`}
                            className="relative group rounded-lg overflow-hidden aspect-square ring-2 ring-primary/30"
                          >
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBanquete ? "Actualizar" : "Crear"}
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
