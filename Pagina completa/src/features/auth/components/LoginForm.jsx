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

        const result = await login(data.email, data.password)

        if (result.success) {
            reset()
            navigate('/')
        } else {
            setLoginError(result.message || "Error al iniciar sesión")
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-200 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-primary">Bienvenido a Le Banquets</h2>

            {loginError && (
                <div className="alert alert-error">
                    <span>{loginError}</span>
                </div>
            )}

            <div className="form-control">
                <label className="label">
                    <span className="label-text font-semibold">Correo electrónico</span>
                </label>
                <input
                    {...register("email", {
                        required: "Este campo es requerido",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "El correo no es válido"
                        }
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
                        minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                    })}
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    autoComplete="current-password"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.password && <p className="text-error mt-2 text-sm">{errors.password.message}</p>}
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
                        "Iniciar Sesión"
                    )}
                </button>
            </div>

            <div className="text-center">
                <p className="text-sm">
                    <Link to="/forgot-password" className="link link-hover text-primary font-semibold">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </p>
            </div>

            <div className="text-center">
                <p className="text-sm">¿No tienes una cuenta? <Link to="/registro" className="link link-hover text-primary font-semibold">Regístrate aquí</Link></p>
            </div>
        </form>
    )
}

export default LoginForm
