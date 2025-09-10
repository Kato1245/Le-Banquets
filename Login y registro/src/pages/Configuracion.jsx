// src/pages/Configuracion.jsx
const Configuracion = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Configuración</h1>
        <p className="text-lg mb-8">Próximamente: Personaliza tu experiencia</p>
        <div className="animate-pulse">
          <div className="card bg-base-200 w-80 h-64 shadow-xl">
            <div className="card-body flex items-center justify-center">
              <div className="skeleton h-32 w-32 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Configuracion