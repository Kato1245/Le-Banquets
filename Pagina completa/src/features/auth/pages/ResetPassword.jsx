import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setError("Token de recuperación inválido o expirado");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar la contraseña.");
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
          <h2 className="text-3xl font-extrabold text-center text-base-content tracking-tight">Nueva Contraseña</h2>
          <p className="mt-3 text-center text-sm text-base-content/60 px-4">
            Crea una contraseña segura para tu cuenta.
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {message && (
              <div className="alert alert-success shadow-lg border-none bg-success/20 text-success py-3 px-4 rounded-xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{message}. Redirigiendo...</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error shadow-lg border-none bg-error/20 text-error py-3 px-4 rounded-xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Nueva contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full bg-base-200/50 border-white/10 focus:border-primary transition-all duration-300 rounded-xl"
                required
                minLength={6}
              />
            </div>

            <div className="form-control text-center mx-auto">
              <label className="label pb-2">
                <span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Confirmar contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full bg-base-200/50 border-white/10 focus:border-primary transition-all duration-300 rounded-xl"
                required
                minLength={6}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full h-12 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Actualizar Contraseña"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
