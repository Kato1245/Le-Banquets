// src/pages/Catering.jsx
const Catering = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Catering</h1>
        <p className="text-lg mb-8">Próximamente: Nuestros servicios gastronómicos</p>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(item => (
              <div key={item} className="card bg-base-200 w-56 h-56 shadow-xl">
                <div className="card-body flex items-center justify-center">
                  <div className="skeleton h-24 w-24 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catering