import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import banquetesService from "../services/banquetesService";
import BanqueteCarousel from "../components/BanqueteCarousel";
import BanqueteCitaModal from "../components/BanqueteCitaModal";
import BanqueteReservaModal from "../components/BanqueteReservaModal";
import BanqueteGalleryModal from "../components/BanqueteGalleryModal";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

// Imágenes para los tipos de eventos
import quinceAnosImg from "../../../images/15Años.jfif";
import bodasImg from "../../../images/bodas.jfif";
import empresarialesImg from "../../../images/empresariales.jfif";
import otrosImg from "../../../images/otros.jfif";

const EVENT_IMAGES = {
  "15 Años": quinceAnosImg,
  "Bodas": bodasImg,
  "Eventos empresariales": empresarialesImg,
  "Otros": otrosImg
};

const EVENT_DESCRIPTIONS = {
  "15 Años": "Imagina una noche donde la elegancia y la energía se fusionan para celebrar tu gran debut: una producción de alto nivel que inicia con una entrada triunfal bajo luces robóticas, seguida de momentos emotivos como el vals de gala y el cambio de zapatilla. El evento alcanza su clímax con una coreografía profesional digna de un concierto y un cierre explosivo con DJ y efectos visuales, convirtiendo tu transición en una experiencia cinematográfica inolvidable para todos tus invitados.",
  "Bodas": "Imagina una producción cinematográfica diseñada exclusivamente para celebrar el inicio de su legado: una gala donde la ceremonia es el preludio perfecto para una recepción de alto nivel, fusionando un banquete de autor con una puesta en escena spectacular. Desde el primer baile bajo una lluvia de efectos visuales hasta una fiesta de gala con una curaduría musical impecable y coctelería premium, cada detalle está orquestado para que ustedes y sus invitados vivan una experiencia sensorial, elegante y profundamente emotiva que se convertirá en el estándar de oro de las celebraciones.",
  "Eventos empresariales": "Imagina una experiencia de alto impacto diseñada para elevar el prestigio de tu marca y consolidar el liderazgo de tu equipo en un entorno de pura sofisticación. Desde un networking de élite con coctelería de autor hasta una puesta en escena tecnológica de vanguardia, cada detalle está orquestado para proyectar innovación, éxito y solidez. Es el escenario perfecto para lanzamientos memorables o galas de reconocimiento, donde la excelencia operativa y una curaduría gastronómica impecable garantizan que tu mensaje no solo se escuche, sino que se convierta en el referente indiscutible de la industria.",
  "Otros": "Más allá de las grandes galas, nuestra maestría en la creación de experiencias se extiende a cualquier visión que desees materializar, desde la intimidad de un cóctel privado de lujo hasta la energía vibrante de conciertos y festivales de gran escala. Nos especializamos en curar lanzamientos de productos con impacto mediático, con cenas de gala temáticas que desafían lo convencional y retiros de bienestar que priorizan el equilibrio y la exclusividad. Sea cual sea el formato, transformamos un simple punto de encuentro en un ecosistema de diseño, tecnología y hospitalidad de primer nivel donde cada detalle respira la identidad única de tu visión."
};

const BanqueteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [banquete, setBanquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCitaModalOpen, setIsCitaModalOpen] = useState(false);
  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedEventLegend, setSelectedEventLegend] = useState(null);

  const handleAction = (type) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/banquetes/${id}` } });
      return;
    }

    const isOwner = user?.role === "propietario" || user?.userType === "propietario";
    const isAdmin = user?.role?.toLowerCase() === "admin" || user?.isAdmin;

    if (isOwner || isAdmin) {
      toast.error(`Acceso restringido: Los ${isAdmin ? "administradores" : "propietarios"} no pueden realizar reservas ni solicitar citas.`);
      return;
    }

    if (type === "visita") {
      setIsCitaModalOpen(true);
    } else if (type === "reserva") {
      setIsReservaModalOpen(true);
    }
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-10">
        <span>{error}</span>
        <Link to="/banquetes" className="btn btn-sm">
          Volver
        </Link>
      </div>
    );

  if (!banquete)
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold">Banquete no encontrado</h2>
        <Link to="/banquetes" className="btn btn-primary mt-4">
          Ver todos los banquetes
        </Link>
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
          <Link
            to="/banquetes"
            className="btn btn-ghost bg-base-100/20 backdrop-blur-md rounded-2xl normal-case font-bold border border-white/10 hover:bg-base-100/40 text-white"
          >
            ← Volver al Catálogo
          </Link>
        </div>

        {/* Floating Title Overlay (Desktop) */}
        <div className="absolute bottom-20 left-4 md:left-12 z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="badge badge-primary py-4 px-8 rounded-full mb-6 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl border-none">
            Espacio Exclusivo
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-primary tracking-tighter uppercase leading-[0.8] mb-4 break-words">
            {banquete.nombre}
          </h1>
          <p className="flex items-center gap-3 text-black/80 font-bold text-sm tracking-widest uppercase">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            {banquete.direccion || banquete.direccion}
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
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-8">
                Un entorno donde los{" "}
                <span className="text-primary italic serif lowercase">
                  sueños
                </span>{" "}
                cobran vida
              </h2>
              <p className="text-lg md:text-2xl opacity-70 leading-relaxed font-medium serif italic break-words whitespace-pre-line">
                {banquete.descripcion ||
                  "Este majestuoso salón ha sido concebido para quienes buscan la perfección en cada detalle. Arquitectura atemporal, iluminación de vanguardia y un servicio que redefine la hospitalidad de lujo."}
              </p>
            </div>

            {/* Grid de Atributos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 animate-in fade-in duration-1000 delay-300">
              <div className="p-8 bg-base-200/50 rounded-[2.5rem] border border-base-300 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">
                  Capacidad
                </p>
                <p className="text-2xl font-black">
                  {banquete.capacidad}{" "}
                  <span className="text-[10px]">PERS.</span>
                </p>
              </div>
              <div className="p-8 bg-base-200/50 rounded-[2.5rem] border border-base-300 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">
                  Dimensión
                </p>
                <p className="text-2xl font-black">
                  {banquete.dimensiones || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="p-8 bg-base-200/50 rounded-[2.5rem] border border-base-300 flex flex-col items-center text-center group hover:border-primary/30 transition-all col-span-2 md:col-span-1 hover:bg-base-200 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">
                  Galería
                </p>
                <p className="text-2xl font-black uppercase tracking-tighter">
                  Imágenes
                </p>
              </button>
            </div>


            {/* Especialidades del Espacio (Eventos) */}
            <div className="animate-in fade-in duration-1000 delay-500">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8 ml-1">
                Especialistas en Grandes Momentos
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {banquete.eventos_que_ofrece?.map((evento, i) => (
                  <div
                    key={i}
                    role="button"
                    onClick={() => setSelectedEventLegend(evento)}
                    className="group relative h-80 overflow-hidden rounded-[2.5rem] border border-base-300 bg-base-100 shadow-xl transition-all hover:border-primary/40 cursor-pointer active:scale-95"
                  >
                    {/* Imagen de fondo del evento */}
                    <img 
                      src={EVENT_IMAGES[evento] || otrosImg} 
                      alt={evento}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                    />
                    
                    {/* Overlay degradado */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    
                    {/* Contenido */}
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <div className="badge badge-primary py-3 mb-4 rounded-full font-black uppercase tracking-[0.2em] text-[8px] border-none shadow-lg">
                        Tipo de Evento
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        {evento}
                      </h3>
                      <div className="flex items-center gap-2 text-white/60 font-medium tracking-widest uppercase text-[9px]">
                        <span>Saber más</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Servicios Élite (seccion secundaria) */}
            {banquete.servicios && banquete.servicios.length > 0 && (
              <div className="animate-in fade-in duration-1000 delay-700">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8 ml-1">
                  Servicios de Élite Incluidos
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(Array.isArray(banquete.servicios) ? banquete.servicios : [banquete.servicios]).map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-base-200/50 border border-base-300 rounded-2xl hover:bg-primary/5 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold text-[10px] tracking-wide opacity-80 uppercase leading-tight">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-10 bg-base-100 border border-base-300 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-in slide-in-from-right-8 duration-1000">
              <div className="mb-12 text-center lg:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-3">
                  Inversión Final Sugerida
                </p>
                <div className="flex items-baseline justify-center lg:justify-start gap-2 flex-wrap">
                  <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter transition-all">
                    $
                    {(banquete.precio_base || banquete.precio)?.toLocaleString(
                      "es-CO",
                    )}
                  </span>
                  <span className="text-xs opacity-40 font-black uppercase mb-1">
                    COP
                  </span>
                </div>
                <p className="text-[10px] font-bold opacity-30 mt-3 italic">
                  * Precios base sujetos a personalización
                </p>
              </div>

              <div className="space-y-5">
                {isAuthenticated && (user?.role?.toLowerCase() === "admin" || user?.isAdmin || user?.role === "propietario" || user?.userType === "propietario") ? (
                  <div className="p-6 bg-base-200/50 rounded-3xl border border-dashed border-base-300 text-center">
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                      Modo de Gestión
                    </p>
                    <p className="text-[10px] opacity-30 mt-1 italic">
                      Las funciones de reserva están deshabilitadas para {user?.role === "propietario" || user?.userType === "propietario" ? "propietarios" : "administradores"}.
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction("reserva")}
                      className="btn btn-primary w-full h-20 rounded-[2rem] normal-case text-lg font-black shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] border-none"
                    >
                      Confirmar Reserva Ahora
                    </button>
                    <button
                      onClick={() => handleAction("visita")}
                      className="btn btn-ghost bg-base-content/5 hover:bg-base-content/10 w-full h-16 rounded-[2rem] normal-case text-md font-black opacity-60 hover:opacity-100 transition-all"
                    >
                      Solicitar Cita para Visita
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection banqueteId={banquete._id || banquete.id || id} />

      </div>

      {/* Footer Branding Area */}
      <div className="bg-base-200 mt-20 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-8xl font-black opacity-5 tracking-[0.2em] mb-4 uppercase">
            Le Banquets
          </h3>
          <p className="text-xs font-black uppercase tracking-[0.5em] opacity-20 italic">
            Redefiniendo el lujo en cada celebración
          </p>
        </div>
      </div>

      {/* Modal para Solicitar Cita */}
      <BanqueteCitaModal
        banquete={banquete}
        isOpen={isCitaModalOpen}
        onClose={() => setIsCitaModalOpen(false)}
      />

      {/* Modal para Solicitar Reserva (Calendario) */}
      <BanqueteReservaModal
        banquete={banquete}
        isOpen={isReservaModalOpen}
        onClose={() => setIsReservaModalOpen(false)}
      />

      {/* Modal para Galería de Imágenes */}
      <BanqueteGalleryModal
        banquete={banquete}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* Modal para Leyenda de Evento */}
      <dialog className={`modal ${selectedEventLegend ? 'modal-open' : ''} backdrop-blur-sm px-4`}>
        <div className="modal-box max-w-xl p-0 overflow-visible rounded-3xl border border-white/20 bg-base-100 shadow-2xl max-h-[90vh]">
          <div className="relative h-48 md:h-56 w-full shrink-0">
            <img 
              src={EVENT_IMAGES[selectedEventLegend] || otrosImg} 
              alt={selectedEventLegend} 
              className="w-full h-full object-cover object-top rounded-t-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent"></div>
            <button 
              onClick={() => setSelectedEventLegend(null)}
              className="absolute top-4 right-4 btn btn-circle btn-sm bg-black/20 backdrop-blur-md border-none text-white hover:bg-black/40 z-30"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-6 md:left-8">
              <div className="badge badge-primary py-3 mb-2 rounded-full font-black uppercase tracking-[0.2em] text-[8px] border-none shadow-sm">
                Conoce la experiencia
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-primary">{selectedEventLegend}</h3>
            </div>
          </div>
          
          <div className="p-6 md:p-8 overflow-y-auto">
            <p className="text-sm md:text-base lg:text-lg opacity-80 leading-relaxed font-medium serif italic text-pretty">
              {EVENT_DESCRIPTIONS[selectedEventLegend]}
            </p>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setSelectedEventLegend(null)}
                className="btn btn-primary px-8 rounded-xl normal-case font-black tracking-widest text-[10px] h-12"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedEventLegend(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default BanqueteDetail;
