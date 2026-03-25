// src/features/auth/components/LoginForm.jsx
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { useState } from "react"

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onChange" })
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        setIsLoading(true)
        setLoginError("")

        try {
            await login({
                email: data.email,
                password: data.password
            });

            reset();
            navigate('/');
        } catch (err) {
            setLoginError(err.friendlyMessage || "Credenciales inválidas o error de conexión");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-5">
            {loginError && (
                <div className="alert alert-error shadow-sm rounded-xl py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-sm font-medium">{loginError}</span>
                </div>
            )}

            <div className="form-control">
                <label className="label py-1">
                    <span className="label-text font-bold text-base-content/80">Correo Electrónico</span>
                </label>
                <input
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Ingresa un email válido"
                        }
                    })}
                    placeholder="ejemplo@correo.com"
                    className={`input input-bordered focus:input-primary w-full rounded-xl transition-all ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <p className="text-error mt-1.5 text-xs font-medium pl-1">{errors.email.message}</p>}
            </div>

            <div className="form-control relative">
                <label className="label py-1 flex justify-between">
                    <span className="label-text font-bold text-base-content/80">Contraseña</span>
                    <Link to="/forgot-password" size="xs" className="text-xs text-primary hover:underline font-bold">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </label>
                <div className="relative">
                    <input
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: { value: 6, message: "Mínimo 6 caracteres" }
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`input input-bordered focus:input-primary w-full rounded-xl transition-all pr-12 ${errors.password ? 'input-error' : ''}`}
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
                {errors.password && <p className="text-error mt-1.5 text-xs font-medium pl-1">{errors.password.message}</p>}
            </div>

            <div className="form-control mt-4">
                <button
                    className={`btn btn-primary w-full rounded-xl text-lg font-bold normal-case shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm opacity-50"></span>
                            <span>Ingresando...</span>
                        </>
                    ) : (
                        "Entrar Ahora"
                    )}
                </button>
            </div>

            <div className="text-center mt-6">
                <p className="text-sm text-base-content/60">
                    ¿No tienes una cuenta? <Link to="/registro" className="text-primary font-bold hover:underline">Regístrate gratis</Link>
                </p>
            </div>
        </form>
    )
}

export default LoginForm
