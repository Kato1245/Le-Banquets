// src/features/banquetes/pages/MisBanquetes.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import apiClient from "../../../shared/services/apiClient";
import EmptyState from "../../../shared/components/EmptyState";
import OwnerCalendar from "../components/OwnerCalendar";
import BanqueteAvailabilityModal from "../components/BanqueteAvailabilityModal";

// Modular Components
import BanqueteForm from "../components/owner/BanqueteForm";
import EstadisticasPanel from "../components/owner/EstadisticasPanel";
import BanqueteCard from "../components/owner/BanqueteCard";
import BanqueteSkeleton from "../components/owner/BanqueteSkeleton";

// ─── Iconos SVG inline ────────────────────────────────────────────────────────
const IconBanquet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconAdd = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const IconStats = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TABS = [
  { id: "mis-banquetes", label: "Mis Banquetes", icon: <IconBanquet /> },
  { id: "agregar", label: "Agregar Banquete", icon: <IconAdd /> },
  { id: "calendario", label: "Calendario", icon: <span className="text-lg">📅</span> },
  { id: "estadisticas", label: "Estadísticas", icon: <IconStats /> },
];

import ClinkingGlasses from "../../../shared/components/ClinkingGlasses";

const MisBanquetes = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const action = searchParams.get("action");
    const tabUrl = searchParams.get("tab");
    if (action === "nuevo") return "agregar";
    if (tabUrl && TABS.some(t => t.id === tabUrl)) return tabUrl;
    return "mis-banquetes";
  });
  const [banquetes, setBanquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banqueteEdit, setBanqueteEdit] = useState(null);
  const [availabilityModalData, setAvailabilityModalData] = useState({ isOpen: false, banquete: null });

  // Sincronizar la pestaña con query params (?action=nuevo o ?tab=...)
  useEffect(() => {
    const action = searchParams.get("action");
    const tabUrl = searchParams.get("tab");

    if (action === "nuevo") {
      setActiveTab("agregar");
      setSearchParams({}, { replace: true });
    } else if (tabUrl && TABS.some(t => t.id === tabUrl)) {
      setActiveTab(tabUrl);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchBanquetes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get("/banquetes/mis-banquetes");
      setBanquetes(response.data.banquetes || response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || "Error al cargar tus banquetes.");
      toast.error(err.friendlyMessage || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && (user.userType === "propietario" || user.role === "propietario")) {
      fetchBanquetes();
    } else {
      setLoading(false);
    }
  }, [user, fetchBanquetes]);

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/banquetes/${id}`);
      setBanquetes((prev) => prev.filter((b) => b._id !== id));
      toast.success("Banquete eliminado correctamente.");
    } catch (err) {
      toast.error(err.friendlyMessage || "No se pudo eliminar el banquete.");
    }
  };

  const handleFormSuccess = () => {
    setActiveTab("mis-banquetes");
    setBanqueteEdit(null);
    fetchBanquetes();
  };

  const handleEdit = (banquete) => {
    setBanqueteEdit(banquete);
    setActiveTab("agregar");
  };

  const switchTab = (tabId) => setActiveTab(tabId);

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1">
              Panel de Propietario
            </h1>
            <p className="text-base opacity-50 font-medium">
              Bienvenido, <span className="font-bold opacity-80">{user?.nombre || "Propietario"}</span> — gestiona tus espacios desde aquí.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge badge-outline badge-info py-4 px-5 font-bold uppercase tracking-widest text-[10px]">
              🏢 Propietario
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 bg-base-200/60 p-2 rounded-2xl border border-base-content/5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`btn btn-sm rounded-xl gap-2 normal-case font-bold transition-all ${activeTab === tab.id
                  ? "btn-primary shadow-md"
                  : "btn-ghost opacity-60 hover:opacity-100"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pestaña: Mis Banquetes */}
        {activeTab === "mis-banquetes" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Mis Espacios Publicados</h2>
                <p className="text-sm opacity-50 font-medium mt-1">
                  {loading
                    ? "Cargando..."
                    : `${banquetes.length} banquete${banquetes.length !== 1 ? "s" : ""} publicado${banquetes.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                className="btn btn-primary rounded-xl px-8 shadow-lg normal-case font-bold gap-2"
                onClick={() => {
                  setBanqueteEdit(null);
                  switchTab("agregar");
                }}
              >
                <IconAdd />
                Agregar Banquete
              </button>
            </div>

            {error && (
              <div className="alert alert-error mb-8 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
                <button className="btn btn-sm btn-ghost" onClick={fetchBanquetes}>Reintentar</button>
              </div>
            )}

            {loading ? (
              <div className="animate-in fade-in duration-700">
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                  <ClinkingGlasses size="sm" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] mt-4">Actualizando Listado</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <BanqueteSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : banquetes.length === 0 ? (
              <EmptyState
                icon="🏰"
                title="Aún no tienes banquetes publicados"
                description="Empieza a rentabilizar tus espacios. Publica tu primer salón y llega a miles de clientes potenciales."
                action={
                  <button
                    className="btn btn-primary rounded-xl px-10 normal-case font-bold gap-2"
                    onClick={() => switchTab("agregar")}
                  >
                    <IconAdd />
                    Crear mi primera publicación
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banquetes.map((b) => (
                  <BanqueteCard
                    key={b._id}
                    banquete={b}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onManageAvailability={(banquete) => setAvailabilityModalData({ isOpen: true, banquete })}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pestaña: Agregar Banquete */}
        {activeTab === "agregar" && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">
                {banqueteEdit ? "Editar Banquete" : "Publicar Nuevo Banquete"}
              </h2>
              <p className="text-sm opacity-50 font-medium">
                {banqueteEdit
                  ? "Modifica la información de tu espacio. Recuerda que los cambios serán visibles de inmediato."
                  : "Completa todos los campos. Los campos marcados con * son obligatorios."}
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-200 rounded-[2.5rem]">
              <div className="card-body p-8 md:p-12">
                <BanqueteForm
                  onSuccess={handleFormSuccess}
                  banqueteEdit={banqueteEdit}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Calendario */}
        {activeTab === "calendario" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <OwnerCalendar />
          </div>
        )}

        {/* Pestaña: Estadísticas */}
        {activeTab === "estadisticas" && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">
                Estadísticas de tu Portafolio
              </h2>
              <p className="text-sm opacity-50 font-medium">
                Seguimiento del rendimiento de tus espacios publicados.
              </p>
            </div>
            <EstadisticasPanel totalBanquetes={banquetes.length} />
          </div>
        )}

        {/* Modal de Disponibilidad */}
        <BanqueteAvailabilityModal
          isOpen={availabilityModalData.isOpen}
          banquete={availabilityModalData.banquete}
          onClose={() => setAvailabilityModalData({ isOpen: false, banquete: null })}
        />
      </div>
    </div>
  );
};

export default MisBanquetes;
