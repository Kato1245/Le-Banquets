import { useBanquetes } from "../hooks/useBanquetes";
import BanqueteCard from "../components/BanqueteCard";

const BanquetesList = () => {
  const { banquetes, loading, error } = useBanquetes();

  if (loading) return <p>Cargando banquetes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header para Banquetes */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Nuestros <span className="text-primary italic">Banquetes</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl font-light">
            Descubre espacios mágicos y servicios excepcionales para que tu evento sea simplemente perfecto.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-base-content">Catálogo Exclusivo</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
          <div className="badge badge-outline border-primary/30 py-4 px-6 text-sm font-medium">
            {banquetes.length} Espacios Disponibles
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {banquetes.map((banquete) => (
            <BanqueteCard key={banquete._id} banquete={banquete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BanquetesList;
