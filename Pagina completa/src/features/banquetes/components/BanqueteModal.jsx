import BanqueteCarousel from "./BanqueteCarousel";

const BanqueteModal = ({ banquete, onClose }) => {
  if (!banquete) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">
          X
        </button>

        <h2>{banquete.nombre}</h2>

        <BanqueteCarousel images={banquete.imagenes} />

        <p><strong>Ubicación:</strong> {banquete.ubicacion}</p>
        <p><strong>Capacidad:</strong> {banquete.capacidad} personas</p>
        <p><strong>Tamaño:</strong> {banquete.tamano} m²</p>
        <p><strong>Servicios:</strong> {banquete.servicios?.join(", ")}</p>
        <p><strong>Precio:</strong> ${banquete.precio}</p>
      </div>
    </div>
  );
};

export default BanqueteModal;
