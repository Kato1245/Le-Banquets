// src/features/auth/components/RegistroPropietarioForm.jsx
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

// Lee la variable desde Vercel (o usa el fallback local)
const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_KEY ||
  "6LdUEaosAAAAAF1EmVRsI5ArwlBmzAwEA9bXwatp";

const RegistroPropietarioForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ mode: "onChange" });
  const { register: signUp } = useAuth(); // Usando el método register del AuthContext unificado
  const navigate = useNavigate();
  const password = useRef({});
  password.current = watch("password", "");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!captchaValue) {
      toast.error("Por favor, verifica que no eres un robot");
      return;
    }
    setIsLoading(true);

    try {
      await signUp("propietario", {
        nombre: data.nombre,
        email: data.email,
        contrasena: data.password,
        documento: data.documento,
        telefono: data.telefono,
        rut: data.rut,
      });

      toast.success(
        "✅ Registro exitoso. ¡Bienvenido a la red de propietarios!",
      );
      reset();
      setCaptchaValue(null);
      navigate("/mis-banquetes");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const inputClasses =
    "input input-bordered focus:input-primary w-full rounded-xl transition-all font-medium transition-all bg-base-100/50 backdrop-blur-sm";
  const labelClasses = "label-text font-bold opacity-70 mb-1 block pl-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Nombre */}
        <div className="form-control">
          <label className="label py-1">
            <span className={labelClasses}>Nombre Completo *</span>
          </label>
          <input
            {...register("nombre", { required: "Este campo es requerido" })}
            className={inputClasses}
            placeholder="Ej. Luis Ramírez"
            type="text"
          />
          {errors.nombre && (
            <p className="text-error mt-1 text-xs font-bold">
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label py-1">
            <span className={labelClasses}>Correo Corporativo *</span>
          </label>
          <input
            {...register("email", {
              required: "Este campo es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "El correo no es válido",
              },
            })}
            placeholder="empresa@ejemplo.com"
            className={inputClasses}
            type="email"
          />
          {errors.email && (
            <p className="text-error mt-1 text-xs font-bold">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* RUT */}
        <div className="form-control">
          <label className="label py-1">
            <span className={labelClasses}>RUT / NIT Empresa *</span>
          </label>
          <input
            {...register("rut", { required: "Este campo es requerido" })}
            placeholder="Identificación fiscal"
            className={inputClasses}
          />
          {errors.rut && (
            <p className="text-error mt-1 text-xs font-bold">
              {errors.rut.message}
            </p>
          )}
        </div>

        {/* Documento */}
        <div className="form-control">
          <label className="label py-1">
            <span className={labelClasses}>Documento Representante *</span>
          </label>
          <input
            {...register("documento", { required: "Este campo es requerido" })}
            placeholder="Cédula o pasaporte"
            className={inputClasses}
          />
          {errors.documento && (
            <p className="text-error mt-1 text-xs font-bold">
              {errors.documento.message}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div className="form-control">
          <label className="label py-1">
            <span className={labelClasses}>Teléfono de Contacto</span>
          </label>
          <input
            {...register("telefono")}
            placeholder="+57 300 000 0000"
            className={inputClasses}
          />
        </div>

        <div className="hidden md:block"></div>

        {/* Contraseña */}
        <div className="form-control relative">
          <label className="label py-1">
            <span className={labelClasses}>Contraseña Segura *</span>
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Este campo es requerido",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`${inputClasses} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.066-1.56a10.048 10.048 0 014.138-1.04c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-2.015 3.558m-4.633-4.633a3 3 0 00-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-error mt-1 text-xs font-bold">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirmar Password */}
        <div className="form-control relative">
          <label className="label py-1">
            <span className={labelClasses}>Confirmar Contraseña *</span>
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword", {
                required: "Verifica tu contraseña",
                validate: (value) =>
                  value === password.current || "Las contraseñas no coinciden",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`${inputClasses} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors focus:outline-none"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.066-1.56a10.048 10.048 0 014.138-1.04c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-2.015 3.558m-4.633-4.633a3 3 0 00-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-error mt-1 text-xs font-bold">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Captcha */}
      <div className="form-control pt-2">
        <div className="flex justify-center bg-base-300/30 p-4 rounded-2xl border border-base-content/5 scale-90 sm:scale-100">
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
            theme="light"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="form-control mt-4">
        <button
          className="btn btn-primary w-full rounded-2xl shadow-xl normal-case font-extrabold text-lg py-3 h-auto"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Finalizar Registro de Propietario"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistroPropietarioForm;
