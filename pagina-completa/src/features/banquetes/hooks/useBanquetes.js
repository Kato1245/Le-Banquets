import { useEffect, useState, useCallback } from "react";
import banquetesService from "../services/banquetesService";

export const useBanquetes = () => {
  const [banquetes, setBanquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanquetes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await banquetesService.getAllBanquetes();
      setBanquetes(data || []);
    } catch (err) {
      setError(err.friendlyMessage || "Error al cargar los banquetes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanquetes();
  }, [fetchBanquetes]);

  return { banquetes, loading, error, refresh: fetchBanquetes };
};
