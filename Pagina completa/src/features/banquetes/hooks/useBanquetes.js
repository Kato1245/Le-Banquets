import { useEffect, useState } from "react";
import banquetesService from "../services/banquetesService";

export const useBanquetes = () => {
  const [banquetes, setBanquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanquetes = async () => {
      try {
        const data = await banquetesService.getAllBanquetes();
        setBanquetes(data);
      } catch (err) {
        setError("Error al cargar los banquetes");
      } finally {
        setLoading(false);
      }
    };

    fetchBanquetes();
  }, []);

  return { banquetes, loading, error };
};
