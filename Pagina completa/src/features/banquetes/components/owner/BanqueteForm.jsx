import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import apiClient from "../../../../shared/services/apiClient";
import toast from "react-hot-toast";

const TIPOS = ["general", "lujo", "exterior", "corporativo", "rustico"];

const INITIAL_FORM = {
  nombre: "",
  descripcion: "",
  direccion: "",
  dimensiones: "",
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
        dimensiones: banqueteEdit.dimensiones || "",
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

    if (!form.dimensiones.trim()) e.dimensiones = "Las dimensiones son obligatorias.";
    else if (form.dimensiones.trim().length > 20)
      e.dimensiones = "Las dimensiones no pueden exceder los 20 caracteres.";

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
      let dimensionAuto = form.dimensiones.trim();
      if (/^[\d., ]+$/.test(dimensionAuto)) {
        dimensionAuto += " m²";
      } else {
        // Replace 'm2' with 'm²' (case insensitive, matching word boundary if needed, but a simple replace is fine)
        dimensionAuto = dimensionAuto.replace(/m2/i, "m²");
      }

      formData.append("direccion", form.direccion.trim());
      formData.append("dimensiones", dimensionAuto);
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
    <form onSubmit={handleSubmit} noValidate className="space-y-10">

      {/* SECCIÓN 1: Información Básica */}
      <div className="bg-base-100 p-8 rounded-[2rem] border border-base-200/60 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent opacity-80 group-hover:w-2 transition-all"></div>
        <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3 text-base-content/90">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          Información Básica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="form-control md:col-span-2">
            <label className="label mb-2">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
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
              className={`input input-bordered w-full h-14 bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:input-primary rounded-2xl transition-all shadow-inner ${errors.nombre ? "input-error" : ""}`}
            />
            {errors.nombre && <span className="label-text-alt text-error mt-2 font-medium">{errors.nombre}</span>}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label mb-2 flex justify-between">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Descripción <span className="text-error">*</span>
              </span>
              <span className="label-text-alt opacity-50 font-bold bg-base-200 px-3 py-1 rounded-full">
                {form.descripcion.length} / 500
              </span>
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              maxLength={500}
              placeholder="Describe tu espacio destacando lo que lo hace único..."
              rows={4}
              className={`textarea textarea-bordered w-full bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:textarea-primary rounded-2xl p-5 text-base transition-all resize-none shadow-inner ${errors.descripcion ? "textarea-error" : ""}`}
            />
            {errors.descripcion && <span className="label-text-alt text-error mt-2 font-medium">{errors.descripcion}</span>}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label mb-2">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Dirección Exacta <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                maxLength={50}
                placeholder="Ej. Calle 12# 34-56, Ciudad"
                className={`input input-bordered h-14 pl-12 w-full bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:input-primary rounded-2xl transition-all shadow-inner ${errors.direccion ? "input-error" : ""}`}
              />
            </div>
            {errors.direccion && <span className="label-text-alt text-error mt-2 font-medium">{errors.direccion}</span>}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Detalles y Capacidades */}
      <div className="bg-base-100 p-8 rounded-[2rem] border border-base-200/60 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-secondary to-accent opacity-80 group-hover:w-2 transition-all"></div>
        <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3 text-base-content/90">
          <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          Características del Espacio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Dimensiones <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="dimensiones"
                value={form.dimensiones}
                onChange={handleChange}
                maxLength={20}
                placeholder="Ej. 1200"
                className={`input input-bordered h-14 w-full pr-12 bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:input-secondary rounded-2xl transition-all shadow-inner ${errors.dimensiones ? "input-error" : ""}`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-base-content/50 font-bold">
                m²
              </div>
            </div>
            {errors.dimensiones && <span className="label-text-alt text-error mt-2 font-medium">{errors.dimensiones}</span>}
          </div>

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Capacidad Máxima <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <input
                type="number"
                name="capacidad"
                value={form.capacidad}
                onChange={(e) => { if (e.target.value.length <= 4) handleChange(e); }}
                min="1"
                placeholder="Ej. 150"
                className={`input input-bordered h-14 pl-12 w-full bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:input-secondary rounded-2xl transition-all shadow-inner ${errors.capacidad ? "input-error" : ""}`}
              />
            </div>
            {errors.capacidad && <span className="label-text-alt text-error mt-2 font-medium">{errors.capacidad}</span>}
          </div>

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Categoría / Tipo
              </span>
            </label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="select select-bordered h-14 bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:select-secondary rounded-2xl transition-all font-medium capitalize shadow-inner cursor-pointer"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Precio Base (COP) <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 font-bold">
                $
              </div>
              <input
                type="number"
                name="precio_base"
                value={form.precio_base}
                onChange={(e) => { if (e.target.value.length <= 12) handleChange(e); }}
                min="0"
                step="100"
                placeholder="0.00"
                className={`input input-bordered h-14 pl-10 w-full bg-base-200/30 hover:bg-base-200/60 focus:bg-base-100 focus:input-secondary rounded-2xl transition-all shadow-inner text-lg font-semibold tracking-wide ${errors.precio_base ? "input-error" : ""}`}
              />
            </div>
            {errors.precio_base && <span className="label-text-alt text-error mt-2 font-medium">{errors.precio_base}</span>}
          </div>

          <div className="form-control md:col-span-2 pt-2">
            <label className="label mb-3">
              <span className="label-text text-sm font-bold opacity-70 uppercase tracking-widest">
                Tipos de Eventos Soportados
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["15 Años", "Bodas", "Eventos empresariales", "Otros"].map((evento) => {
                const isSelected = form.eventos_que_ofrece.includes(evento);
                return (
                  <label key={evento} className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 ${isSelected ? "border-secondary bg-secondary/10 shadow-md shadow-secondary/10 scale-105" : "border-base-200 hover:border-secondary/40 bg-base-100"}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) setForm((prev) => ({ ...prev, eventos_que_ofrece: [...prev.eventos_que_ofrece, evento] }));
                        else setForm((prev) => ({ ...prev, eventos_que_ofrece: prev.eventos_que_ofrece.filter((evt) => evt !== evento) }));
                      }}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mb-2 flex items-center justify-center transition-colors ${isSelected ? "bg-secondary border-secondary" : "border-base-300"}`}>
                      {isSelected && <svg className="w-4 h-4 text-secondary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`font-bold text-sm text-center ${isSelected ? "text-secondary" : "text-base-content/70"}`}>{evento}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Multimedia */}
      <div className="bg-base-100 p-8 rounded-[2rem] border border-base-200/60 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-accent to-primary opacity-80 group-hover:w-2 transition-all"></div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold flex items-center gap-3 text-base-content/90">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            Galería del Espacio
          </h3>
          <div className="badge badge-outline badge-lg opacity-80 font-bold">Máx. 20 Fotos</div>
        </div>

        <div className="form-control">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            className={`file-input file-input-bordered file-input-accent file-input-lg w-full bg-base-200/40 hover:bg-base-200 shadow-inner rounded-2xl cursor-pointer ${errors.imagenes ? "file-input-error" : ""}`}
          />
          {errors.imagenes && <span className="label-text-alt text-error mt-3 block font-medium italic">{errors.imagenes}</span>}

          {imagePreview.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-bold opacity-60 mb-4 uppercase tracking-wider">Vista Previa de Imágenes ({imagePreview.length})</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {imagePreview.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-base-200/50 shadow-sm group hover:scale-105 hover:shadow-lg transition-all hover:border-error">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 m-auto w-10 h-10 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl"
                      title="Eliminar imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-5 mt-12 pt-6">
        <button
          type="button"
          onClick={() => {
            setForm(INITIAL_FORM);
            setErrors({});
            setExistingImages([]);
            setImagePreview([]);
          }}
          className="btn btn-ghost rounded-2xl px-10 normal-case font-bold hover:bg-base-200"
          disabled={submitting}
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="btn btn-primary rounded-2xl px-12 shadow-xl shadow-primary/20 hover:shadow-primary/40 normal-case font-bold min-w-[220px] transition-all"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-md"></span>{" "}
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
