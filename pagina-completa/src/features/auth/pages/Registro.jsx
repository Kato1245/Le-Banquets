// src/features/auth/pages/Registro.jsx
import RegistroForm from "../components/RegistroForm.jsx"
import { Link } from "react-router-dom"

const Registro = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="bg-base-100/95 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-3">Únete a la Realeza</h2>
            <p className="text-base text-base-content/60 font-medium">
              Planifica los eventos de tus sueños con herramientas exclusivas.
            </p>
          </div>

          <div className="mt-2">
            <RegistroForm />
          </div>
        </div>

        <p className="text-center mt-8 text-white/40 text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} LE BANQUETS GROUP · PREMIUM EVENT MANAGEMENT
        </p>
      </div>
    </div>
  )
}

export default Registro;
