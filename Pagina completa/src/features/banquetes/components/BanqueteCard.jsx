import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BanqueteModal from "./BanqueteModal";
import { useAuth } from "@/context/AuthContext";

import { getImageUrl } from "../../../shared/utils/imageUtils";

const BanqueteCard = ({ banquete }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/banquetes/${banquete._id}` } });
      return;
    }
    navigate(`/banquetes/${banquete._id}`);
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <figure className="relative h-56 overflow-hidden">
          <img
            src={getImageUrl(banquete.imagenes?.[0])}
            alt={banquete.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <div className="badge badge-primary font-bold shadow-md">
              $
              {banquete.precio_base?.toLocaleString("es-CO") ||
                banquete.precio?.toLocaleString("es-CO")}
            </div>
          </div>
        </figure>

        <div className="card-body p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="card-title text-xl font-bold truncate">
              {banquete.nombre}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm text-base-content/70 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0"
              />
            </svg>
            <span className="truncate">
              {banquete.direccion || banquete.direccion}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{banquete.capacidad} personas</span>
            </div>
          </div>

          <div className="card-actions justify-end mt-auto pt-4 border-t border-base-200">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowModal(true)}
            >
              Ver detalles
            </button>

            <button
              className="btn btn-primary btn-sm px-6"
              onClick={handleReserve}
            >
              Reservar
            </button>
          </div>
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
