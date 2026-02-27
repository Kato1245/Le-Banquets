import { useBanquetes } from "../hooks/useBanquetes";
import BanqueteCard from "../components/BanqueteCard";

const BanquetesList = () => {
  const { banquetes, loading, error } = useBanquetes();

  if (loading) return <p>Cargando banquetes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Banquetes Disponibles</h1>
        <p className="text-base-content/70">Descubre los mejores espacios para tus eventos inolvidables</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {banquetes.map((banquete) => (
          <BanqueteCard key={banquete._id} banquete={banquete} />
        ))}
      </div>
    </div>
  );
};

export default BanquetesList;
