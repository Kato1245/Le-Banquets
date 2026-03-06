import { useEffect, useState } from "react";
import { getImageUrl } from "../../../shared/utils/imageUtils";

const BanqueteCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) return <p>No hay imágenes disponibles</p>;

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black/5">
      <img
        src={getImageUrl(images[currentIndex])}
        alt="Banquete Preview"
        className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        style={{ opacity: 1 }}
      />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BanqueteCarousel;
