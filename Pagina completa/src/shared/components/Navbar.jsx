import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const isAdmin = user?.userType === 'admin' || user?.role === 'admin' || !!user?.isAdmin;
  const isPropietario = user?.userType === 'propietario' || user?.role === 'propietario';
  const userName = user?.nombre || user?.email?.split('@')[0] || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-primary/10 transition-all duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 md:px-8">

        {/* Brand */}
        <div className="navbar-start">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition flex items-center gap-2">
            <span className="hidden sm:inline">Le-Banquets</span>
            <span className="sm:hidden text-primary">LB</span>
          </Link>
        </div>

        {/* Center - Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link to="/banquetes" className="font-medium hover:text-primary transition-colors">
                Banquetes
              </Link>
            </li>
            {(isPropietario || isAdmin) && (
              <li>
                <Link to="/mis-banquetes" className="font-medium hover:text-primary transition-colors italic">
                  Gestión
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link to="/admin" className="font-medium text-warning hover:text-warning/80 transition-colors">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* End - User Actions */}
        <div className="navbar-end gap-2">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm md:btn-md hidden sm:flex">
                Entrar
              </Link>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-primary btn-sm md:btn-md shadow-lg shadow-primary/20">
                  Registrarse
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-primary/10">
                  <li><Link to="/registro" className="py-3">Usuario</Link></li>
                  <li><Link to="/registro-propietario" className="py-3">Propietario</Link></li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar bg-primary/10 ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                <div className="w-10 rounded-full flex items-center justify-center font-bold text-primary">
                  {userInitial}
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-64 border border-primary/10">
                <li className="px-4 py-3 border-b border-base-200 mb-2">
                  <p className="font-extrabold text-base truncate">{userName}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest">{user.userType || user.role || 'Usuario'}</p>
                </li>
                <li><Link to="/perfil" className="py-3 font-medium">Mi Perfil</Link></li>
                <li><Link to="/mis-eventos" className="py-3 font-medium">Mis Eventos</Link></li>
                {isPropietario && (
                  <li><Link to="/mis-banquetes" className="py-3 font-medium text-primary">Mis Banquetes</Link></li>
                )}
                {isAdmin && (
                  <li><Link to="/admin" className="py-3 font-medium text-warning">Panel Admin</Link></li>
                )}
                <div className="divider my-0 opacity-20"></div>
                <li>
                  <button onClick={logout} className="text-error font-bold py-3 hover:bg-error/10">
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Elegant bottom line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </div>
  );
};

export default Navbar;
