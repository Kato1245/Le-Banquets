import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BanqueteModal from "./BanqueteModal";

const BanqueteCard = ({ banquete }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="banquete-card">
        <img src={banquete.imagenes?.[0]} alt={banquete.nombre} />

        <h3>{banquete.nombre}</h3>
        <p>{banquete.ubicacion}</p>
        <p>{banquete.capacidad} personas</p>
        <p>${banquete.precio}</p>

        <div className="buttons">
          <button onClick={() => setShowModal(true)}>
            Ver detalles
          </button>

          <button onClick={() => navigate(`/banquetes/${banquete._id}`)}>
            Reservar
          </button>
        </div>
      </div>

      {showModal && (
        <BanqueteModal
          banquete={banquete}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default BanqueteCard;
