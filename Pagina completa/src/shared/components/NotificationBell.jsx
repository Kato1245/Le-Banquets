// src/shared/components/NotificationBell.jsx
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import notificacionesService from "../services/notificacionesService";
import toast from "react-hot-toast";

const NotificationBell = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const fetchNotificaciones = useCallback(async () => {
        try {
            const data = await notificacionesService.getMisNotificaciones();
            setNotificaciones(data || []);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    }, []);

    useEffect(() => {
        fetchNotificaciones();
        // Opcional: Polling cada 60 segundos
        const timer = setInterval(fetchNotificaciones, 60000);
        return () => clearInterval(timer);
    }, [fetchNotificaciones]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificacionesService.marcarComoLeida(id);
            setNotificaciones(prev =>
                prev.map(n => n._id === id ? { ...n, leido: true } : n)
            );
            // Redirigir al calendario
            navigate('/mis-banquetes?tab=calendario');
            setIsOpen(false);
        } catch (error) {
            toast.error("No se pudo marcar como leída.");
        }
    };

    const handleNotificationClick = async (n) => {
        if (!n.leido) {
            await handleMarkAsRead(n._id);
        } else {
            // Incluso si ya está leída, el cliente quiere que al clickear nos lleve al calendario
            navigate('/mis-banquetes?tab=calendario');
            setIsOpen(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Evitar que el clic en la X active el clic de la notificación
        try {
            await notificacionesService.eliminar(id);
            setNotificaciones(prev => prev.filter(n => n._id !== id));
            toast.success("Notificación eliminada.");
        } catch (error) {
            toast.error("No se pudo eliminar la notificación.");
        }
    };

    const unreadCount = notificaciones.filter(n => !n.leido).length;

    return (
        <div className="dropdown dropdown-end">
            <label
                tabIndex={0}
                className="btn btn-ghost btn-circle relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="badge badge-error badge-xs indicator-item animate-pulse"></span>
                    )}
                </div>
            </label>

            <div tabIndex={0} className="mt-3 z-[100] card card-compact dropdown-content w-80 bg-base-100 shadow-2xl border border-base-200 rounded-[2rem] overflow-hidden">
                <div className="card-body p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black text-xs uppercase tracking-widest opacity-40">Notificaciones</h3>
                        {unreadCount > 0 && <span className="badge badge-primary badge-sm font-bold text-[10px]">{unreadCount} nuevas</span>}
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {notificaciones.length > 0 ? (
                            notificaciones.map((n) => (
                                <div
                                    key={n._id}
                                    className={`relative p-4 rounded-2xl text-[10px] font-bold leading-relaxed cursor-pointer transition-all hover:scale-[1.02] ${n.leido
                                        ? 'opacity-60 bg-base-200'
                                        : 'bg-primary/5 border border-primary/20 shadow-sm border-l-4 border-l-primary'
                                        }`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="pr-4">{n.mensaje}</div>
                                    <button
                                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
                                        onClick={(e) => handleDelete(e, n._id)}
                                        title="Eliminar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                        .group-hover\\:opacity-100:hover { opacity: 1 !important; }
                                        div:hover .p-1 { opacity: 0.5; }
                                    ` }} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-4 block">📭</span>
                                <p className="opacity-30 text-xs font-bold">Sin novedades aún.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationBell;
