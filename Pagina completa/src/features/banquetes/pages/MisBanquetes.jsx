// src/features/banquetes/pages/MisBanquetes.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../config/api";
import EmptyState from "../../../shared/components/EmptyState";
import { getImageUrl } from "../../../shared/utils/imageUtils";
import OwnerCalendar from "../components/OwnerCalendar";

// ─── Iconos SVG inline ────────────────────────────────────────────────────────
const IconBanquet = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const IconAdd = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);
const IconStats = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const IconCompany = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

// ─── Formulario de creación de banquete ───────────────────────────────────────
const TIPOS = ["general", "lujo", "exterior", "corporativo", "rustico"];

const INITIAL_FORM = {
  nombre: "",
  descripcion: "",
  ubicacion: "",
  capacidad: "",
  tipo: "general",
  precio_base: "",
  imagenes: [],
};

const BanqueteForm = ({ onSuccess, banqueteEdit }) => {
  const { token } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (banqueteEdit) {
      setForm({
        nombre: banqueteEdit.nombre || "",
        descripcion: banqueteEdit.descripcion || "",
        ubicacion: banqueteEdit.ubicacion || "",
        capacidad: banqueteEdit.capacidad || "",
        tipo: banqueteEdit.tipo || "general",
        precio_base: banqueteEdit.precio_base || banqueteEdit.precio || "",
        imagenes: [],
      });
      setExistingImages(banqueteEdit.imagenes || []);
      setImagePreview(banqueteEdit.imagenes || []);
    } else {
      setForm(INITIAL_FORM);
      setExistingImages([]);
      setImagePreview([]);
    }
    setErrors({});
  }, [banqueteEdit]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 3)
      e.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (!form.descripcion.trim() || form.descripcion.trim().length < 20)
      e.descripcion = "La descripción debe tener al menos 20 caracteres.";
    if (!form.ubicacion.trim()) e.ubicacion = "La ubicación es obligatoria.";
    if (!form.capacidad || parseInt(form.capacidad) < 1)
      e.capacidad = "La capacidad debe ser al menos 1 persona.";
    if (form.precio_base === "" || parseFloat(form.precio_base) < 0)
      e.precio_base = "Ingresa un precio base válido (≥ 0).";

    const totalImages = existingImages.length + form.imagenes.length;
    if (totalImages === 0) {
      e.imagenes = "Debes subir al menos una imagen del espacio.";
    }

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalCurrent = existingImages.length + form.imagenes.length;

    if (totalCurrent + selectedFiles.length > 20) {
      toast.error("Solo puedes subir un máximo de 20 imágenes en total.");
      return;
    }

    const newFiles = [...form.imagenes, ...selectedFiles];
    setForm((prev) => ({ ...prev, imagenes: newFiles }));

    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: undefined }));
    }

    const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Si el índice es de una imagen existente
    if (index < existingImages.length) {
      const updatedExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExisting);
      setImagePreview((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Si el índice es de una imagen recién seleccionada
      const localIndex = index - existingImages.length;
      const updatedFiles = form.imagenes.filter((_, i) => i !== localIndex);
      setForm((prev) => ({ ...prev, imagenes: updatedFiles }));
      setImagePreview((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Por favor corrige los errores antes de continuar.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre.trim());
      formData.append("descripcion", form.descripcion.trim());
      formData.append("ubicacion", form.ubicacion.trim());
      formData.append("capacidad", form.capacidad);
      formData.append("tipo", form.tipo);
      formData.append("precio_base", form.precio_base);

      if (banqueteEdit) {
        formData.append("imagenes_existentes", JSON.stringify(existingImages));
      }

      form.imagenes.forEach((img) => formData.append("imagenes", img));

      const method = banqueteEdit ? "PUT" : "POST";
      const url = banqueteEdit
        ? `${API_BASE_URL}/banquetes/${banqueteEdit._id}`
        : `${API_BASE_URL}/banquetes`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          banqueteEdit
            ? "¡Banquete actualizado exitosamente!"
            : "¡Banquete publicado exitosamente!",
        );
        setForm(INITIAL_FORM);
        setExistingImages([]);
        setImagePreview([]);
        setErrors({});
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message || "Error al publicar el banquete.");
      }
    } catch {
      toast.error("Error de conexión. Verifica que el servidor esté activo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Nombre del Banquete <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Salón Imperial Las Flores"
            className={`input input-bordered focus:input-primary rounded-xl transition-all ${errors.nombre ? "input-error" : ""}`}
          />
          {errors.nombre && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.nombre}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Descripción <span className="text-error">*</span>
            </span>
            <span className="label-text-alt opacity-40">
              {form.descripcion.length} / 20 mín.
            </span>
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe tu espacio: capacidades, ambientación, servicios incluidos..."
            rows={4}
            className={`textarea textarea-bordered focus:textarea-primary rounded-xl transition-all resize-none ${errors.descripcion ? "textarea-error" : ""}`}
          />
          {errors.descripcion && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.descripcion}
            </span>
          )}
        </div>

        {/* Ubicación */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Ubicación <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            placeholder="Ej. Calle 123, Ciudad"
            className={`input input-bordered focus:input-primary rounded-xl transition-all ${errors.ubicacion ? "input-error" : ""}`}
          />
          {errors.ubicacion && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.ubicacion}
            </span>
          )}
        </div>

        {/* Tipo */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Tipo de Espacio
            </span>
          </label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="select select-bordered focus:select-primary rounded-xl transition-all capitalize"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Capacidad */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Capacidad (personas) <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            name="capacidad"
            value={form.capacidad}
            onChange={handleChange}
            min="1"
            placeholder="Ej. 150"
            className={`input input-bordered focus:input-primary rounded-xl transition-all ${errors.capacidad ? "input-error" : ""}`}
          />
          {errors.capacidad && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.capacidad}
            </span>
          )}
        </div>

        {/* Precio Base */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Precio Base ($ COP) <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            name="precio_base"
            value={form.precio_base}
            onChange={handleChange}
            min="0"
            step="100"
            placeholder="Ej. 15000"
            className={`input input-bordered focus:input-primary rounded-xl transition-all ${errors.precio_base ? "input-error" : ""}`}
          />
          {errors.precio_base && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.precio_base}
            </span>
          )}
        </div>

        {/* Imágenes */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Imágenes del espacio{" "}
              <span className="opacity-40 font-normal">(máx. 20)</span>
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            className={`file-input file-input-bordered file-input-primary rounded-xl w-full ${errors.imagenes ? "file-input-error" : ""}`}
          />
          {errors.imagenes && (
            <span className="label-text-alt text-error mt-1 font-medium italic">
              {errors.imagenes}
            </span>
          )}
          {imagePreview.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {imagePreview.map((src, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md group"
                >
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar imagen"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={4}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10 pt-8 border-t border-base-content/5">
        <button
          type="button"
          onClick={() => {
            setForm(INITIAL_FORM);
            setErrors({});
            setExistingImages([]);
            setImagePreview([]);
          }}
          className="btn btn-ghost rounded-xl px-10 normal-case font-bold"
          disabled={submitting}
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="btn btn-primary rounded-xl px-12 shadow-lg hover:shadow-primary/30 normal-case font-bold min-w-[200px]"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>{" "}
              Guardando...
            </>
          ) : banqueteEdit ? (
            "✓ Actualizar Banquete"
          ) : (
            "✓ Publicar Banquete"
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Panel de Estadísticas (simulado, listo para conectar a API) ───────────────
const EstadisticasPanel = ({ totalBanquetes }) => {
  const stats = [
    {
      label: "Banquetes Publicados",
      value: totalBanquetes,
      icon: "🏰",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Visitas este mes",
      value: "—",
      icon: "👀",
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Solicitudes recibidas",
      value: "—",
      icon: "📩",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Tasa de conversión",
      value: "—",
      icon: "📈",
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`rounded-3xl p-6 border border-base-content/5 ${s.bg} flex flex-col items-center text-center`}
          >
            <span className="text-4xl mb-3">{s.icon}</span>
            <span className={`text-3xl font-black ${s.color} mb-1`}>
              {s.value}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-50">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="alert bg-base-200 border border-base-300 rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm opacity-60">
          Las estadísticas detalladas de visitas y solicitudes estarán
          disponibles próximamente conforme los módulos de seguimiento se
          activen.
        </span>
      </div>
    </div>
  );
};

// ─── Panel de Perfil de Empresa ────────────────────────────────────────────────
const PerfilEmpresaPanel = ({ user }) => {
  return (
    <div className="max-w-2xl">
      <div className="card bg-base-200 border border-base-300 rounded-3xl overflow-hidden mb-6">
        <div className="card-body p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-3xl font-black shadow-lg">
              {(user?.nombre || "P").charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black">
                {user?.nombre || "Propietario"}
              </h3>
              <p className="text-sm opacity-60 font-medium">{user?.email}</p>
              <div className="badge badge-info badge-outline mt-2 font-bold text-[10px] tracking-widest">
                PROPIETARIO
              </div>
            </div>
          </div>

          <div className="divider opacity-20 my-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Teléfono", value: user?.telefono || "No registrado" },
              { label: "Documento", value: user?.documento || "No registrado" },
              {
                label: "Miembro desde",
                value: user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("es", {
                    year: "numeric",
                    month: "long",
                  })
                  : "—",
              },
              {
                label: "ID de cuenta",
                value: user?.id ? `${user.id.substring(0, 12)}...` : "—",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-base-100 rounded-2xl border border-base-content/5"
              >
                <span className="opacity-50 font-bold uppercase text-[10px] tracking-widest">
                  {item.label}
                </span>
                <span className="font-semibold font-mono text-xs">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="alert alert-info bg-info/10 border-info/20 rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span className="text-sm">
          Para editar los datos de tu perfil, ve a{" "}
          <strong>Configuración de Perfil</strong> desde el menú de usuario.
        </span>
      </div>
    </div>
  );
};

// ─── Tarjeta de Banquete ───────────────────────────────────────────────────────
const BanqueteCard = ({ banquete, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar "${banquete.nombre}"?\nEsta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await onDelete(banquete._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
      <figure className="h-56 relative overflow-hidden">
        <img
          src={getImageUrl(banquete.imagenes?.[0])}
          alt={banquete.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
          className={`absolute top-4 right-4 badge ${banquete.estado === "activo" ? "badge-success" : "badge-ghost"} py-3 font-bold uppercase text-[10px] tracking-widest shadow`}
        >
          {banquete.estado || "En Revisión"}
        </div>
      </figure>
      <div className="card-body p-7">
        <h2 className="card-title text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {banquete.nombre}
        </h2>
        <p className="text-sm opacity-50 line-clamp-2 mb-5 font-medium">
          {banquete.descripcion || "Sin descripción disponible."}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-base-content/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black opacity-30 tracking-tight">
              Capacidad
            </span>
            <span className="font-bold">{banquete.capacidad || 0} pers.</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-black opacity-30 tracking-tight">
              Precio Base
            </span>
            <span className="text-xl font-extrabold text-primary">
              ${(banquete.precio || banquete.precio_base || 0).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="card-actions justify-end mt-5 gap-2">
          <button
            className="btn btn-ghost btn-sm rounded-xl text-error hover:bg-error/10 transition-all"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Eliminar"
            )}
          </button>
          <button
            className="btn btn-outline btn-primary btn-sm rounded-xl normal-case font-bold"
            onClick={() => onEdit(banquete)}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton de carga ───────────────────────────────────────────────────────
const BanqueteSkeleton = () => (
  <div className="card bg-base-200 rounded-[2rem] overflow-hidden animate-pulse">
    <div className="h-56 bg-base-300" />
    <div className="card-body p-7 space-y-4">
      <div className="h-5 bg-base-300 rounded-full w-3/4" />
      <div className="h-3 bg-base-300 rounded-full w-full" />
      <div className="h-3 bg-base-300 rounded-full w-2/3" />
      <div className="flex justify-between mt-6">
        <div className="h-8 bg-base-300 rounded-xl w-24" />
        <div className="h-8 bg-base-300 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

// ─── Componente Principal ──────────────────────────────────────────────────────
const TABS = [
  { id: "mis-banquetes", label: "Mis Banquetes", icon: <IconBanquet /> },
  { id: "agregar", label: "Agregar Banquete", icon: <IconAdd /> },
  { id: "calendario", label: "Calendario", icon: <span className="text-lg">📅</span> },
  { id: "estadisticas", label: "Estadísticas", icon: <IconStats /> },
  { id: "empresa", label: "Perfil de Empresa", icon: <IconCompany /> },
];

const MisBanquetes = () => {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("action") === "nuevo" ? "agregar" : "mis-banquetes";
  });
  const [banquetes, setBanquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banqueteEdit, setBanqueteEdit] = useState(null);

  // Sincronizar la pestaña con el query param ?action=nuevo cuando cambia la URL
  useEffect(() => {
    if (searchParams.get("action") === "nuevo") {
      setActiveTab("agregar");
      // Limpiar el query param sin recargar
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchBanquetes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/banquetes/mis-banquetes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBanquetes(data.banquetes || data.data || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al cargar tus banquetes.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
      toast.error("No se pudo conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (
      user &&
      (user.userType === "propietario" || user.role === "propietario")
    ) {
      fetchBanquetes();
    } else {
      setLoading(false);
    }
  }, [user, fetchBanquetes]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banquetes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setBanquetes((prev) => prev.filter((b) => b._id !== id));
        toast.success("Banquete eliminado correctamente.");
      } else {
        const data = await response.json();
        toast.error(data.message || "No se pudo eliminar el banquete.");
      }
    } catch {
      toast.error("Error de conexión. No se pudo eliminar.");
    }
  };

  const handleFormSuccess = () => {
    setActiveTab("mis-banquetes");
    setBanqueteEdit(null);
    fetchBanquetes();
  };

  const handleEdit = (banquete) => {
    setBanqueteEdit(banquete);
    setActiveTab("agregar");
  };

  const switchTab = (tabId) => setActiveTab(tabId);

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1">
              Panel de Propietario
            </h1>
            <p className="text-base opacity-50 font-medium">
              Bienvenido,{" "}
              <span className="font-bold opacity-80">
                {user?.nombre || "Propietario"}
              </span>{" "}
              — gestiona tus espacios desde aquí.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge badge-outline badge-info py-4 px-5 font-bold uppercase tracking-widest text-[10px]">
              🏢 Propietario
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-10 bg-base-200/60 p-2 rounded-2xl border border-base-content/5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`btn btn-sm rounded-xl gap-2 normal-case font-bold transition-all ${activeTab === tab.id
                ? "btn-primary shadow-md"
                : "btn-ghost opacity-60 hover:opacity-100"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Pestaña: Mis Banquetes ── */}
        {activeTab === "mis-banquetes" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Mis Espacios Publicados</h2>
                <p className="text-sm opacity-50 font-medium mt-1">
                  {loading
                    ? "Cargando..."
                    : `${banquetes.length} banquete${banquetes.length !== 1 ? "s" : ""} publicado${banquetes.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                className="btn btn-primary rounded-xl px-8 shadow-lg normal-case font-bold gap-2"
                onClick={() => {
                  setBanqueteEdit(null);
                  switchTab("agregar");
                }}
              >
                <IconAdd />
                Agregar Banquete
              </button>
            </div>

            {error && (
              <div className="alert alert-error mb-8 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={fetchBanquetes}
                >
                  Reintentar
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <BanqueteSkeleton key={i} />
                ))}
              </div>
            ) : banquetes.length === 0 ? (
              <EmptyState
                icon="🏰"
                title="Aún no tienes banquetes publicados"
                description="Empieza a rentabilizar tus espacios. Publica tu primer salón y llega a miles de clientes potenciales."
                action={
                  <button
                    className="btn btn-primary rounded-xl px-10 normal-case font-bold gap-2"
                    onClick={() => switchTab("agregar")}
                  >
                    <IconAdd />
                    Crear mi primera publicación
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banquetes.map((b) => (
                  <BanqueteCard
                    key={b._id}
                    banquete={b}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Pestaña: Agregar Banquete ── */}
        {activeTab === "agregar" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">
                {banqueteEdit ? "Editar Banquete" : "Publicar Nuevo Banquete"}
              </h2>
              <p className="text-sm opacity-50 font-medium">
                {banqueteEdit
                  ? "Modifica la información de tu espacio. Recuerda que los cambios serán visibles de inmediato."
                  : "Completa todos los campos. Los campos marcados con * son obligatorios."}
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-200 rounded-[2.5rem]">
              <div className="card-body p-8 md:p-12">
                <BanqueteForm onSuccess={handleFormSuccess} banqueteEdit={banqueteEdit} />
              </div>
            </div>
          </div>
        )}

        {/* ── Pestaña: Calendario ── */}
        {activeTab === "calendario" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <OwnerCalendar />
          </div>
        )}

        {/* ── Pestaña: Estadísticas ── */}
        {activeTab === "estadisticas" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">
                Estadísticas de tu Portafolio
              </h2>
              <p className="text-sm opacity-50 font-medium">
                Seguimiento del rendimiento de tus espacios publicados.
              </p>
            </div>
            <EstadisticasPanel totalBanquetes={banquetes.length} />
          </div>
        )}

        {/* ── Pestaña: Perfil de Empresa ── */}
        {activeTab === "empresa" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">Perfil de Empresa</h2>
              <p className="text-sm opacity-50 font-medium">
                Información de tu cuenta como propietario verificado.
              </p>
            </div>
            <PerfilEmpresaPanel user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MisBanquetes;
