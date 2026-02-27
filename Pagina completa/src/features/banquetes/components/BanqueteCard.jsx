import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BanqueteModal from "./BanqueteModal";
import { useAuth } from "@/context/AuthContext";

const BanqueteCard = ({ banquete }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/banquetes/${banquete._id}` } });
      return;
    }
    navigate(`/banquetes/${banquete._id}`);
  };

  return (
    <>
      <div className="banquete-card">
        <img src={banquete.imagenes?.[0]} alt={banquete.nombre} />

        <h3>{banquete.nombre}</h3>
        <p>{banquete.ubicacion}</p>
        <p>{banquete.capacidad} personas</p>
        <p>${banquete.precio}</p>

        <div className="buttons">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setShowModal(true)}
          >
            Ver detalles
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={handleReserve}
          >
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
