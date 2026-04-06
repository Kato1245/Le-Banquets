// src/features/auth/components/RegistroForm.jsx
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

// La clave del sitio debe definirse en .env como VITE_RECAPTCHA_KEY
const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_KEY ||
  "6LdUEaosAAAAAF1EmVRsI5ArwlBmzAwEA9bXwatp";

const RegistroForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ mode: "onChange" });
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const passwordRef = useRef({});
  passwordRef.current = watch("password", "");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!captchaValue) {
      setCaptchaError("Por favor, verifica que no eres un robot");
      return;
    }
    setIsLoading(true);
    try {
      await signUp("usuario", {
        nombre: data.nombre,
        email: data.email,
        contrasena: data.password,
        documento: data.documento || null,
        telefono: data.telefono || null,
        fecha_nacimiento: data.fecha_nacimiento || null,
      });
      reset();
      setCaptchaValue(null);
      setCaptchaError("");
      navigate("/");
    } catch (error) {
      // El toast de error ya es manejado por AuthContext
      console.error("Error en registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    if (captchaError) setCaptchaError("");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-200 rounded-2xl shadow-lg"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Nombre completo</span>
        </label>
        <input
          {...register("nombre", {
            required: "Este campo es requerido",
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres",
            },
            maxLength: {
              value: 100,
              message: "El nombre debe tener menos de 100 caracteres",
            },
          })}
          className="input input-bordered focus:input-primary w-full shadow-sm"
          autoComplete="name"
          name="nombre"
          placeholder="Tu nombre completo"
          type="text"
        />
        {errors.nombre && (
          <p className="text-error mt-2 text-sm">{errors.nombre.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Correo electrónico</span>
        </label>
        <input
          {...register("email", {
            required: "Este campo es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "El correo no es válido",
            },
          })}
          placeholder="tu@ejemplo.com"
          name="email"
          autoComplete="email"
          className="input input-bordered focus:input-primary w-full shadow-sm"
        />
        {errors.email && (
          <p className="text-error mt-2 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Contraseña</span>
        </label>
        <div className="relative">
          <input
            {...register("password", {
              required: "Este campo es requerido",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La contraseña no puede exceder 100 caracteres",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            name="password"
            autoComplete="new-password"
            className="input input-bordered focus:input-primary w-full pr-12 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.066-1.56a10.048 10.048 0 014.138-1.04c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-2.015 3.558m-4.633-4.633a3 3 0 00-4.243-4.243m4.242 4.242L9.88 9.88" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-error mt-2 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Confirmar contraseña</span>
        </label>
        <div className="relative">
          <input
            {...register("confirmPassword", {
              required: "Este campo es requerido",
              validate: (value) =>
                value === passwordRef.current || "Las contraseñas no coinciden",
            })}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            name="confirmPassword"
            autoComplete="new-password"
            className="input input-bordered focus:input-primary w-full pr-12 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors focus:outline-none"
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.066-1.56a10.048 10.048 0 014.138-1.04c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-2.015 3.558m-4.633-4.633a3 3 0 00-4.243-4.243m4.242 4.242L9.88 9.88" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-error mt-2 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="form-control">
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        </div>
        {captchaError && (
          <p className="text-error mt-2 text-sm text-center">{captchaError}</p>
        )}
      </div>

      <div className="form-control mt-2">
        <button
          className="btn bg-base-100 border-primary text-primary hover:bg-primary hover:text-base-100 hover:border-primary transition-all duration-300 text-lg font-normal normal-case"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Registrarse"
          )}
        </button>
      </div>

      <div className="text-center mt-2">
        <p className="text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="link link-hover text-primary font-semibold"
          >
            Inicia sesión
          </Link>
        </p>
        <p className="text-sm mt-1">
          ¿Eres propietario?{" "}
          <Link
            to="/registro-propietario"
            className="link link-hover text-info font-semibold"
          >
            Registro para propietarios
          </Link>
        </p>
      </div>
    </form>
  );
};
export default RegistroForm;
