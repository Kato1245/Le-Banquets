// src/features/auth/pages/ResetPassword.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!code || code.length !== 6) {
      toast.error("El código debe ser de 6 dígitos");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(email, code, newPassword);
      if (result.success) {
        toast.success("Contraseña actualizada con éxito");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      // El error ya lo maneja el AuthContext con un toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-base-100 relative overflow-hidden">
      {/* Background igual que ForgotPassword */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/50 to-black/90"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-base-100/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Restablecer Clave</h2>
            <p className="text-sm text-base-content/60 font-medium px-4">
              Ingresa el código de 6 dígitos enviado a tu correo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold opacity-70">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full rounded-2xl focus:input-primary transition-all font-medium"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold opacity-70">Código de 6 dígitos</span>
              </label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="input input-bordered w-full rounded-2xl focus:input-primary transition-all font-medium text-center tracking-[0.5em] text-xl"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold opacity-70">Nueva Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full rounded-2xl focus:input-primary transition-all font-medium"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold opacity-70">Confirmar Contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full rounded-2xl focus:input-primary transition-all font-medium"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-2xl shadow-lg normal-case font-extrabold text-lg py-3 h-auto mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Actualizar Contraseña"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link to="/login" className="btn btn-ghost btn-sm rounded-xl normal-case font-bold text-primary hover:bg-primary/10">
              ← Cancelar y volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
