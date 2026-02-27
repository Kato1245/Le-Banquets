// src/pages/ResetPassword.jsx
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

    const result = await resetPassword(token, newPassword);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="relative z-10 bg-base-100 bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="sm:mx-auto sm:w-full">
          <h2 className="text-3xl font-bold text-center text-base-content">Nueva Contraseña</h2>
          <p className="mt-2 text-center text-sm text-base-content/60">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className="alert alert-success">
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nueva contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirmar contraseña</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                minLength={6}
              />
            </div>

            <div className="form-control mt-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Actualizar contraseña"
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
// src/features/auth/pages/ResetPassword.jsx
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { updatePassword } = useAuth();
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

        const result = await updatePassword(token, newPassword);

        if (result.success) {
            setMessage(result.message);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } else {
            setError(result.message);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="relative z-10 bg-base-100 bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="sm:mx-auto sm:w-full">
                    <h2 className="text-3xl font-bold text-center text-base-content">Nueva Contraseña</h2>
                    <p className="mt-2 text-center text-sm text-base-content/60">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                <div className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && (
                            <div className="alert alert-success">
                                <span>{message}</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Nueva contraseña</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered w-full"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Confirmar contraseña</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input input-bordered w-full"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-control mt-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    "Actualizar contraseña"
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
