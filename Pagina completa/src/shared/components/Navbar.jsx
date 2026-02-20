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
            <>
              <span className="text-sm opacity-70 mr-2">
                Hola, {user?.nombre}
              </span>

              <button
                onClick={logout}
                className="btn btn-error"
              >
                Cerrar sesión
              </button>
            </>
          )}

        </div>
      </div>

      {/* Línea elegante inferior */}
      <div className="h-[1px] bg-primary/20"></div>

    </div>
  );
};

export default Navbar;