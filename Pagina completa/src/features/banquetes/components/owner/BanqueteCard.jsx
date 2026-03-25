import { useState } from "react";
import { getImageUrl } from "../../../../shared/utils/imageUtils";

const BanqueteCard = ({ banquete, onDelete, onEdit, onManageAvailability }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar "${banquete.nombre}"?\nEsta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await onDelete(banquete._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
      <figure className="h-56 relative overflow-hidden">
        <img
          src={getImageUrl(banquete.imagenes?.[0])}
          alt={banquete.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
          className={`absolute top-4 right-4 badge ${banquete.estado === "activo" ? "badge-success" : "badge-ghost"} py-3 font-bold uppercase text-[10px] tracking-widest shadow`}
        >
          {banquete.estado || "En Revisión"}
        </div>
      </figure>
      <div className="card-body p-7">
        <h2 className="card-title text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {banquete.nombre}
        </h2>
        <p className="text-sm opacity-50 line-clamp-2 mb-5 font-medium">
          {banquete.descripcion || "Sin descripción disponible."}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-base-content/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black opacity-30 tracking-tight">
              Capacidad
            </span>
            <span className="font-bold">{banquete.capacidad || 0} pers.</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-black opacity-30 tracking-tight">
              Precio Base
            </span>
            <span className="text-xl font-extrabold text-primary">
              ${(banquete.precio || banquete.precio_base || 0).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="card-actions justify-end mt-5 gap-2">
          <button
            className="btn btn-ghost btn-sm rounded-xl text-error hover:bg-error/10 transition-all"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Eliminar"
            )}
          </button>
          <button
            className="btn btn-outline btn-neutral btn-sm rounded-xl normal-case font-bold px-2"
            onClick={() => onManageAvailability(banquete)}
            title="Gestionar días bloqueados"
          >
            📅 Disponibilidad
          </button>
          <button
            className="btn btn-primary btn-sm rounded-xl normal-case font-bold px-4"
            onClick={() => onEdit(banquete)}
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanqueteCard;
