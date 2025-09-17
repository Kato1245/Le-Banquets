// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const result = await resetPassword(email);

    if (result.success) {
      setMessage(result.message);
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
          <h2 className="text-3xl font-bold text-center text-base-content">Recuperar Contraseña</h2>
          <p className="mt-2 text-center text-sm text-base-content/60">
            Ingresa tu email para recibir un enlace de recuperación
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
                <span className="label-text font-semibold">Correo electrónico</span>
              </label>
              <input
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
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
                  "Enviar enlace de recuperación"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              <Link to="/login" className="link link-hover text-primary font-semibold">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;