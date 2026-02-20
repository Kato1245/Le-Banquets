import { useBanquetes } from "../hooks/useBanquetes";
import BanqueteCard from "../components/BanqueteCard";

const BanquetesList = () => {
  const { banquetes, loading, error } = useBanquetes();

  if (loading) return <p>Cargando banquetes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Banquetes Disponibles</h1>

      <div className="banquetes-grid">
        {banquetes.map((banquete) => (
          <BanqueteCard key={banquete._id} banquete={banquete} />
        ))}
      </div>
    </div>
  );
};

export default BanquetesList;
