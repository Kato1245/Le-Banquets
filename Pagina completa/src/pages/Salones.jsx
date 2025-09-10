// src/pages/Salones.jsx
const Salones = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Salones</h1>
        <p className="text-lg mb-8">Próximamente: Descubre nuestros espacios exclusivos</p>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(item => (
              <div key={item} className="card bg-base-200 w-80 h-64 shadow-xl">
                <div className="card-body flex items-center justify-center">
                  <div className="skeleton h-40 w-40 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Salones