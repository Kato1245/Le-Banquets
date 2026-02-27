// src/features/auth/components/RegistroPropietarioForm.jsx
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

// La clave del sitio debe definirse en .env como VITE_RECAPTCHA_KEY
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_KEY || "6LcLn78rAAAAAJvmvgAp8EuDFhKhVlNpnbWA3bHY";

const RegistroPropietarioForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ mode: "onChange" });
    const { signUp } = useAuth();
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
            const result = await signUp(data.email, data.password, {
                nombre: data.nombre,
                documento: data.documento,
                telefono: data.telefono,
                rut: data.rut
            }, 'propietario');

            if (result.success) {
                reset();
                setCaptchaValue(null);
                setCaptchaError("");
                toast.success('Registro exitoso. Por favor verifica tu email antes de iniciar sesión.');
                navigate('/login');
            } else {
                toast.error(result.message || 'Error en el registro');
            }
        } catch (err) {
            toast.error("Ocurrió un error inesperado durante el registro");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        if (captchaError) setCaptchaError("");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-100/50 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10">

            <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Nombre Completo *</span></label>
                <input
                    {...register("nombre", { required: "Este campo es requerido" })}
                    className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                    placeholder="Tu nombre completo" type="text"
                />
                {errors.nombre && <p className="text-error mt-2 text-sm font-medium">{errors.nombre.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Correo electrónico corporativo *</span></label>
                <input
                    {...register("email", {
                        required: "Este campo es requerido",
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "El correo no es válido" }
                    })}
                    placeholder="propietario@ejemplo.com"
                    className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                />
                {errors.email && <p className="text-error mt-2 text-sm font-medium">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">NIT / RUT *</span></label>
                    <input
                        {...register("rut", { required: "Este campo es requerido" })}
                        placeholder="Identificación fiscal"
                        className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                    />
                    {errors.rut && <p className="text-error mt-2 text-sm font-medium">{errors.rut.message}</p>}
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Documento ID *</span></label>
                    <input
                        {...register("documento", { required: "Este campo es requerido" })}
                        placeholder="Número de documento"
                        className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                    />
                    {errors.documento && <p className="text-error mt-2 text-sm font-medium">{errors.documento.message}</p>}
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Teléfono de Contacto</span></label>
                <input
                    {...register("telefono")}
                    placeholder="Número de teléfono"
                    className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                />
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Contraseña *</span></label>
                <input
                    {...register("password", {
                        required: "Este campo es requerido",
                        minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                    })}
                    type="password" placeholder="••••••••"
                    className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                />
                {errors.password && <p className="text-error mt-2 text-sm font-medium">{errors.password.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-bold text-xs uppercase tracking-widest opacity-60">Confirmar Contraseña *</span></label>
                <input
                    {...register("confirmPassword", {
                        required: "Este campo es requerido",
                        validate: (value) => value === passwordRef.current || "Las contraseñas no coinciden"
                    })}
                    type="password" placeholder="••••••••"
                    className="input input-bordered focus:border-primary w-full bg-base-200/50 rounded-xl transition-all"
                />
                {errors.confirmPassword && <p className="text-error mt-2 text-sm font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div className="form-control">
                <div className="flex justify-center scale-90 sm:scale-100">
                    <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
                </div>
                {captchaError && <p className="text-error mt-2 text-sm text-center font-medium">{captchaError}</p>}
            </div>

            <div className="form-control mt-4">
                <button
                    className="btn btn-primary w-full h-12 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 font-bold rounded-xl"
                    type="submit" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner"></span> : "Registrar como Propietario"}
                </button>
            </div>

            <div className="text-center space-y-2 mt-2">
                <p className="text-sm opacity-60">¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:underline font-bold">Inicia sesión</Link></p>
                <p className="text-sm opacity-60">¿Eres usuario individual? <Link to="/registro" className="text-secondary hover:underline font-bold">Regístrate aquí</Link></p>
            </div>
        </form>
    );
};

export default RegistroPropietarioForm;
