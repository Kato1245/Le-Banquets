import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import apiClient from "../../../../shared/services/apiClient";
import toast from "react-hot-toast";

const TIPOS = ["general", "lujo", "exterior", "corporativo", "rustico"];

const INITIAL_FORM = {
  nombre: "",
  descripcion: "",
  direccion: "",
  capacidad: "",
  tipo: "general",
  precio_base: "",
  eventos_que_ofrece: [],
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
        direccion: banqueteEdit.direccion || "",
        capacidad: banqueteEdit.capacidad || "",
        tipo: banqueteEdit.tipo || "general",
        precio_base: banqueteEdit.precio_base || banqueteEdit.precio || "",
        eventos_que_ofrece: banqueteEdit.eventos_que_ofrece || [],
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
    else if (form.nombre.trim().length > 50)
      e.nombre = "El nombre no puede exceder los 50 caracteres.";

    if (!form.descripcion.trim() || form.descripcion.trim().length < 20)
      e.descripcion = "La descripción debe tener al menos 20 caracteres.";
    else if (form.descripcion.trim().length > 500)
      e.descripcion = "La descripción no puede exceder los 500 caracteres.";

    if (!form.direccion.trim()) e.direccion = "La Dirección es obligatoria.";
    else if (form.direccion.trim().length > 50)
      e.direccion = "La dirección no puede exceder los 50 caracteres.";

    if (!form.capacidad || parseInt(form.capacidad) < 1)
      e.capacidad = "La capacidad debe ser al menos 1 persona.";
    else if (form.capacidad.toString().length > 4)
      e.capacidad = "La capacidad no puede exceder los 4 dígitos.";

    if (form.precio_base === "" || parseFloat(form.precio_base) < 0)
      e.precio_base = "Ingresa un precio base válido (≥ 0).";
    else if (form.precio_base.toString().length > 9)
      e.precio_base = "El precio no puede exceder los 9 dígitos.";

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
    if (index < existingImages.length) {
      const updatedExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExisting);
      setImagePreview((prev) => prev.filter((_, i) => i !== index));
    } else {
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
      formData.append("direccion", form.direccion.trim());
      formData.append("capacidad", form.capacidad);
      formData.append("tipo", form.tipo);
      formData.append("precio_base", form.precio_base);
      formData.append("eventos_que_ofrece", JSON.stringify(form.eventos_que_ofrece));

      if (banqueteEdit) {
        formData.append("imagenes_existentes", JSON.stringify(existingImages));
      }

      form.imagenes.forEach((img) => formData.append("imagenes", img));

      const endpoint = banqueteEdit ? `/banquetes/${banqueteEdit._id}` : "/banquetes";
      const method = banqueteEdit ? "put" : "post";

      await apiClient[method](endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
    } catch (err) {
      toast.error(err.friendlyMessage || "Error al procesar el banquete.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            maxLength={50}
            placeholder="Ej. Salón Imperial Las Flores"
            className={`input input-bordered focus:input-primary rounded-xl transition-all ${errors.nombre ? "input-error" : ""}`}
          />
          {errors.nombre && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.nombre}
            </span>
          )}
        </div>

        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Descripción <span className="text-error">*</span>
            </span>
            <span className="label-text-alt opacity-40">
              {form.descripcion.length} / 500 máx.
            </span>
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            maxLength={500}
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

        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Dirección <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            maxLength={50}
            placeholder="Ej. Calle 123, Ciudad"
            className={`input input-bordered focus:input-primary rounded-xl transition-all ${errors.direccion ? "input-error" : ""}`}
          />
          {errors.direccion && (
            <span className="label-text-alt text-error mt-1 font-medium">
              {errors.direccion}
            </span>
          )}
        </div>

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
            onChange={(e) => {
              if (e.target.value.length <= 4) handleChange(e);
            }}
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
            onChange={(e) => {
              if (e.target.value.length <= 12) handleChange(e);
            }}
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

        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-bold opacity-70">
              Eventos que ofrece
            </span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["15 Años", "Bodas", "Eventos empresariales", "Otros"].map((evento) => (
              <label key={evento} className="cursor-pointer label flex items-center gap-2 bg-base-200 px-4 py-2 rounded-xl border border-transparent hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm rounded-lg"
                  checked={form.eventos_que_ofrece.includes(evento)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        eventos_que_ofrece: [...prev.eventos_que_ofrece, evento],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        eventos_que_ofrece: prev.eventos_que_ofrece.filter((evt) => evt !== evento),
                      }));
                    }
                  }}
                />
                <span className="label-text font-medium">{evento}</span>
              </label>
            ))}
          </div>
        </div>

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

export default BanqueteForm;
