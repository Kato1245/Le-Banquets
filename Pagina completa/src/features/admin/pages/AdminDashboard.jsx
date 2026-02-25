// src/features/admin/pages/AdminDashboard.jsx
import { useAuth } from "../../../context/AuthContext";

const AdminDashboard = () => {
    const { user } = useAuth();

    // Guard de rol — ProtectedRoute ya redirige, pero esta verificación
    // actúa como segunda capa defensiva en la UI
    if (!user?.isAdmin) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-error mb-2">Acceso Denegado</h1>
                    <p className="text-base-content/60">No tienes permisos para acceder a esta sección.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

                {/* Estadísticas — placeholder hasta implementar endpoint /api/admin/stats */}
                <div className="alert alert-info mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Las estadísticas estarán disponibles cuando se implemente el endpoint <strong>/api/admin/stats</strong> en el backend.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Usuarios', value: '—', color: 'text-primary' },
                        { label: 'Total Propietarios', value: '—', color: 'text-secondary' },
                        { label: 'Total Banquetes', value: '—', color: 'text-accent' },
                        { label: 'Total Eventos', value: '—', color: 'text-info' },
                    ].map((stat) => (
                        <div key={stat.label} className="stat bg-base-200 rounded-lg">
                            <div className="stat-title">{stat.label}</div>
                            <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Acciones rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Gestión de Usuarios</h2>
                            <p>Administra los usuarios registrados en el sistema</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" disabled title="Próximamente">Ver Usuarios</button>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Gestión de Propietarios</h2>
                            <p>Administra los propietarios y sus banquetes</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" disabled title="Próximamente">Ver Propietarios</button>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Reportes</h2>
                            <p>Genera reportes de actividad del sistema</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-secondary" disabled title="Próximamente">Generar Reporte</button>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Configuración</h2>
                            <p>Configuración general del sistema</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-ghost" disabled title="Próximamente">Configurar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
