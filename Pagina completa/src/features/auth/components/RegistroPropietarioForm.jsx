// src/features/auth/components/RegistroPropietarioForm.jsx
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "../../../context/AuthContext"

const RegistroPropietarioForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ mode: "onChange" });
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const password = useRef({});
    password.current = watch("password", "");

    const [captchaValue, setCaptchaValue] = useState(null);
    const [captchaError, setCaptchaError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const RECAPTCHA_SITE_KEY = "6LcLn78rAAAAAJvmvgAp8EuDFhKhVlNpnbWA3bHY";

    const onSubmit = async (data) => {
        if (!captchaValue) {
            setCaptchaError("Por favor, verifica que no eres un robot");
            return;
        }
        setIsLoading(true);
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
            alert(result.message || '✅ Registro exitoso. Por favor verifica tu email antes de iniciar sesión.');
            navigate('/login');
        } else {
            alert(result.message || 'Error en el registro');
        }
        setIsLoading(false);
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        if (captchaError) setCaptchaError("");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-200 rounded-2xl shadow-lg">

            <h2 className="text-2xl font-bold text-center text-primary">Registro de Propietario</h2>
            <p className="text-center text-sm text-gray-600">Regístrate como propietario para administrar tu empresa o banquete</p>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Nombre Completo *</span></label>
                <input
                    {...register("nombre", { required: "Este campo es requerido" })}
                    className="input input-bordered focus:input-primary w-full"
                    placeholder="Tu nombre completo" type="text"
                />
                {errors.nombre && <p className="text-error mt-2 text-sm">{errors.nombre.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Correo electrónico *</span></label>
                <input
                    {...register("email", {
                        required: "Este campo es requerido",
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "El correo no es válido" }
                    })}
                    placeholder="propietario@ejemplo.com"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.email && <p className="text-error mt-2 text-sm">{errors.email.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">RUT o Identificación Fiscal *</span></label>
                <input
                    {...register("rut", { required: "Este campo es requerido" })}
                    placeholder="RUT o identificación fiscal"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.rut && <p className="text-error mt-2 text-sm">{errors.rut.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Documento de Identidad *</span></label>
                <input
                    {...register("documento", { required: "Este campo es requerido" })}
                    placeholder="Número de documento"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.documento && <p className="text-error mt-2 text-sm">{errors.documento.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Teléfono de Contacto</span></label>
                <input
                    {...register("telefono")}
                    placeholder="Número de teléfono"
                    className="input input-bordered focus:input-primary w-full"
                />
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Contraseña *</span></label>
                <input
                    {...register("password", {
                        required: "Este campo es requerido",
                        minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                    })}
                    type="password" placeholder="••••••••"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.password && <p className="text-error mt-2 text-sm">{errors.password.message}</p>}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Confirmar Contraseña *</span></label>
                <input
                    {...register("confirmPassword", {
                        required: "Este campo es requerido",
                        validate: (value) => value === password.current || "Las contraseñas no coinciden"
                    })}
                    type="password" placeholder="••••••••"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.confirmPassword && <p className="text-error mt-2 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <div className="form-control">
                <div className="flex justify-center">
                    <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
                </div>
                {captchaError && <p className="text-error mt-2 text-sm text-center">{captchaError}</p>}
            </div>

            <div className="form-control mt-2">
                <button
                    className="btn bg-base-100 border-primary text-primary hover:bg-primary hover:text-base-100 hover:border-primary transition-all duration-300 text-lg font-normal normal-case"
                    type="submit" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner"></span> : "Registrar como Propietario"}
                </button>
            </div>

            <div className="text-center mt-2">
                <p className="text-sm">¿Ya tienes una cuenta? <Link to="/login" className="link link-hover text-primary font-semibold">Inicia sesión</Link></p>
                <p className="text-sm mt-1">¿Eres usuario individual? <Link to="/registro" className="link link-hover text-secondary font-semibold">Regístrate aquí</Link></p>
            </div>
        </form>
    )
}

export default RegistroPropietarioForm
