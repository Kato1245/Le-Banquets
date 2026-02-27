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
  "6LcLn78rAAAAAJvmvgAp8EuDFhKhVlNpnbWA3bHY";

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
      navigate("/login");
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
          className="input input-bordered focus:input-primary w-full"
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
          className="input input-bordered focus:input-primary w-full"
        />
        {errors.email && (
          <p className="text-error mt-2 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Contraseña</span>
        </label>
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
          type="password"
          placeholder="••••••••"
          name="password"
          autoComplete="new-password"
          className="input input-bordered focus:input-primary w-full"
        />
        {errors.password && (
          <p className="text-error mt-2 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Confirmar contraseña</span>
        </label>
        <input
          {...register("confirmPassword", {
            required: "Este campo es requerido",
            validate: (value) =>
              value === passwordRef.current || "Las contraseñas no coinciden",
          })}
          type="password"
          placeholder="••••••••"
          name="confirmPassword"
          autoComplete="new-password"
          className="input input-bordered focus:input-primary w-full"
        />
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
