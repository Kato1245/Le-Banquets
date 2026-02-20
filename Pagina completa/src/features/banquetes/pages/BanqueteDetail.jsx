import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import banquetesService from "../services/banquetesService";
import BanqueteCarousel from "../components/BanqueteCarousel";

const BanqueteDetail = () => {
  const { id } = useParams();
  const [banquete, setBanquete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanquete = async () => {
      try {
        const data = await banquetesService.getAllBanquetes();
        const found = data.find((b) => b._id === id);
        setBanquete(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanquete();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!banquete) return <p>Banquete no encontrado</p>;

  return (
    <div>
      <h1>{banquete.nombre}</h1>

      <BanqueteCarousel images={banquete.imagenes} />

      <p><strong>Ubicación:</strong> {banquete.ubicacion}</p>
      <p><strong>Capacidad:</strong> {banquete.capacidad}</p>
      <p><strong>Tamaño:</strong> {banquete.tamano} m²</p>
      <p><strong>Servicios:</strong> {banquete.servicios?.join(", ")}</p>
      <p><strong>Precio:</strong> ${banquete.precio}</p>

      <button>Solicitar Reserva</button>
      <button>Solicitar Visita</button>
    </div>
  );
};

export default BanqueteDetail;
