// src/features/admin/pages/Configuracion.jsx - Versión completa
import { useState } from "react";

const Configuracion = () => {
    const [activeTab, setActiveTab] = useState("perfil");
    const [userData, setUserData] = useState({
        nombre: "Ana García",
        email: "ana.garcia@ejemplo.com",
        telefono: "+52 55 1234 5678",
        empresa: "Tech Solutions",
        puesto: "Directora de Eventos"
    });

    const [notifications, setNotifications] = useState({
        email: true,
        promociones: true,
        recordatorios: true,
        newsletter: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Cambios guardados correctamente");
    };

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Configuración</h1>

                {/* Tabs */}
                <div className="tabs tabs-boxed mb-8">
                    <button
                        className={`tab ${activeTab === "perfil" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("perfil")}
                    >
                        Perfil
                    </button>
                    <button
                        className={`tab ${activeTab === "notificaciones" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("notificaciones")}
                    >
                        Notificaciones
                    </button>
                    <button
                        className={`tab ${activeTab === "seguridad" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("seguridad")}
                    >
                        Seguridad
                    </button>
                    <button
                        className={`tab ${activeTab === "preferencias" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("preferencias")}
                    >
                        Preferencias
                    </button>
                </div>

                {/* Contenido de las tabs */}
                <div className="bg-base-100 rounded-lg shadow-md p-6">
                    {activeTab === "perfil" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Información del Perfil</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Nombre completo</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={userData.nombre}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Correo electrónico</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Teléfono</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={userData.telefono}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Empresa</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="empresa"
                                            value={userData.empresa}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                        />
                                    </div>
                                    <div className="form-control md:col-span-2">
                                        <label className="label">
                                            <span className="label-text">Puesto</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="puesto"
                                            value={userData.puesto}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                        />
                                    </div>
                                </div>
                                <div className="form-control mt-6">
                                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "notificaciones" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Preferencias de Notificación</h2>
                            <p className="mb-6">Selecciona qué tipo de notificaciones deseas recibir:</p>

                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Notificaciones por correo electrónico</span>
                                        <input
                                            type="checkbox"
                                            name="email"
                                            checked={notifications.email}
                                            onChange={handleNotificationChange}
                                            className="toggle toggle-primary"
                                        />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Promociones y ofertas especiales</span>
                                        <input
                                            type="checkbox"
                                            name="promociones"
                                            checked={notifications.promociones}
                                            onChange={handleNotificationChange}
                                            className="toggle toggle-primary"
                                        />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Recordatorios de eventos</span>
                                        <input
                                            type="checkbox"
                                            name="recordatorios"
                                            checked={notifications.recordatorios}
                                            onChange={handleNotificationChange}
                                            className="toggle toggle-primary"
                                        />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Newsletter mensual</span>
                                        <input
                                            type="checkbox"
                                            name="newsletter"
                                            checked={notifications.newsletter}
                                            onChange={handleNotificationChange}
                                            className="toggle toggle-primary"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Guardar preferencias</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "seguridad" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Seguridad de la Cuenta</h2>

                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Contraseña actual</span>
                                    </label>
                                    <input type="password" className="input input-bordered" />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Nueva contraseña</span>
                                    </label>
                                    <input type="password" className="input input-bordered" />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Confirmar nueva contraseña</span>
                                    </label>
                                    <input type="password" className="input input-bordered" />
                                </div>

                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Cambiar contraseña</button>
                                </div>

                                <div className="divider"></div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4">Sesiones activas</h3>
                                    <div className="bg-base-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Chrome en Windows</p>
                                                <p className="text-sm">Ciudad de México - Hace 2 horas</p>
                                            </div>
                                            <button className="btn btn-sm btn-error">Cerrar sesión</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "preferencias" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Preferencias de la Aplicación</h2>

                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Idioma</span>
                                    </label>
                                    <select className="select select-bordered">
                                        <option>Español</option>
                                        <option>English</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Zona horaria</span>
                                    </label>
                                    <select className="select select-bordered">
                                        <option>(UTC-06:00) Centro de México</option>
                                        <option>(UTC-08:00) Pacífico de México</option>
                                        <option>(UTC-07:00) Montaña de México</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Formato de fecha</span>
                                    </label>
                                    <select className="select select-bordered">
                                        <option>DD/MM/AAAA</option>
                                        <option>MM/DD/AAAA</option>
                                        <option>AAAA-MM-DD</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Modo oscuro</span>
                                        <input type="checkbox" className="toggle toggle-primary" />
                                    </label>
                                </div>

                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Guardar preferencias</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Configuracion;
