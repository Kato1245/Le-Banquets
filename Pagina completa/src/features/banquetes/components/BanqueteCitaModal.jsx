import { useState } from "react";
import toast from "react-hot-toast";
import citasService from "../services/citasService";

const BanqueteCitaModal = ({ banquete, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fecha_sugerida: new Date().toISOString().split("T")[0],
        hora_sugerida: "",
        mensaje: "",
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!isOpen || !banquete) return null;

    // Lógica del calendario interactivo
    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateSelect = (day) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selected < today) return; // No permitir fechas pasadas

        setFormData(prev => ({
            ...prev,
            fecha_sugerida: selected.toISOString().split("T")[0]
        }));
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const citaData = {
                banquete_id: banquete._id,
                ...formData,
                fecha_sugerida: new Date(formData.fecha_sugerida + 'T12:00:00')
            };
            await citasService.createCita(citaData);
            toast.success("¡Solicitud enviada! Te contactaremos pronto.");
            onClose();
        } catch (error) {
            toast.error(error.friendlyMessage || "Error al enviar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    const selectedDate = new Date(formData.fecha_sugerida + 'T12:00:00');

    return (
        <dialog open className="modal modal-open items-center justify-center p-4">
            <div className="modal-box max-w-4xl p-0 bg-base-100 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-base-300 overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="flex flex-col lg:flex-row min-h-[550px]">
                    
                    {/* Sección Izquierda: Calendario Premium Alignment */}
                    <div className="lg:w-1/2 p-10 bg-base-200/40 relative overflow-hidden flex flex-col">
                        {/* Glow effect matching Home.jsx stats */}
                        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
                        
                        <header className="relative z-10 mb-10">
                            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-white">
                                Reservar <br />
                            </h2>
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mt-4 border-l-2 border-primary pl-3">
                                {banquete.nombre}
                            </p>
                        </header>

                        <div className="relative z-10 space-y-6 flex-1 flex flex-col justify-center">
                            
                            <div className="bg-base-100/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-base-300 shadow-2xl relative group">
                                <div className="flex justify-between items-center mb-8 px-2">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">
                                        {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <div className="flex gap-1 bg-base-300/30 p-1 rounded-xl">
                                        <button type="button" onClick={prevMonth} className="btn btn-ghost btn-xs rounded-lg hover:bg-primary hover:text-white transition-all">«</button>
                                        <button type="button" onClick={nextMonth} className="btn btn-ghost btn-xs rounded-lg hover:bg-primary hover:text-white transition-all">»</button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                                        <span key={d} className="text-[9px] font-black opacity-20">{d}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {[...Array(firstDayOfMonth(currentMonth))].map((_, i) => (
                                        <div key={`empty-${i}`} className="h-10"></div>
                                    ))}
                                    {[...Array(daysInMonth(currentMonth))].map((_, i) => {
                                        const day = i + 1;
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isSelected = selectedDate.getDate() === day && 
                                                           selectedDate.getMonth() === currentMonth.getMonth() &&
                                                           selectedDate.getFullYear() === currentMonth.getFullYear();
                                        const isPast = date < new Date().setHours(0,0,0,0);

                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => handleDateSelect(day)}
                                                disabled={isPast}
                                                className={`h-11 w-full rounded-2xl text-[11px] font-black transition-all duration-300 ${
                                                    isSelected ? 'bg-primary text-black shadow-[0_10px_30px_-5px_rgba(220,165,78,0.5)] scale-110 z-10' : 
                                                    isPast ? 'opacity-5 cursor-not-allowed' : 'hover:bg-primary/20 hover:text-primary'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección Derecha: Parámetros Alignment */}
                    <div className="flex-1 p-10 md:p-14 flex flex-col justify-between bg-base-100 relative">
                        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-10 top-10 hover:bg-base-200 transition-all hover:rotate-90">✕</button>
                        
                        <form onSubmit={handleSubmit} className="space-y-10 h-full flex flex-col pt-6">
                            <div className="space-y-10 flex-1">
                                <div className="form-control group">
                                    <label className="label py-0 mb-4">
                                        <span className="label-text text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(220,165,78,1)]"></span>
                                            2. Franja Horaria
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            name="hora_sugerida"
                                            required
                                            className="input input-bordered w-full h-16 px-8 rounded-2xl bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-200 transition-all font-black text-sm tracking-[0.4em]"
                                            value={formData.hora_sugerida}
                                            onChange={handleChange}
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-20"></div>
                                    </div>
                                </div>

                                <div className="form-control group">
                                    <label className="label py-0 mb-4">
                                        <span className="label-text text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(220,165,78,1)]"></span>
                                            3. Observaciones Especiales
                                        </span>
                                    </label>
                                    <textarea
                                        name="mensaje"
                                        className="textarea textarea-bordered h-60 rounded-[2rem] bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-200 transition-all font-medium p-8 resize-none text-xs placeholder:opacity-20 shadow-inner"
                                        placeholder="¿Algún detalle que debamos considerar antes de tu visita?"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="relative pt-8 group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary btn-block h-15 rounded-[2rem] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-[11px] tracking-[0.4em] border-none relative z-10 uppercase text-black"
                                >
                                    {loading ? <span className="loading loading-spinner text-black"></span> : "Confirmar Visita"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop bg-black/95 backdrop-blur-md" onClick={onClose}></div>
        </dialog>
    );
};

export default BanqueteCitaModal;
