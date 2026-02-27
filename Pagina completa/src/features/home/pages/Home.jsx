import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">

          <h1 className="text-5xl font-bold text-primary">
            Encuentra el banquete perfecto
          </h1>

          <p className="py-6 text-base-content/70">
            Reserva salones, catering y eventos en un solo lugar.
          </p>

          <Link to="/banquetes" className="btn btn-primary btn-lg">
            Explorar ahora
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Home;