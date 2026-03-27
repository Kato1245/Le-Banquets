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
    <div className="pb-8 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6 mb-10">
        <div>
          <p className="text-[9px] uppercase font-black tracking-[0.4em] opacity-30 mb-2 flex items-center gap-3">
            <span className="w-6 h-px bg-current opacity-20"></span>
            Testimonios
          </p>
          <h3 className="text-2xl font-black tracking-tighter uppercase">
            Experiencias
          </h3>
        </div>
        
        <div className="bg-base-200/50 p-5 rounded-[1.5rem] border border-base-300 flex items-center gap-4 justify-between">
          <div className="flex flex-col">
            <p className="text-3xl font-black text-primary leading-none">{averageRating}</p>
            <p className="text-[8px] uppercase font-black tracking-widest opacity-40 mt-1">
              Rating Promedio
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex text-warning text-xs">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <p className="text-[8px] font-bold opacity-30 uppercase mt-1">
              {reviews.length} opiniones
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="p-6 bg-base-200/20 border border-base-300 rounded-[2rem] hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex text-warning text-xs">
                {"★".repeat(review.calificacion)}
                <span className="text-base-content/10">{"★".repeat(5 - review.calificacion)}</span>
              </div>
              <span className="text-[8px] font-bold opacity-20 tracking-widest uppercase">
                {new Date(review.fecha).toLocaleDateString("es-ES", { month: 'short', year: '2-digit' })}
              </span>
            </div>
            
            <p className="text-[11px] font-medium leading-relaxed italic opacity-70 mb-4">
              "{review.comentario}"
            </p>
            
            <div className="flex items-center gap-3 pt-4 border-t border-base-content/5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shrink-0">
                {review.usuario_id?.foto ? (
                  <img src={getImageUrl(review.usuario_id.foto)} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary font-black text-[10px] uppercase">{review.usuario_id?.nombre?.charAt(0) || "U"}</span>
                )}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider">{review.usuario_id?.nombre || "Usuario"}</p>
                <p className="text-[7px] opacity-30 uppercase font-black tracking-[0.1em]">Cliente Verificado</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
