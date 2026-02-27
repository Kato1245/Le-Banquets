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
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        setIsLoading(true)
        setLoginError("")

        try {
            // Pasamos un objeto con las credenciales, tal como espera AuthContext.login
            await login({
                email: data.email,
                password: data.password
            });
            
            // Si el login tiene éxito (no arroja error), redirigimos
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

            <div className="form-control">
                <label className="label py-1 flex justify-between">
                    <span className="label-text font-bold text-base-content/80">Contraseña</span>
                    <Link to="/forgot-password" size="xs" className="text-xs text-primary hover:underline font-bold">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </label>
                <input
                    {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                    })}
                    type="password"
                    placeholder="••••••••"
                    className={`input input-bordered focus:input-primary w-full rounded-xl transition-all ${errors.password ? 'input-error' : ''}`}
                />
                {errors.password && <p className="text-error mt-1.5 text-xs font-medium pl-1">{errors.password.message}</p>}
            </div>

            <div className="form-control mt-4">
                <button
                    className={`btn btn-primary w-full rounded-xl text-lg font-bold normal-case shadow-lg hover:scale-[1.02] active:scale-95 transition-all ${isLoading ? 'loading' : ''}`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Ingresando..." : "Entrar Ahora"}
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
