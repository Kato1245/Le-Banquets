// src/features/perfil/pages/Eventos.jsx
import { useState } from "react";

const Eventos = () => {
    const [selectedFilter, setSelectedFilter] = useState("todos");
    const [selectedEvento, setSelectedEvento] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const eventos = [
        {
            id: 1,
            nombre: "Boda Elegante",
            descripcion: "Celebra tu día especial con un servicio completo de bodas que incluye ceremonia, recepción y todos los detalles.",
            imagen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "boda",
            precio: 25000000,
            duracion: "8 horas",
            capacidad: 150,
            serviciosIncluidos: ["Coordinador de bodas", "Decoración floral", "Banquete gourmet", "Pastel nupcial", "Fotógrafo profesional", "Música ambiental"],
            serviciosAdicionales: ["Video profesional", "Cabina de fotos", "Barra libre premium", "Fireworks", "Transporte para invitados"],
            testimonios: [
                "Nuestra boda fue perfecta gracias al equipo de Le Banquets. Todo estuvo impecable.",
                "La atención al detalle y la calidad del servicio superaron todas nuestras expectativas."
            ]
        },
        {
            id: 2,
            nombre: "Evento Corporativo",
            descripcion: "Impresiona a tus clientes y empleados con eventos corporativos profesionales y bien organizados.",
            imagen: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
            tipo: "corporativo",
            precio: 12000000,
            duracion: "6 horas",
            capacidad: 200,
            serviciosIncluidos: ["Salón equipado", "Coffee breaks", "Equipo de sonido", "Proyector y pantalla", "Wi-Fi empresarial", "Personal de apoyo"],
            serviciosAdicionales: ["Traducción simultánea", "Team building activities", "Regalos corporativos", "Transmisión en vivo", "Fotografía profesional"],
            testimonios: [
                "El evento anual de nuestra empresa fue un éxito total gracias a la organización impecable.",
                "La tecnología y los espacios son perfectos para eventos corporativos de alto nivel."
            ]
        },
        {
            id: 3,
            nombre: "Fiesta de 15 Años",
            descripcion: "Celebra esta fecha especial con una fiesta inolvidable llena de magia, música y diversión.",
            imagen: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "quinceaneros",
            precio: 18000000,
            duracion: "6 horas",
            capacidad: 120,
            serviciosIncluidos: ["Decoración temática", "Show de luces", "DJ profesional", "Buffet juvenil", "Torta personalizada", "Coordinador de evento"],
            serviciosAdicionales: ["Video mapping", "Cabina de fotos", "Barra de postres", "Souvenirs personalizados", "Animación para jóvenes"],
            testimonios: [
                "Mi hija quedó encantada con su fiesta de 15, todo era exactamente como lo soñó.",
                "La atención a los detalles y la energía del equipo hicieron la diferencia."
            ]
        },
        {
            id: 4,
            nombre: "Cena de Gala",
            descripcion: "Eventos formales con servicio de catering gourmet y ambiente sofisticado para ocasiones especiales.",
            imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "gala",
            precio: 15000000,
            duracion: "5 horas",
            capacidad: 100,
            serviciosIncluidos: ["Menú degustación", "Servicio de vinos", "Música en vivo", "Decoración elegante", "Mobiliario premium", "Personal especializado"],
            serviciosAdicionales: ["Maridaje premium", "Chef internacional", "Show cooking", "Valet parking", "Regalos para invitados"],
            testimonios: [
                "La cena de beneficencia fue un éxito rotundo, la comida exquisita y el servicio impecable.",
                "Nunca había vivido una experiencia gastronómica tan refinada en un evento."
            ]
        },
        {
            id: 5,
            nombre: "Fiesta Infantil",
            descripcion: "Celebraciones mágicas para los más pequeños con temáticas divertidas y entretenimiento adecuado.",
            imagen: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
            tipo: "infantil",
            precio: 8000000,
            duracion: "4 horas",
            capacidad: 80,
            serviciosIncluidos: ["Decoración temática", "Animador profesional", "Menú infantil", "Piñata", "Torta personalizada", "Área de juegos"],
            serviciosAdicionales: ["Personajes animados", "Juegos inflables", "Cotillón temático", "Fotografía infantil", "Regalos para niños"],
            testimonios: [
                "El cumpleaños de mi hijo fue mágico, los niños no querían irse y los papás también disfrutaron.",
                "La organización y la atención a los detalles para los niños fue extraordinaria."
            ]
        },
        {
            id: 6,
            nombre: "Coctel de Negocios",
            descripcion: "Eventos de networking con ambiente distendido pero profesional, ideal para conectar con clientes y socios.",
            imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "coctel",
            precio: 9000000,
            duracion: "3 horas",
            capacidad: 150,
            serviciosIncluidos: ["Barra libre", "Pasapalos gourmet", "Ambientación moderna", "Sonido ambiental", "Personal de servicio", "Estaciones de networking"],
            serviciosAdicionales: ["Mixólogo profesional", "Estación de sushi", "Branding personalizado", "Fotografía corporativa", "Traductor simultáneo"],
            testimonios: [
                "El coctel de lanzamiento de producto fue perfecto para generar conexiones valiosas.",
                "La combinación de ambiente profesional y distendido fue exactamente lo que buscábamos."
            ]
        },
        {
            id: 7,
            nombre: "Conferencia Académica",
            descripcion: "Eventos académicos y científicos con todas las facilidades tecnológicas para presentaciones y debates.",
            imagen: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "academico",
            precio: 7500000,
            duracion: "8 horas",
            capacidad: 180,
            serviciosIncluidos: ["Salón con capacidad auditorio", "Sistema de proyección HD", "Micrófonos inalámbricos", "Wi-Fi de alta velocidad", "Recording de sesiones", "Personal técnico"],
            serviciosAdicionales: ["Traducción simultánea", "Transmisión en vivo", "Materiales de trabajo", "Certificados de asistencia", "Publicación de memorias"],
            testimonios: [
                "La conferencia internacional fue un éxito gracias a la infraestructura tecnológica.",
                "Todo estuvo perfectamente organizado para un evento académico de alto nivel."
            ]
        },
        {
            id: 8,
            nombre: "Fiesta Temática",
            descripcion: "Eventos con temáticas específicas que transportan a los invitados a mundos fantásticos y experiencias únicas.",
            imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
            tipo: "tematico",
            precio: 16000000,
            duracion: "6 horas",
            capacidad: 120,
            serviciosIncluidos: ["Decoración temática completa", "Vestuario para staff", "Música acorde a la temática", "Iluminación especial", "Actores caracterizados", "Coordinador temático"],
            serviciosAdicionales: ["Efectos especiales", "Realidad virtual", "Fotografía caracterizada", "Souvenirs temáticos", "Transporte tematizado"],
            testimonios: [
                "La fiesta de los años 20 fue increíble, nos transportamos a otra época completamente.",
                "Los detalles temáticos fueron impresionantes, superó todas nuestras expectativas."
            ]
        },
        {
            id: 9,
            nombre: "Lanzamiento de Producto",
            descripcion: "Eventos especializados para presentar nuevos productos con impacto y creatividad.",
            imagen: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "lanzamiento",
            precio: 14000000,
            duracion: "4 horas",
            capacidad: 200,
            serviciosIncluidos: ["Escenario profesional", "Sistema de sonido e iluminación", "Pantallas LED", "Branding personalizado", "Personal de producción", "Área de exhibición"],
            serviciosAdicionales: ["Realidad aumentada", "Influencers", "Cobertura mediática", "Regalos promocionales", "Transmisión en redes"],
            testimonios: [
                "El lanzamiento de nuestro nuevo producto fue un éxito mediático gracias a la producción.",
                "La creatividad y ejecución del evento generó gran expectativa en el mercado."
            ]
        },
        {
            id: 10,
            nombre: "Celebración de Aniversario",
            descripcion: "Eventos conmemorativos para celebrar hitos importantes de empresas o personas.",
            imagen: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "aniversario",
            precio: 11000000,
            duracion: "5 horas",
            capacidad: 150,
            serviciosIncluidos: ["Decoración conmemorativa", "Timeline visual", "Show de entretenimiento", "Brindis especial", "Torta personalizada", "Fotografía profesional"],
            serviciosAdicionales: ["Video retrospectivo", "Regalos conmemorativos", "Fireworks", "Book de recuerdos", "Transmisión para invitados virtuales"],
            testimonios: [
                "El aniversario de 25 años de nuestra empresa fue emotivo y perfectamente organizado.",
                "Cada detalle reflejaba nuestra historia y valores corporativos."
            ]
        },
        {
            id: 11,
            nombre: "Workshop Creativo",
            descripcion: "Eventos interactivos y educativos con espacios diseñados para el aprendizaje y la creatividad.",
            imagen: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
            tipo: "workshop",
            precio: 6000000,
            duracion: "6 horas",
            capacidad: 60,
            serviciosIncluidos: ["Espacios de trabajo grupales", "Materiales básicos", "Pantallas para instructores", "Sonido para presentaciones", "Coffee breaks", "Personal de apoyo"],
            serviciosAdicionales: ["Kits de materiales premium", "Grabación de sesiones", "Certificados de participación", "Mentorías personalizadas", "Networking guiado"],
            testimonios: [
                "El workshop fue perfecto para nuestro equipo, los espacios facilitaron la creatividad.",
                "La organización permitió que nos concentráramos completamente en el aprendizaje."
            ]
        },
        {
            id: 12,
            nombre: "Fiesta de Graduación",
            descripcion: "Celebraciones para marcar el fin de una etapa educativa y el comienzo de una nueva.",
            imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "graduacion",
            precio: 9500000,
            duracion: "5 horas",
            capacidad: 100,
            serviciosIncluidos: ["Decoración académica", "Área de fotos con diploma", "Música para jóvenes", "Buffet variado", "Coordinador de evento", "Seguridad"],
            serviciosAdicionales: ["Photobooth divertido", "Dj especializado", "Barra de smoothies", "Souvenirs graduación", "Transmisión para familiares"],
            testimonios: [
                "Mi fiesta de graduación fue exactamente como quería, divertida y memorable.",
                "Los organizadores entendieron perfectamente lo que queríamos los recién graduados."
            ]
        },
        {
            id: 13,
            nombre: "Evento Benéfico",
            descripcion: "Eventos con causa social para recaudar fondos y crear conciencia sobre importantes iniciativas.",
            imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "benefico",
            precio: 13000000,
            duracion: "4 horas",
            capacidad: 180,
            serviciosIncluidos: ["Ambientación solidaria", "Sistema de donaciones", "Presentación de la causa", "Personal voluntario", "Comunicación visual", "Coordinación general"],
            serviciosAdicionales: ["Celebridades invitadas", "Subasta benéfica", "Cobertura mediática", "Reporte de impacto", "Reconocimientos a donantes"],
            testimonios: [
                "El evento benéfico superó nuestras expectativas de recaudación y concienciación.",
                "La organización permitió que nos enfocáramos en la causa, no en los detalles logísticos."
            ]
        },
        {
            id: 14,
            nombre: "Celebración Cultural",
            descripcion: "Eventos que destacan y celebran la diversidad cultural con autenticidad y respeto.",
            imagen: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "cultural",
            precio: 12000000,
            duracion: "5 horas",
            capacidad: 200,
            serviciosIncluidos: ["Decoración cultural", "Música tradicional", "Show cultural", "Comida típica", "Guías culturales", "Personal bilingüe"],
            serviciosAdicionales: ["Talleres culturales", "Artistas internacionales", "Mercado artesanal", "Vestuario tradicional", "Documentación fotográfica"],
            testimonios: [
                "La celebración del festival cultural fue auténtica y respetuosa con las tradiciones.",
                "Los detalles culturales estuvieron presentes en cada aspecto del evento."
            ]
        },
        {
            id: 15,
            nombre: "Fiesta de Fin de Año",
            descripcion: "Eventos para despedir el año y recibir el nuevo con alegría, optimismo y celebración.",
            imagen: "https://images.unsplash.com/photo-1519686997393-7bdb73c7bb60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            tipo: "finano",
            precio: 17000000,
            duracion: "7 horas",
            capacidad: 250,
            serviciosIncluidos: ["Decoración festiva", "Countdown especial", "Show de luces", "Cena de gala", "Barra libre", "Coordinación de brindis"],
            serviciosAdicionales: ["Fireworks espectacular", "DJ internacional", "Photo booth con props", "Regalos de año nuevo", "Transporte seguro"],
            testimonios: [
                "La fiesta de fin de año fue la mejor manera de despedir el año, increíble ambiente.",
                "La cuenta regresiva y los fireworks fueron espectaculares, un momento mágico."
            ]
        }
    ];

    const tiposEvento = [
        { id: "todos", nombre: "Todos los eventos" },
        { id: "boda", nombre: "Bodas" },
        { id: "corporativo", nombre: "Corporativos" },
        { id: "quinceaneros", nombre: "15 Años" },
        { id: "gala", nombre: "Galas" },
        { id: "infantil", nombre: "Infantiles" },
        { id: "coctel", nombre: "Cócteles" },
        { id: "academico", nombre: "Académicos" },
        { id: "tematico", nombre: "Temáticos" },
        { id: "lanzamiento", nombre: "Lanzamientos" },
        { id: "aniversario", nombre: "Aniversarios" },
        { id: "workshop", nombre: "Workshops" },
        { id: "graduacion", nombre: "Graduaciones" },
        { id: "benefico", nombre: "Benéficos" },
        { id: "cultural", nombre: "Culturales" },
        { id: "finano", nombre: "Fin de Año" }
    ];

    const eventosFiltrados = selectedFilter === "todos"
        ? eventos
        : eventos.filter(evento => evento.tipo === selectedFilter);

    const eventosBuscados = eventosFiltrados.filter(evento =>
        evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (evento) => {
        setSelectedEvento(evento);
        document.getElementById('modal_evento').showModal();
    };

    const closeModal = () => {
        setSelectedEvento(null);
    };

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-2">Tipos de Eventos</h1>
                <p className="text-lg text-center mb-8 max-w-3xl mx-auto text-base-content/70">
                    Explorá los tipos de eventos para los que podés buscar un espacio en nuestra plataforma
                </p>

                <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-grow w-full">
                            <input
                                type="text"
                                placeholder="Buscar eventos por nombre, descripción o tipo..."
                                className="input input-bordered w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {tiposEvento.map(tipo => (
                        <button
                            key={tipo.id}
                            className={`btn btn-sm ${selectedFilter === tipo.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setSelectedFilter(tipo.id)}
                        >
                            {tipo.nombre}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventosBuscados.map(evento => (
                        <div key={evento.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <figure className="h-56">
                                <img src={evento.imagen} alt={evento.nombre} className="w-full h-full object-cover" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{evento.nombre}</h2>
                                <p className="line-clamp-2">{evento.descripcion}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="badge badge-primary">{evento.capacidad} personas</div>
                                    <div className="badge badge-outline">{evento.duracion}</div>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-primary" onClick={() => openModal(evento)}>Ver detalles</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <dialog id="modal_evento" className="modal">
                    <div className="modal-box max-w-5xl">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                        </form>
                        {selectedEvento && (
                            <div>
                                <h3 className="font-bold text-2xl mb-4">{selectedEvento.nombre}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <img src={selectedEvento.imagen} alt={selectedEvento.nombre} className="w-full h-64 object-cover rounded-lg" />
                                        <div className="mt-4 space-y-1">
                                            <p className="text-sm"><strong>Capacidad típica:</strong> {selectedEvento.capacidad} personas</p>
                                            <p className="text-sm"><strong>Duración estimada:</strong> {selectedEvento.duracion}</p>
                                            <p className="text-sm text-base-content/60">
                                                Los precios y condiciones los define cada propietario de espacio.
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2">Lo que suelen necesitar estos eventos</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {selectedEvento.serviciosIncluidos.map((servicio, index) => (
                                                <li key={index} className="text-sm">{servicio}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="modal-action">
                                    <a href="/salones" className="btn btn-primary">Buscar salones para este evento</a>
                                    <form method="dialog">
                                        <button className="btn btn-ghost" onClick={closeModal}>Cerrar</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default Eventos;
