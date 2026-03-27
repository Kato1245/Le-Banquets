import { useState, useEffect, useCallback } from "react";
import { getImageUrl } from "../../../shared/utils/imageUtils";

const BanqueteGalleryModal = ({ banquete, isOpen, onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    // Definición de imágenes arriba del todo
    const images = banquete?.imagenes || [];

    // Usamos useCallback para que handleNext y handlePrev sean estables y se puedan usar en useEffect
    const handleNext = useCallback(() => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    // Cerrar visor con la tecla Escape y navegación con flechas
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) return;
            if (e.key === "Escape") setSelectedImageIndex(null);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };

        if (selectedImageIndex !== null) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImageIndex, handleNext, handlePrev]);

    if (!isOpen || !banquete) return null;

    return (
        <>
            <dialog open className="modal modal-open z-40">
                <div className="modal-box max-w-4xl p-0 overflow-hidden bg-base-100 rounded-[3rem] shadow-2xl border border-primary/10 h-[80vh] flex flex-col">
                    <div className="sticky top-0 bg-base-100/80 backdrop-blur-md z-50 p-8 border-b border-base-200 flex justify-between items-center">
                        <div>
                            <div className="badge badge-primary py-4 px-6 rounded-full mb-2 font-black uppercase tracking-[0.3em] text-[10px] border-none">
                                Galería de Fotos
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase">{banquete.nombre}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {images.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className="group relative overflow-hidden rounded-[2rem] aspect-video bg-base-200 border border-base-300 shadow-lg hover:shadow-primary/20 transition-all text-left"
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`Galería ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <span className="text-white font-black uppercase tracking-[0.2em] text-[10px] block mb-1">Imagen {index + 1}</span>
                                                <span className="text-white/70 text-[10px] font-bold uppercase">Click para ampliar</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="font-black uppercase tracking-widest">No hay imágenes adicionales</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-backdrop bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
            </dialog>

            {/* Visor de Imagen a Pantalla Completa (Lightbox) */}
            {selectedImageIndex !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedImageIndex(null)}></div>

                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-8 right-8 z-[110] btn btn-circle btn-ghost text-white hover:bg-white/10"
                    >
                        ✕
                    </button>

                    <div className="relative z-[105] max-w-6xl w-full h-full flex items-center justify-center group">
                        {/* Botón Anterior */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 btn btn-circle btn-lg bg-white/5 border-none text-white hover:bg-white/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
                            <img
                                src={getImageUrl(images[selectedImageIndex])}
                                alt="Visor"
                                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.1)] select-none animate-in zoom-in-95 duration-500"
                            />

                            <div className="bg-white/5 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 flex items-center gap-6">
                                <span className="text-white/40 font-black text-[10px] tracking-[0.3em] uppercase">
                                    {selectedImageIndex + 1} / {images.length}
                                </span>
                                <div className="h-4 w-px bg-white/10"></div>
                                <span className="text-white font-bold text-xs uppercase tracking-widest leading-none">
                                    {banquete.nombre}
                                </span>
                            </div>
                        </div>

                        {/* Botón Siguiente */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 btn btn-circle btn-lg bg-white/5 border-none text-white hover:bg-white/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Navegación Móvil (Tocar bordes) */}
                    <div className="absolute inset-y-0 left-0 w-20 z-[106] md:hidden" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
                    <div className="absolute inset-y-0 right-0 w-20 z-[106] md:hidden" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>
                </div>
            )}
        </>
    );
};

export default BanqueteGalleryModal;
