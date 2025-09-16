// src/Components/Navbar/navbar.jsx
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 md:px-8">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-primary">Le Banquets</Link>
      </div>
      
      {/* Elementos centrados */}
      <div className="flex-none hidden md:flex justify-center">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/eventos" className="font-medium">Eventos</Link></li>
          <li><Link to="/salones" className="font-medium">Salones</Link></li>
          <li><Link to="/catering" className="font-medium">Catering</Link></li>
        </ul>
      </div>
      
      {user ? (
        // Navbar cuando el usuario está autenticado
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
              <li className="menu-title">
                <span>Hola, {user?.nombre || user?.username}</span>
              </li>
              <li><Link to="/perfil" className="justify-between">
                Perfil
                <span className="badge badge-primary badge-sm">Nuevo</span>
              </Link></li>
              <li><Link to="/mis-eventos">Mis Eventos</Link></li>
              <li><Link to="/configuracion">Configuración</Link></li>
              <li><hr className="my-1" /></li>
              <li><button onClick={handleLogout} className="text-error">Cerrar Sesión</button></li>
            </ul>
          </div>
        </div>
      ) : (
        // Navbar cuando el usuario no está autenticado
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link to="/login" className="btn btn-ghost">Iniciar Sesión</Link>
            </li>
            <li>
              <Link to="/registro" className="btn btn-primary">Registro</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar