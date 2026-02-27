// src/features/home/components/Carrusel.jsx
import { useState } from "react";

const CarruselBanquetes = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Estos son ejemplos de espacios publicados por propietarios en la plataforma
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            title: "Salón Imperial",
            description: "Capacidad para 300 personas — ideal para bodas y eventos de gala.",
            badge: "Bodas"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            title: "Jardines del Palacio",
            description: "Espacio al aire libre con capacidad para 200 personas. Perfecto para celebraciones.",
            badge: "Jardin"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
            title: "Salón Ejecutivo",
            description: "Espacio moderno para eventos corporativos y reuniones. Capacidad para 150 personas.",
            badge: "Corporativo"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
            title: "Terraza Panorámica",
            description: "Vistas espectaculares con capacidad para 100 personas. Ideal para eventos al atardecer.",
            badge: "Terraza"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            title: "Salón Versalles",
            description: "Espacio versátil y elegante para todo tipo de eventos. Capacidad para 200 personas.",
            badge: "Multiuso"
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="carousel w-full h-72 md:h-96 relative rounded-box overflow-hidden mt-8">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    id={`slide-${index}`}
                    className={`carousel-item relative w-full ${index === currentSlide ? 'block' : 'hidden'}`}
                >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center">
                        <div className="text-white max-w-2xl px-4">
                            <div className="badge badge-primary badge-lg mb-3">{slide.badge}</div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                            <p className="text-lg">{slide.description}</p>
                        </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <button onClick={prevSlide} className="btn btn-circle bg-base-100 bg-opacity-50 border-none hover:bg-opacity-80">❮</button>
                        <button onClick={nextSlide} className="btn btn-circle bg-base-100 bg-opacity-50 border-none hover:bg-opacity-80">❯</button>
                    </div>
                </div>
            ))}

            {/* Indicadores */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-primary' : 'bg-white bg-opacity-60'}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default CarruselBanquetes;
