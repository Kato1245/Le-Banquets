import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  // Unificamos la lectura de datos del usuario
  const userName = user?.nombre || user?.email || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();
  const isAdmin = !!user?.isAdmin || user?.role === 'admin';
  const isPropietario = user?.userType === 'propietario' || user?.role === 'propietario';

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 md:px-8">
      <div className="flex-1 flex items-center gap-1 sm:gap-2">
        <Link to="/" className="btn btn-ghost text-xl text-primary font-bold px-2 sm:px-4 flex items-center gap-2">
          {!logoError ? (
            <img 
              src="/logo.png" 
              alt="Le Banquets" 
              className="logo-img h-14 md:h-20 w-auto object-contain transition-all" 
              onError={() => setLogoError(true)} 
            />
          ) : (
            <span>Le Banquets</span>
          )}
        </Link>
        <ThemeToggle />
      </div>

      {/* Navegación central */}
      <div className="flex-none hidden md:flex justify-center items-center">
        <ul className="menu menu-horizontal px-1 gap-2 items-center">
          <li>
            <Link to="/banquetes" className="font-medium">
              Banquetes
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="font-medium text-warning">
                Admin
              </Link>
            </li>
          )}
          {isPropietario && !isAdmin && (
            <li>
              <Link to="/mis-banquetes" className="font-medium text-info">
                Mi Empresa
              </Link>
            </li>
          )}
        </ul>
      </div>

      {user ? (
        <div className="flex-none gap-2 flex items-center">
          <NotificationBell />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold overflow-hidden shadow-inner">
                {user?.foto_perfil ? (
                  <img src={user.foto_perfil} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
              <li className="menu-title px-4 py-2 border-b border-base-200">
                <div className="font-bold">{userName}</div>
                {isAdmin && (
                  <span className="badge badge-warning badge-xs">Admin</span>
                )}
                {isPropietario && !isAdmin && (
                  <span className="badge badge-info badge-xs">Propietario</span>
                )}
              </li>
              <li className="mt-2 text-base-content/70"><Link to="/mis-eventos">Mis Eventos</Link></li>
              {isPropietario && (
                <li className="text-base-content/70"><Link to="/mis-banquetes">Mis Banquetes</Link></li>
              )}
              <li className="text-base-content/70"><Link to="/configuracion">Configuración</Link></li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-warning">Panel Admin</Link>
                </li>
              )}
              <li><hr className="my-1 opacity-10" /></li>
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
              <Link to="/login" className="btn btn-ghost">Iniciar Sesión</Link>
            </li>
            <li>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-primary">Registro</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4 z-50">
                  <li><Link to="/registro">Usuario Individual</Link></li>
                  <li><Link to="/registro-propietario">Propietario (Empresa)</Link></li>
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
