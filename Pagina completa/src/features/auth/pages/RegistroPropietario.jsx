// src/features/auth/pages/RegistroPropietario.jsx
import RegistroPropietarioForm from "../components/RegistroPropietarioForm.jsx"
import { Link } from "react-router-dom"

const RegistroPropietario = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/40 to-black/90"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="bg-base-100/95 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] shadow-2xl border border-white/20">
                    <div className="text-center mb-12">
                        <div className="badge badge-primary py-4 px-8 rounded-full mb-6 font-black uppercase tracking-[0.4em] text-[10px] border-2">
                            Business Partnership
                        </div>
                        <h2 className="text-5xl font-black text-primary tracking-tighter mb-4 uppercase">Expande tu Alcance</h2>
                        <p className="text-lg text-base-content/60 font-medium max-w-xl mx-auto">
                            Registra tu salón o casa de banquetes en la plataforma más exclusiva y conecta con clientes de alto nivel.
                        </p>
                    </div>

                    <div className="mt-2">
                        <RegistroPropietarioForm />
                    </div>

                    <div className="mt-12 pt-10 border-t border-base-content/5 flex flex-col items-center gap-6">
                        <p className="text-sm font-medium">
                            ¿Ya formas parte de la red? <Link to="/login" className="text-primary hover:underline font-black transition-all">Ingresar al Dashboard</Link>
                        </p>
                    </div>
                </div>
                <p className="text-center mt-8 text-white/30 text-[10px] uppercase tracking-[0.3em] font-black">
                    Le Banquets Group · Enterprise Division
                </p>
            </div>
        </div>
    )
}

export default RegistroPropietario;
