import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useState, useEffect } from "react"

const LoginForm = () => {
    const { register, handleSubmit, formState: {errors}, reset } = useForm({mode: "onChange"})
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loginError, setLoginError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [attemptsLeft, setAttemptsLeft] = useState(null)
    const [isLocked, setIsLocked] = useState(false)
    const [remainingTime, setRemainingTime] = useState(null)

    const onSubmit = async (data) => {
        setIsLoading(true)
        setLoginError("")
        setAttemptsLeft(null)
        setIsLocked(false)
        setRemainingTime(null)
        
        const result = await login(data.email, data.password)
        
        if (result.success) {
            reset()
            navigate('/')
        } else {
            setLoginError(result.message)
            
            // Manejar intentos fallidos
            if (result.attemptsLeft !== undefined) {
                setAttemptsLeft(result.attemptsLeft)
            }
            
            // Manejar bloqueo
            if (result.locked) {
                setIsLocked(true)
                if (result.remainingTime) {
                    setRemainingTime(result.remainingTime)
                    
                    // Iniciar cuenta regresiva
                    const interval = setInterval(() => {
                        setRemainingTime(prev => {
                            if (prev <= 1) {
                                clearInterval(interval)
                                setIsLocked(false)
                                return null
                            }
                            return prev - 1
                        })
                    }, 60000) // Actualizar cada minuto
                }
            }
        }
        
        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-200 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-primary">Bienvenido a Le Banquets</h2>
            
            {/* Mensaje de error general */}
            {loginError && !isLocked && !attemptsLeft && (
                <div className="alert alert-error">
                    <span>{loginError}</span>
                </div>
            )}

            {/* Mensaje de bloqueo */}
            {isLocked && (
                <div className="alert alert-warning">
                    <div className="flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <label>
                            <span className="font-bold">Acceso temporalmente bloqueado</span>
                            <p className="text-sm">{loginError}</p>
                            {remainingTime && (
                                <p className="text-sm mt-1">
                                    Tiempo restante: {remainingTime} minuto{remainingTime !== 1 ? 's' : ''}
                                </p>
                            )}
                        </label>
                    </div>
                </div>
            )}

            {/* Intentos restantes */}
            {attemptsLeft !== null && attemptsLeft > 0 && (
                <div className="alert alert-info">
                    <div className="flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <label>
                            <span className="font-bold">Intentos restantes: {attemptsLeft}</span>
                            <p className="text-sm">Después de 3 intentos fallidos, su IP será bloqueada temporalmente.</p>
                        </label>
                    </div>
                </div>
            )}

            {/* Campos del formulario */}
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
                    disabled={isLocked || isLoading}
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
                        minLength: {value: 6, message: "La contraseña debe tener al menos 6 caracteres"}
                    })}
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    autoComplete="current-password"
                    className="input input-bordered focus:input-primary w-full"
                    disabled={isLocked || isLoading}
                />
                {errors.password && <p className="text-error mt-2 text-sm">{errors.password.message}</p>}
            </div>
            
            <div className="form-control mt-2">
                <button 
                    className="btn bg-base-100 border-primary text-primary hover:bg-primary hover:text-base-100 hover:border-primary transition-all duration-300 text-lg font-normal normal-case"
                    type="submit"
                    disabled={isLoading || isLocked}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : isLocked ? (
                        "⏳ Cuenta Bloqueada"
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
            </div>

            <div className="text-center">
                <p className="text-sm"><Link to="/" className="link link-hover text-primary font-semibold">¿Olvidaste tu contraseña?</Link></p>
            </div>
            
            <div className="text-center">
                <p className="text-sm">¿No tienes una cuenta? <Link to="/registro" className="link link-hover text-primary font-semibold">Regístrate aquí</Link></p>
            </div>
        </form>
    )
}

export default LoginForm