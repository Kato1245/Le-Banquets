// src/features/admin/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../config/api";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalPropietarios: 0,
    totalBanquetes: 0,
    totalEventos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data || data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-error/10 border border-error/20 max-w-md w-full p-8 text-center rounded-3xl">
          <div className="text-error text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-error mb-2">Acceso Denegado</h1>
          <p className="text-base-content/60">No tienes los privilegios necesarios para acceder a esta área de control.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="font-bold opacity-40 animate-pulse uppercase tracking-widest text-xs">Cargando Protocolos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-base-content/5 pb-8">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">Terminal de Control</h1>
            <p className="text-lg opacity-60 font-medium italic">Panel de Supervisión Administrativa — Le Banquets Group</p>
          </div>
          <div className="badge badge-primary badge-outline py-4 px-6 rounded-xl font-bold uppercase tracking-widest">
            Nivel de Acceso: Administrador
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Usuarios', value: stats.totalUsuarios, color: 'text-primary', icon: '👤' },
            { label: 'Propietarios', value: stats.totalPropietarios, color: 'text-secondary', icon: '🏢' },
            { label: 'Banquetes', value: stats.totalBanquetes, color: 'text-accent', icon: '🏰' },
            { label: 'Eventos', value: stats.totalEventos, color: 'text-info', icon: '📅' },
          ].map((stat) => (
            <div key={stat.label} className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-xl transition-all p-6 rounded-3xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
                <div className="badge badge-ghost opacity-40 text-[10px] font-bold">24H</div>
              </div>
              <div className="stat-title font-bold opacity-50 uppercase tracking-tighter text-xs">{stat.label}</div>
              <div className={`stat-value text-4xl font-black ${stat.color} tracking-tighter`}>
                {stat.value === undefined || stat.value === null ? '—' : stat.value}
              </div>
              <div className="mt-4 h-1 w-full bg-base-content/5 rounded-full overflow-hidden">
                <div className={`h-full bg-current ${stat.color} opacity-30`} style={{ width: '65%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones de Gestión */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </span>
          Módulos de Gestión
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Gestión de Usuarios', desc: 'Control de accesos, roles y bloqueos de seguridad.', btn: 'Explorar Usuarios' },
            { title: 'Moderación de Banquetes', desc: 'Validación de espacios publicados por propietarios.', btn: 'Revisar Catálogo' },
            { title: 'Auditoría de Eventos', desc: 'Seguimiento de reservas y satisfacción del cliente.', btn: 'Bitácora de Eventos' },
            { title: 'Reportes Inteligentes', desc: 'Análisis de tendencias y crecimiento de la red.', btn: 'Generar Informe' },
            { title: 'Seguridad del Sistema', desc: 'Logs de errores y configuración de parámetros globales.', btn: 'Panel Técnico' },
            { title: 'Soporte Directo', desc: 'Centro de mensajería con usuarios y propietarios.', btn: 'Abrir Tickets' },
          ].map((module, i) => (
            <div key={i} className="card bg-base-200 shadow-md border border-base-300 rounded-[2rem] hover:bg-base-100 hover:scale-[1.02] transition-all">
              <div className="card-body p-8">
                <h3 className="card-title text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-sm opacity-60 mb-6 font-medium">{module.desc}</p>
                <div className="card-actions">
                  <button className="btn btn-outline btn-block rounded-2xl normal-case btn-sm font-bold opacity-30 cursor-not-allowed">
                    {module.btn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
