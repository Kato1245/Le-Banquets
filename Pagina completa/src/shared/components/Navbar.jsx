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
// src/shared/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    // Unificamos la lectura de datos del usuario
    // La estructura del user viene del login: { id, nombre, email, userType, isAdmin, ... }
    const userName = user?.nombre || user?.email || 'Usuario';
    const userInitial = userName.charAt(0).toUpperCase();
    const isAdmin = !!user?.isAdmin;
    const isPropietario = user?.userType === 'propietario';

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 md:px-8">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl text-primary">
                    Le Banquets
                </Link>
            </div>

            {/* Navegación central */}
            <div className="flex-none hidden md:flex justify-center items-center">
                <ul className="menu menu-horizontal px-1 gap-2 items-center">
                    <li>
                        <Link to="/banquetes" className="font-medium text-lg">
                            Banquetes
                        </Link>
                    </li>
                    {isAdmin && (
                        <li>
                            <Link to="/admin" className="font-medium text-lg text-warning">
                                Admin
                            </Link>
                        </li>
                    )}
                    {isPropietario && !isAdmin && (
                        <li>
                            <Link to="/mis-banquetes" className="font-medium text-lg text-info">
                                Mi Empresa
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            {user ? (
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                {userInitial}
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                            <li className="menu-title">
                                <span>Hola, {userName}</span>
                                {isAdmin && (
                                    <span className="badge badge-warning badge-sm">Admin</span>
                                )}
                                {isPropietario && !isAdmin && (
                                    <span className="badge badge-info badge-sm">Propietario</span>
                                )}
                            </li>
                            <li><Link to="/perfil">Mi Perfil</Link></li>
                            <li><Link to="/mis-eventos">Mis Eventos</Link></li>
                            {isPropietario && (
                                <li><Link to="/mis-banquetes">Mis Banquetes</Link></li>
                            )}
                            <li><Link to="/configuracion">Configuración</Link></li>
                            {isAdmin && (
                                <li>
                                    <Link to="/admin" className="text-warning">Panel Admin</Link>
                                </li>
                            )}
                            <li><hr className="my-1" /></li>
                            <li>
                                <button onClick={logout} className="text-error">
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1 gap-2 items-center">
                        <li>
                            <Link to="/login" className="btn btn-ghost text-lg">Iniciar Sesión</Link>
                        </li>
                        <li>
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-primary text-lg">Registro</label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                                    <li><Link to="/registro">Usuario Individual</Link></li>
                                    <li><Link to="/registro-propietario">Propietario</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
