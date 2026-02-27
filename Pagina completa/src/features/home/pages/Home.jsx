import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero min-h-screen relative overflow-hidden">
      {/* Fondo con imagen premium */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="hero-content relative z-10 text-neutral-content w-full flex justify-start px-8 lg:px-24">
        <div className="max-w-xl text-left">


          <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Momentos <span className="text-primary italic">Inolvidables</span> <br />
            Espacios Únicos.
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed font-light">
            Conectamos tus sueños con los banquetes y salones más exclusivos de la ciudad. Reserva con elegancia y facilidad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/banquetes" className="btn btn-primary btn-lg px-10 shadow-xl hover:shadow-primary/40 group">
              Explorar Banquetes
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {!localStorage.getItem('token') && (
              <Link to="/registro" className="btn btn-outline btn-lg text-white border-white/30 hover:bg-white/10 px-10">
                Poner mi salón
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;