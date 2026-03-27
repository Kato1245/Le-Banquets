// src/features/auth/pages/Login.jsx
import LoginForm from "../components/LoginForm.jsx"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-105 transition-transform duration-[20s] hover:scale-100"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-base-100/90 backdrop-blur-xl p-10 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/20 animate-in fade-in zoom-in duration-500">
        <div className="sm:mx-auto sm:w-full mb-8">
          <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <h1 className="text-4xl font-extrabold text-center text-primary tracking-tight mb-2">Bienvenido</h1>
          <p className="text-center text-base text-base-content/60 font-medium">
            Tu puerta de entrada a celebraciones inolvidables.
          </p>
        </div>

        <div className="mt-2">
          <LoginForm />
        </div>

        <div className="mt-8 pt-8 border-t border-base-content/10 text-center">
          <p className="text-sm opacity-50 font-medium">
            © {new Date().getFullYear()} Le Banquets Group
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;
