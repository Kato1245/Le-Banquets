// src/features/auth/pages/ForgotPassword.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        toast.success(result.message || "Código enviado. Revisa tu correo.");
        // Redirigir a la página de reseteo pasando el email por la URL (opcional)
        // para que ResetPassword sepa a qué email pertenece el código.
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(result.message || "Error al solicitar recuperación");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-base-100 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/50 to-black/90"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-base-100/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-2">ta</h2>
            <p className="text-sm text-base-content/60 font-medium px-4">
              Ingresa tu dirección de correo y te enviaremos un enlace de restauración.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold opacity-70">Email de Registro</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-12 rounded-2xl focus:input-primary transition-all font-medium"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-2xl shadow-lg normal-case font-extrabold text-lg py-3 h-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Enviar Enlace Seguro"
              )}
            </button>
          </form>

          <div className="text-center mt-10 space-y-4">
            <p className="text-sm opacity-60">
              ¿Recordaste tu contraseña?
            </p>
            <Link to="/login" className="btn btn-ghost btn-sm rounded-xl normal-case font-bold text-primary hover:bg-primary/10">
              ← Volver al Inicio de Sesión
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-white/30 text-[10px] uppercase tracking-widest font-bold">
          Seguridad Blindada por Le Banquets Group
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
