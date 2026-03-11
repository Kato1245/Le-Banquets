import { useState } from "react";
import toast from "react-hot-toast";
import citasService from "../services/citasService";
import { getImageUrl } from "../../../shared/utils/imageUtils";

const BanqueteCitaModal = ({ banquete, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fecha_sugerida: new Date().toISOString().split("T")[0],
        hora_sugerida: "",
        mensaje: "",
    });

    if (!isOpen || !banquete) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const citaData = {
                banquete_id: banquete._id,
                ...formData,
            };
            await citasService.createCita(citaData);
            toast.success("¡Solicitud de cita enviada correctamente!");
            onClose();
        } catch (error) {
            toast.error(error.friendlyMessage || "Error al enviar la solicitud de cita");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog open className="modal modal-open items-center justify-center p-4">
            <div className="modal-box max-w-5xl p-0 overflow-hidden bg-base-100 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col lg:flex-row min-h-[600px] animate-in zoom-in-95 duration-300">

                {/* Lado Izquierdo: Contexto Visual */}
                <div className="lg:w-5/12 relative hidden lg:block overflow-hidden bg-neutral">
                    <img
                        src={getImageUrl(banquete.imagenes?.[0])}
                        alt={banquete.nombre}
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-40 brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/80"></div>

                    <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
                        <div>
                            <div className="badge badge-outline border-white/30 text-white/70 py-4 px-6 rounded-full mb-8 font-black uppercase tracking-[0.3em] text-[10px]">
                                Previsualización de Visita
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                                {banquete.nombre}
                            </h3>
                            <p className="text-sm opacity-60 font-medium tracking-widest uppercase flex items-center gap-2">
                                <span className="text-primary text-xl">📍</span>
                                {banquete.direccion || banquete.ubicacion}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Protocolo de Visita</p>
                                <p className="text-xs leading-relaxed opacity-70">
                                    Nuestras visitas guiadas tienen una duración aproximada de 45 minutos donde conocerás cada rincón del salón y las opciones de personalización.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 px-4 opacity-40">
                                <div className="h-px flex-1 bg-current"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Le Banquets</span>
                                <div className="h-px flex-1 bg-current"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado Derecho: Formulario */}
                <div className="flex-1 p-8 md:p-14 relative bg-base-100">
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 hover:bg-base-200 transition-colors"
                    >
                        ✕
                    </button>

                    <header className="mb-10">
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 italic">Agendar Encuentro</h2>
                        <p className="text-sm opacity-40 font-bold tracking-widest uppercase">Completa los detalles para tu visita personalizada</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10 group-focus-within:scale-110 transition-transform">📅</span>
                                    <input
                                        type="date"
                                        name="fecha_sugerida"
                                        required
                                        className="input input-bordered w-full h-14 pl-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-black uppercase text-[10px] tracking-widest transition-all"
                                        value={formData.fecha_sugerida}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold z-10 group-focus-within:scale-110 transition-transform">🕒</span>
                                    <input
                                        type="time"
                                        name="hora_sugerida"
                                        required
                                        className="input input-bordered w-full h-14 pl-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-black text-[10px] tracking-[0.3em] transition-all"
                                        value={formData.hora_sugerida}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botón ahora arriba del textarea para acceso rápido */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full h-14 rounded-[2.5rem] normal-case text-lg font-black shadow-[0_20px_40px_-10px_rgba(var(--p),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--p),0.5)] transition-all hover:scale-[1.01] active:scale-95 border-none group"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner text-white"></span>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        SOLICITAR CITA AHORA
                                        <span className="group-hover:translate-x-2 transition-transform">→</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        <div className="form-control flex-1">
                            <textarea
                                name="mensaje"
                                className="textarea textarea-bordered w-full h-44 rounded-[2.5rem] bg-base-200/30 border-base-300 focus:textarea-primary font-medium p-8 leading-relaxed resize-none transition-all placeholder:opacity-30 text-sm"
                                placeholder="Escribe aquí tu visión, dudas o detalles especiales sobre tu evento... (Opcional)"
                                value={formData.mensaje}
                                onChange={handleChange}
                            ></textarea>
                            <div className="flex items-center justify-center gap-4 mt-4 opacity-20">
                                <div className="h-px flex-1 bg-current"></div>
                                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Confirmación en menos de 24h</p>
                                <div className="h-px flex-1 bg-current"></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="modal-backdrop bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
        </dialog>
    );
};

export default BanqueteCitaModal;
