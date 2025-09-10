// src/pages/MisEventos.jsx
const MisEventos = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Mis Eventos</h1>
        <p className="text-lg mb-8">Próximamente: Gestiona todos tus eventos en un solo lugar</p>
        <div className="animate-pulse">
          <div className="card bg-base-200 w-96 h-64 shadow-xl">
            <div className="card-body flex items-center justify-center">
              <div className="skeleton h-32 w-32 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MisEventos