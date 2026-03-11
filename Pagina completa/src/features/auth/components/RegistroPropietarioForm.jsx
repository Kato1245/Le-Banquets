// src/features/auth/components/RegistroPropietarioForm.jsx
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "../../../context/AuthContext"
import toast from "react-hot-toast"

const RegistroPropietarioForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ mode: "onChange" });
    const { register: signUp } = useAuth(); // Usando el método register del AuthContext unificado
    const navigate = useNavigate();
    const password = useRef({});
    password.current = watch("password", "");

    const [captchaValue, setCaptchaValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Nota: El SITE_KEY debería venir de env variables en producción
    const RECAPTCHA_SITE_KEY = "6LcLn78rAAAAAJvmvgAp8EuDFhKhVlNpnbWA3bHY";

    const onSubmit = async (data) => {
        if (!captchaValue) {
            toast.error("Por favor, verifica que no eres un robot");
            return;
        }
        setIsLoading(true);

        try {
            await signUp('propietario', {
                nombre: data.nombre,
                email: data.email,
                contrasena: data.password,
                documento: data.documento,
                telefono: data.telefono,
                rut: data.rut
            });

            toast.success('✅ Registro exitoso. ¡Bienvenido a la red de propietarios!');
            reset();
            setCaptchaValue(null);
            navigate('/mis-banquetes');
        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error.message || 'Error en el registro');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const inputClasses = "input input-bordered focus:input-primary w-full rounded-xl transition-all font-medium transition-all bg-base-100/50 backdrop-blur-sm";
    const labelClasses = "label-text font-bold opacity-70 mb-1 block pl-1";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-4">
                {/* Nombre */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>Nombre Completo *</span></label>
                    <input
                        {...register("nombre", { required: "Este campo es requerido" })}
                        className={inputClasses}
                        placeholder="Ej. Luis Ramírez" type="text"
                    />
                    {errors.nombre && <p className="text-error mt-1 text-xs font-bold">{errors.nombre.message}</p>}
                </div>

                {/* Email */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>Correo Corporativo *</span></label>
                    <input
                        {...register("email", {
                            required: "Este campo es requerido",
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "El correo no es válido" }
                        })}
                        placeholder="empresa@ejemplo.com"
                        className={inputClasses}
                        type="email"
                    />
                    {errors.email && <p className="text-error mt-1 text-xs font-bold">{errors.email.message}</p>}
                </div>

                {/* RUT */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>RUT / NIT Empresa *</span></label>
                    <input
                        {...register("rut", { required: "Este campo es requerido" })}
                        placeholder="Identificación fiscal"
                        className={inputClasses}
                    />
                    {errors.rut && <p className="text-error mt-1 text-xs font-bold">{errors.rut.message}</p>}
                </div>

                {/* Documento */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>Documento Representante *</span></label>
                    <input
                        {...register("documento", { required: "Este campo es requerido" })}
                        placeholder="Cédula o pasaporte"
                        className={inputClasses}
                    />
                    {errors.documento && <p className="text-error mt-1 text-xs font-bold">{errors.documento.message}</p>}
                </div>

                {/* Teléfono */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>Teléfono de Contacto</span></label>
                    <input
                        {...register("telefono")}
                        placeholder="+57 300 000 0000"
                        className={inputClasses}
                    />
                </div>

                {/* Contraseña */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>Contraseña Segura *</span></label>
                    <input
                        {...register("password", {
                            required: "Este campo es requerido",
                            minLength: { value: 6, message: "Mínimo 6 caracteres" }
                        })}
                        type="password" placeholder="••••••••"
                        className={inputClasses}
                    />
                    {errors.password && <p className="text-error mt-1 text-xs font-bold">{errors.password.message}</p>}
                </div>

                {/* Confirmar Password */}
                <div className="form-control">
                    <label className="label py-1"><span className={labelClasses}>Confirmar Contraseña *</span></label>
                    <input
                        {...register("confirmPassword", {
                            required: "Verifica tu contraseña",
                            validate: (value) => value === password.current || "Las contraseñas no coinciden"
                        })}
                        type="password" placeholder="••••••••"
                        className={inputClasses}
                    />
                    {errors.confirmPassword && <p className="text-error mt-1 text-xs font-bold">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            {/* Captcha */}
            <div className="form-control pt-2">
                <div className="flex justify-center bg-base-300/30 p-4 rounded-2xl border border-base-content/5 scale-90 sm:scale-100">
                    <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} theme="light" />
                </div>
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
                <button
                    className="btn btn-primary w-full rounded-2xl shadow-xl normal-case font-extrabold text-lg py-3 h-auto"
                    type="submit" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner"></span> : "Finalizar Registro de Propietario"}
                </button>
            </div>
        </form>
    )
}

export default RegistroPropietarioForm;
