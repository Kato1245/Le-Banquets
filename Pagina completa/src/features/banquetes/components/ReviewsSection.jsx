import { useState, useEffect } from "react";
import reviewsService from "../services/reviewsService";
import { getImageUrl } from "../../../shared/utils/imageUtils";

const ReviewsSection = ({ banqueteId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewsService.getReviewsByBanquete(banqueteId);
        setReviews(data?.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    if (banqueteId) {
      fetchReviews();
    }
  }, [banqueteId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-16 text-center border-t border-base-content/10 mt-16">
        <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-30 mb-4">Experiencias</p>
        <h3 className="text-2xl font-bold opacity-60">Aún no hay reseñas para este banquete.</h3>
        <p className="text-sm mt-2 opacity-40">¡Sé el primero en reservar y compartir tu experiencia!</p>
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.calificacion, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="py-20 border-t border-base-content/10 mt-16 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <p className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30 mb-4 flex items-center gap-4">
            <span className="w-8 h-px bg-current opacity-20"></span>
            Experiencias de Clientes
          </p>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            Testimonios
          </h3>
        </div>
        
        <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300 flex items-center gap-6 min-w-48 justify-center">
          <div className="flex flex-col items-center">
            <p className="text-4xl font-black text-primary leading-none">{averageRating}</p>
            <div className="flex text-warning text-sm mt-1">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mt-2">
              {reviews.length} Valoraciones
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="p-8 bg-base-100 border border-base-300 rounded-[2.5rem] hover:shadow-xl hover:border-primary/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex text-warning text-lg drop-shadow-sm">
                  {"★".repeat(review.calificacion)}
                  <span className="text-base-content/20">{"★".repeat(5 - review.calificacion)}</span>
                </div>
                <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase">
                  {new Date(review.fecha).toLocaleDateString("es-ES", { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed italic opacity-80 mb-8">
                "{review.comentario}"
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-base-content/5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shrink-0">
                {review.usuario_id?.foto ? (
                  <img src={getImageUrl(review.usuario_id.foto)} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-black uppercase tracking-tighter">{review.usuario_id?.nombre?.charAt(0) || "U"}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider">{review.usuario_id?.nombre || "Usuario Anónimo"}</p>
                <p className="text-[9px] opacity-40 uppercase tracking-widest font-bold">Cliente Verificado</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
