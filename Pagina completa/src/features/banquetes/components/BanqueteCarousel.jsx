import { useEffect, useState } from "react";

const BanqueteCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) return <p>No hay imágenes disponibles</p>;

  return (
    <div className="carousel">
      <img
        src={images[currentIndex]}
        alt="Banquete"
        className="carousel-image"
      />
    </div>
  );
};

export default BanqueteCarousel;
