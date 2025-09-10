// components/Carrusel/Carrusel.jsx
import { useState, useEffect } from "react";

// Componente Carrusel (para sección separada) - Versión con imágenes
const CarruselBanquetes = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            title: "Salón Imperial",
            description: "Un espacio majestuoso con capacidad para 300 personas, ideal para bodas y eventos de gala."
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            title: "Jardines del Palacio",
            description: "Un entorno natural perfecto para celebraciones al aire libre con un toque de elegancia."
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80",
            title: "Salón Ejecutivo",
            description: "El espacio perfecto para eventos corporativos y reuniones de negocios con capacidad para 150 personas."
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
            title: "Terraza Panorámica",
            description: "Disfruta de vistas espectaculares en nuestros eventos al atardecer con capacidad para 100 personas."
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            title: "Salón Versalles",
            description: "Un espacio versátil que se adapta a todo tipo de eventos con capacidad para 200 personas."
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="carousel w-full h-72 md:h-96 relative rounded-box overflow-hidden mt-8">
            {slides.map((slide, index) => (
                <div 
                    key={slide.id} 
                    id={`slide-${index}`}
                    className={`carousel-item relative w-full ${index === currentSlide ? 'block' : 'hidden'}`}
                >
                    <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center">
                        <div className="text-white max-w-2xl px-4">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                            <p className="text-lg">{slide.description}</p>
                        </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a 
                            onClick={prevSlide}
                            className="btn btn-circle bg-base-100 bg-opacity-50 border-none hover:bg-opacity-80"
                        >❮</a> 
                        <a 
                            onClick={nextSlide}
                            className="btn btn-circle bg-base-100 bg-opacity-50 border-none hover:bg-opacity-80"
                        >❯</a>
                    </div>
                </div> 
            ))}
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-base-100'}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Carrusel;