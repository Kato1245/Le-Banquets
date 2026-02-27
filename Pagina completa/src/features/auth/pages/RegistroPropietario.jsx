// src/pages/RegistroPropietario.jsx
// src/features/auth/pages/RegistroPropietario.jsx
import RegistroPropietarioForm from "../components/RegistroPropietarioForm.jsx"

const RegistroPropietario = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100 relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)"
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="relative z-10 bg-base-100 bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="sm:mx-auto sm:w-full">
                    <h2 className="text-4xl font-semibold text-center text-base-content">Registro de Propietario</h2>
                    <p className="mt-2 text-center text-sm text-base-content/60">
                        Crea tu cuenta para administrar tu empresa o banquete
                    </p>
                </div>
                <div className="mt-6">
                    <RegistroPropietarioForm />
                </div>
            </div>
        </div>
    )
}

export default RegistroPropietario
