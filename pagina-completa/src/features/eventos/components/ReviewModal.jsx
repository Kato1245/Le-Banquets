import { useState } from "react";
import reviewsService from "../../banquetes/services/reviewsService";
import toast from "react-hot-toast";

const ReviewModal = ({ isOpen, onClose, banqueteId, banqueteNombre, onSuccess }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calificacion === 0) {
      toast.error("Por favor selecciona una calificación de 1 a 5 estrellas.");
      return;
    }
    if (!comentario.trim()) {
      toast.error("Por favor escribe un comentario.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewsService.createReview({
        banquete_id: banqueteId,
        calificacion,
        comentario,
      });
      toast.success("¡Tu reseña ha sido guardada exitosamente!");
      if(onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al guardar la reseña. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-base-100/90 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden">
        <div className="hidden md:block absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

        <div className="relative p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40 mb-2">Cuéntanos tu experiencia</p>
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Calificar</h3>
            </div>
            <button
              onClick={onClose}
              className="btn btn-circle btn-ghost btn-sm bg-base-200/50 hover:bg-base-300 absolute top-8 right-8"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          <p className="text-sm font-medium opacity-60 mb-6">
            Estás calificando tu experiencia en <span className="font-bold text-primary">{banqueteNombre}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4 bg-base-200/30 p-6 rounded-[2rem] border border-base-content/5">
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">¿Qué te pareció el servicio?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-4xl transition-all duration-200 ${
                      star <= (hover || calificacion)
                        ? "text-warning scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        : "text-base-content/20 scale-100"
                    }`}
                    onClick={() => setCalificacion(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-control">
              <label className="label py-2">
                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-40">
                  Comentario
                </span>
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe aquí los detalles de tu experiencia..."
                className="textarea w-full h-32 rounded-2xl bg-base-200/50 border-base-content/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm font-medium transition-all resize-none"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full rounded-2xl h-14 font-black uppercase tracking-widest text-sm shadow-[0_10px_20px_-10px_rgba(var(--p),0.5)] mt-4 border-none"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Enviar Calificación"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
