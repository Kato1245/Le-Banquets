import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext" // Ruta corregida

const LoginForm = () => {
    const { register, handleSubmit, formState: {errors}, reset } = useForm({mode: "onChange"})
    const { login } = useAuth()
    const navigate = useNavigate()
    
    const onSubmit = (data) => {
        console.log(data)
        // Simulamos un login exitoso
        login({
            id: 1,
            username: data.email.split('@')[0],
            email: data.email
        })
        reset()
        navigate('/')
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6 max-w-md mx-auto p-8 bg-base-200 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-primary">Bienvenido a Le Banquets</h2>
            
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
                    autoComplete="current-password"
                    className="input input-bordered focus:input-primary w-full"
                />
                {errors.password && <p className="text-error mt-2 text-sm">{errors.password.message}</p>}
            </div>
            
            <div className="form-control mt-2">
                <button className="btn bg-base-100 border-primary text-primary hover:bg-primary hover:text-base-100 hover:border-primary transition-all duration-300 text-lg font-normal normal-case" type="submit">Iniciar Sesión</button>
            </div>

            <div className="text-center mt">
                <p className="text-sm"><Link to="/" className="link link-hover text-primary font-semibold">¿Olvidaste tu contraseña? </Link></p>
            </div>
            
            <div className="text-center mt">
                <p className="text-sm">¿No tienes una cuenta? <Link to="/registro" className="link link-hover text-primary font-semibold">Regístrate aquí</Link></p>
            </div>
        </form>
    )
}

export default LoginForm