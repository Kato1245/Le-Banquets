import LoginForm from "../components/LoginForm.jsx"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 bg-base-100/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="sm:mx-auto sm:w-full">
          <h1 className="text-4xl font-black text-center text-base-content tracking-tight">Iniciar Sesión</h1>
          <p className="mt-3 text-center text-sm text-base-content/60 px-4">
            Accede a tu cuenta para gestionar tus eventos y reservas de forma exclusiva.
          </p>
        </div>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login
