import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-primary/10 transition-all duration-300">

      <div className="navbar max-w-7xl mx-auto px-8">

        {/* IZQUIERDA — Marca */}
        <div className="navbar-start">
          <Link
            to="/"
            className="text-2xl font-bold text-primary tracking-wide hover:opacity-80 transition"
          >
            Le-Banquets
          </Link>
        </div>

        {/* DERECHA — Navegación */}
        <div className="navbar-end gap-3">

          <Link
            to="/banquetes"
            className="btn btn-ghost hover:text-primary"
          >
            Banquetes
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="btn btn-ghost hover:text-primary"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/registro"
                className="btn btn-primary shadow-md"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <div className="w-10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-base-content/40">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-primary/10">
                <li className="menu-title px-4 py-2 border-b border-base-200">
                  <p className="font-bold text-base-content">{user.nombre}</p>
                  <p className="text-xs opacity-50 truncate">{user.email}</p>
                </li>
                <li><Link to="/perfil" className="py-3 flex justify-between">Mi Perfil <span className="badge badge-xs badge-primary"></span></Link></li>
                <li><Link to="/mis-reservas" className="py-3 opacity-50 pointer-events-none">Mis Reservas (Próximamente)</Link></li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={logout} className="text-error font-bold py-3 hover:bg-error/10">
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Línea elegante inferior */}
      <div className="h-[1px] bg-primary/20"></div>

    </div>
  );
};

export default Navbar;