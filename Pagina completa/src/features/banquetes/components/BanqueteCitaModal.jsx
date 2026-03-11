import { useState } from "react";
import toast from "react-hot-toast";
import citasService from "../services/citasService";

const BanqueteCitaModal = ({ banquete, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fecha_sugerida: "",
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
        <dialog open className="modal modal-open">
            <div className="modal-box max-w-2xl p-0 overflow-hidden bg-base-100 rounded-[3rem] shadow-2xl border border-primary/10">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6 z-50 hover:bg-base-200 transition-colors"
                >
                    ✕
                </button>

                <div className="p-12">
                    <header className="mb-10 text-center lg:text-left">
                        <div className="badge badge-primary py-4 px-6 rounded-full mb-4 font-black uppercase tracking-[0.3em] text-[10px] border-none">
                            Programar Visita
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Solicitar Cita</h2>
                        <p className="text-sm opacity-50 font-medium tracking-wide">
                            Estás solicitando una visita para: <span className="text-primary font-bold">{banquete.nombre}</span>
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-40">Fecha Sugerida</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_sugerida"
                                    required
                                    className="input input-bordered h-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-bold"
                                    value={formData.fecha_sugerida}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-40">Hora Sugerida</span>
                                </label>
                                <input
                                    type="time"
                                    name="hora_sugerida"
                                    required
                                    className="input input-bordered h-14 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary font-bold"
                                    value={formData.hora_sugerida}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-40">Mensaje o Notas (Opcional)</span>
                            </label>
                            <textarea
                                name="mensaje"
                                className="textarea textarea-bordered h-32 rounded-[2rem] bg-base-200/50 border-base-300 focus:textarea-primary font-medium p-6"
                                placeholder="Cuéntanos un poco sobre tu evento o dudas específicas..."
                                value={formData.mensaje}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full h-18 rounded-[2rem] normal-case text-lg font-black shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] border-none"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    "Confirmar Solicitud de Cita"
                                )}
                            </button>
                            <p className="text-[10px] text-center opacity-30 mt-4 font-bold uppercase tracking-widest">
                                * El equipo se pondrá en contacto contigo para confirmar disponibilidad.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <div className="modal-backdrop bg-black/60 backdrop-blur-md" onClick={onClose}></div>
        </dialog>
    );
};

export default BanqueteCitaModal;
