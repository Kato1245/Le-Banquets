import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Ocurrió un error al procesar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 bg-base-100/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="sm:mx-auto sm:w-full">
          <h2 className="text-3xl font-extrabold text-center text-base-content tracking-tight">Recuperar Contraseña</h2>
          <p className="mt-3 text-center text-sm text-base-content/60 px-4">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu acceso.
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="alert alert-success shadow-lg border-none bg-success/20 text-success py-3 px-4 rounded-xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error shadow-lg border-none bg-error/20 text-error py-3 px-4 rounded-xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="form-control group">
              <label className="label pb-2">
                <span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Correo electrónico</span>
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-base-200/50 border-white/10 focus:border-primary transition-all duration-300 rounded-xl"
                required
              />
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full h-12 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Enviar Instrucciones"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-8">
            <Link to="/login" className="text-sm font-bold text-primary hover:text-primary-focus transition-colors flex items-center justify-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
