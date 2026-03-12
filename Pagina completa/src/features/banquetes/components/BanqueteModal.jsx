import BanqueteCarousel from "./BanqueteCarousel";

const BanqueteModal = ({ banquete, onClose }) => {
  if (!banquete) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-4xl p-0 overflow-hidden bg-base-100 rounded-2xl shadow-2xl border border-primary/10">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-50 text-white drop-shadow-md bg-black/20 hover:bg-black/40"
        >
          ✕
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Lado Izquierdo: Carrusel de Imágenes */}
          <div className="lg:w-1/2 h-64 lg:h-auto min-h-[300px] bg-base-300">
            <BanqueteCarousel images={banquete.imagenes} />
          </div>

          {/* Lado Derecho: Detalles */}
          <div className="lg:w-1/2 p-8">
            <header className="mb-6">
              <h2 className="text-3xl font-bold text-primary mb-2">
                {banquete.nombre}
              </h2>
              <div className="flex items-center gap-2 text-base-content/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                <span>{banquete.direccion || banquete.direccion}</span>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-base-200 p-3 rounded-xl">
                <p className="text-xs uppercase opacity-50 font-bold mb-1">
                  Precio base
                </p>
                <p className="text-xl font-bold text-primary">
                  $
                  {banquete.precio_base?.toLocaleString("es-CO") ||
                    banquete.precio?.toLocaleString("es-CO")}
                </p>
              </div>
              <div className="bg-base-200 p-3 rounded-xl">
                <p className="text-xs uppercase opacity-50 font-bold mb-1">
                  Capacidad
                </p>
                <p className="text-xl font-bold">{banquete.capacidad} pers.</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-bold text-sm mb-2">Descripción</h4>
                <p className="text-sm text-base-content/80 line-clamp-4">
                  {banquete.descripcion ||
                    "Un espacio excepcional diseñado para que tu evento sea una experiencia inolvidable. Contamos con todas las facilidades y un ambiente único."}
                </p>
              </div>

              {banquete.servicios && banquete.servicios.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-2">
                    Servicios Incluidos
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {banquete.servicios.map((s, idx) => (
                      <span
                        key={idx}
                        className="badge badge-sm badge-outline text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action mt-auto border-t pt-6 border-base-200">
              <button
                className="btn btn-primary btn-block flex-1"
                onClick={() =>
                  (window.location.href = `/banquetes/${banquete._id}`)
                }
              >
                Ver todos los detalles y reservar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
    </dialog>
  );
};

export default BanqueteModal;
