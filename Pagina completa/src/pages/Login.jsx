// Login.jsx - Con imagen de fondo corregida
import LoginForm from "../Components/Login/LoginForm.jsx"

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative">
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            
            <div className="relative z-10 bg-base-100 bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="sm:mx-auto sm:w-full">
                    <h1 className="text-4xl font-bold text-center text-base-content">Iniciar Sesión</h1>
                    <p className="mt-2 text-center text-sm text-base-content/60">
                        Accede a tu cuenta para gestionar tus eventos
                    </p>
                </div>
                <div className="mt-6">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login