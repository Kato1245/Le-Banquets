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
    <div className="min-h-screen bg-base-100 selection:bg-primary selection:text-white">
      {/* Hero Section / Carrusel */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <BanqueteCarousel images={banquete.imagenes} />
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent pointer-events-none"></div>

        {/* Breadcrumbs & Back Button */}
        <div className="absolute top-8 left-4 md:left-12 z-20">
          <Link to="/banquetes" className="btn btn-ghost bg-base-100/20 backdrop-blur-md rounded-2xl normal-case font-bold border border-white/10 hover:bg-base-100/40 text-white">
            ← Volver al Catálogo
          </Link>
        </div>

        {/* Floating Title Overlay (Desktop) */}
        <div className="absolute bottom-20 left-4 md:left-12 z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="badge badge-primary py-4 px-8 rounded-full mb-6 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl border-none">
            Espacio Exclusivo
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">
            {banquete.nombre}
          </h1>
          <p className="flex items-center gap-3 text-white/80 font-bold text-sm tracking-widest uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {banquete.direccion || banquete.ubicacion}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-16">

            {/* Esencia Section */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-6 flex items-center gap-4">
                <span className="w-10 h-px bg-current opacity-20"></span>
                Inspiración del Espacio
              </p>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-8">
                Un entorno donde los <span className="text-primary italic serif lowercase">sueños</span> cobran vida
              </h2>
              <p className="text-2xl opacity-70 leading-relaxed font-medium serif italic">
                {banquete.descripcion || "Este majestuoso salón ha sido concebido para quienes buscan la perfección en cada detalle. Arquitectura atemporal, iluminación de vanguardia y un servicio que redefine la hospitalidad de lujo."}
              </p>
            </div>

            {/* Grid de Atributos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 animate-in fade-in duration-1000 delay-300">
              <div className="p-8 bg-base-200/50 rounded-[2.5rem] border border-base-300 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Capacidad</p>
                <p className="text-2xl font-black">{banquete.capacidad} <span className="text-[10px]">PERS.</span></p>
              </div>
              <div className="p-8 bg-base-200/50 rounded-[2.5rem] border border-base-300 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Dimensión</p>
                <p className="text-2xl font-black">{banquete.tamano || '750'} <span className="text-[10px]">M²</span></p>
              </div>
              <div className="p-8 bg-base-200/50 rounded-[2.5rem] border border-base-300 flex flex-col items-center text-center group hover:border-primary/30 transition-all col-span-2 md:col-span-1">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">Categoría</p>
                <p className="text-2xl font-black uppercase tracking-tighter">{banquete.tipo || 'Lujo'}</p>
              </div>
            </div>

            {/* Servicios Elite */}
            <div className="animate-in fade-in duration-1000 delay-500">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8 ml-1">Servicios de Élite Incluidos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banquete.servicios?.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-base-100 border border-base-300 rounded-[1.8rem] hover:bg-base-200/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm tracking-wide opacity-80 uppercase">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-10 bg-base-100 border border-base-300 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-in slide-in-from-right-8 duration-1000">
              <div className="mb-10 text-center lg:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Inversión Final Sugerida</p>
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <span className="text-5xl font-black text-primary tracking-tighter">
                    ${(banquete.precio_base || banquete.precio)?.toLocaleString('es-CO')}
                  </span>
                  <span className="text-sm opacity-40 font-black uppercase">COP</span>
                </div>
                <p className="text-[10px] font-bold opacity-30 mt-2 italic">* Precios base sujetos a personalización</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleAction('reserva')}
                  className="btn btn-primary w-full h-20 rounded-[2rem] normal-case text-lg font-black shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] border-none"
                >
                  Confirmar Reserva Ahora
                </button>
                <button
                  onClick={() => handleAction('visita')}
                  className="btn btn-ghost bg-base-200/50 hover:bg-base-200 w-full h-16 rounded-[2rem] normal-case text-md font-black opacity-60 hover:opacity-100 transition-all"
                >
                  Solicitar Cita para Visita
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-base-content/5 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Seguridad Garantizada</p>
                    <p className="text-xs opacity-50 font-medium">Su reserva está protegida por nuestros estándares de calidad y cumplimiento.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Atención 24/7</p>
                    <p className="text-xs opacity-50 font-medium">Asesoría personalizada para coordinar cada segundo de su celebración.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Area */}
      <div className="bg-base-200 mt-20 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-8xl font-black opacity-5 tracking-[0.2em] mb-4 uppercase">Le Banquets</h3>
          <p className="text-xs font-black uppercase tracking-[0.5em] opacity-20 italic">Redefiniendo el lujo en cada celebración</p>
        </div>
      </div>
    </div>
  );
};

export default BanqueteDetail;
