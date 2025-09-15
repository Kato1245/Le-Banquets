import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "../../context/AuthContext" // Ruta corregida

const RegistroForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ mode: "onChange" });
    const { login } = useAuth();
    const navigate = useNavigate();
    const password = useRef({});
    password.current = watch("password", "");

    const [captchaValue, setCaptchaValue] = useState(null);
    const [captchaError, setCaptchaError] = useState("");

    const RECAPTCHA_SITE_KEY = "6LcLn78rAAAAAJvmvgAp8EuDFhKhVlNpnbWA3bHY";

    const onSubmit = async (data) => {
    if (!captchaValue) {
        setCaptchaError("Por favor, verifica que no eres un robot");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/register/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: data.username,
                email: data.email,
                contrasena: data.password,
                // Agrega otros campos si son requeridos
                documento: "",
                telefono: "", 
                fecha_nacimiento: ""
            }),
        });

        const result = await response.json();

        if (result.success) {
            // Registro exitoso - ahora hacemos login automático
            const loginResponse = await login(data.email, data.password);
            
            if (loginResponse.success) {
                reset();
                setCaptchaValue(null);
                setCaptchaError("");
                navigate('/');
            } else {
                // Solo registro exitoso, redirigir a login
                reset();
                setCaptchaValue(null);
                setCaptchaError("");
                navigate('/login');
            }
        } else {
            // Mostrar error de registro
            console.error('Error en registro:', result.message);
            alert(result.message || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
};

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        if (captchaError) {
            setCaptchaError("");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} 
        className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-200 rounded-2xl shadow-lg">
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Nombre completo</span>
                </label>
                <input
                    {...register("username", 
                        {required: "Este campo es requerido", 
                        minLength: {value: 5, message: "El nombre debe tener al menos 5 caracteres"},
                        maxLength: {value: 30, message: "El nombre debe tener menos de 30 caracteres"}})}
                    className="input input-bordered focus:input-primary w-full"
                    autoComplete="username"
                    name="username"
                    placeholder="Tu nombre completo"
                    type="text"
                />
                {errors.username && <p className="text-error mt-2 text-sm">{errors.username.message}</p>}
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
                            message: "El correo no es valido"
                        },
                        minLength: {value: 5, message: "El correo debe tener al menos 5 caracteres"},
                        maxLength: {value: 30, message: "El correo debe tener menos de 30 caracteres"}
                    })}
                    placeholder="tu@ejemplo.com"
                    name="email"
                    autoComplete="email"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.email && <p className="text-error mt-2 text-sm">{errors.email.message}</p>}
            </div>
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Contraseña</span>
                </label>
                <input
                    {...register("password", {
                        required: "Este campo es requerido",
                        minLength: {value: 6, message: "La contraseña debe tener al menos 6 caracteres"},
                        maxLength: {value: 20, message: "La contraseña debe tener menos de 20 caracteres"}
                    })}
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    autoComplete="new-password"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.password && <p className="text-error mt-2 text-sm">{errors.password.message}</p>}
            </div>
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Confirmar contraseña</span>
                </label>
                <input
                    {...register("confirmPassword", {
                        required: "Este campo es requerido",
                        validate: (value) => value === password.current || "Las contraseñas no coinciden"
                    })}
                    type="password"
                    placeholder="••••••••"
                    name="confirmPassword"
                    autoComplete="new-password"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.confirmPassword && <p className="text-error mt-2 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <div className="form-control">
                <div className="flex justify-center">
                    <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                    />
                </div>
                {captchaError && <p className="text-error mt-2 text-sm text-center">{captchaError}</p>}
            </div>
            
            <div className="form-control mt-2">
                <button className="btn bg-base-100 border-primary text-primary hover:bg-primary hover:text-base-100 hover:border-primary transition-all duration-300 text-lg font-normal normal-case" type="submit">Registrarse</button>
            </div>
            
            <div className="text-center mt-2">
                <p className="text-sm">¿Ya tienes una cuenta? <Link to="/login" className="link link-hover text-primary font-semibold">Inicia sesión</Link></p>
            </div>
        </form>
    )
}
export default RegistroForm
