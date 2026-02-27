import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import banquetesService from "../services/banquetesService";
import BanqueteCarousel from "../components/BanqueteCarousel";
import { useAuth } from "@/context/AuthContext";

const BanqueteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [banquete, setBanquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAction = (type) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/banquetes/${id}` } });
      return;
    }
    // Lógica para reserva o visita (se implementará después)
    console.log(`Solicitando ${type} para ${id}`);
  };

  useEffect(() => {
    const fetchBanquete = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await banquetesService.getBanqueteById(id);
        setBanquete(data);
      } catch (err) {
        setError(err.friendlyMessage || "Error al cargar el banquete");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBanquete();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error max-w-2xl mx-auto mt-10">
      <span>{error}</span>
      <Link to="/banquetes" className="btn btn-sm">Volver</Link>
    </div>
  );

  if (!banquete) return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold">Banquete no encontrado</h2>
      <Link to="/banquetes" className="btn btn-primary mt-4">Ver todos los banquetes</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <BanqueteCarousel images={banquete.imagenes} />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary">{banquete.nombre}</h1>

          <div className="flex flex-wrap gap-4 text-sm opacity-70">
            <span className="badge badge-outline">Ubicación: {banquete.direccion || banquete.ubicacion}</span>
            <span className="badge badge-outline">Capacidad: {banquete.capacidad} pers.</span>
            <span className="badge badge-outline">Área: {banquete.tamano || 'N/A'} m²</span>
          </div>

          <div className="divider"></div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Servicios Incluidos</h3>
            <div className="flex flex-wrap gap-2">
              {banquete.servicios?.map((s, i) => (
                <span key={i} className="badge badge-secondary badge-outline">{s}</span>
              ))}
            </div>
          </div>

          <div className="p-6 bg-base-200 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Precio base</span>
              <span className="text-3xl font-bold text-primary">${banquete.precio_base || banquete.precio}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction('reserva')}
                className="btn btn-primary"
              >
                Solicitar Reserva
              </button>
              <button
                onClick={() => handleAction('visita')}
                className="btn btn-outline btn-primary"
              >
                Solicitar Visita
              </button>
            </div>
          </div>

          <p className="text-base-content/80 leading-relaxed">
            {banquete.descripcion || "Sin descripción disponible."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BanqueteDetail;
