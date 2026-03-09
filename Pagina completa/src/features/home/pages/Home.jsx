// src/features/home/pages/Home.jsx
import { Link } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-100 font-sans selection:bg-primary selection:text-white">
            {/* Ultra Premium Hero Section */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=90"
                        className="w-full h-full object-cover"
                        alt="Luxurious Banquet Hall"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 text-left animate-in fade-in slide-in-from-left-10 duration-1000">
                        <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                            Donde los <span className="text-primary italic serif">Sueños</span> <br />
                            cobran <span className="underline decoration-primary decoration-8 underline-offset-8">Vida</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-lg mb-12 leading-relaxed font-medium">
                            Descubre la colección más exclusiva de salones de banquetes y espacios majestuosos.
                            Reserva con la confianza de tratar directamente con los propietarios.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <Link to="/banquetes" className="btn btn-primary btn-lg rounded-2xl px-12 shadow-[0_20px_50px_rgba(234,179,8,0.3)] hover:scale-105 transition-all text-lg font-black normal-case">
                                Explorar Colección
                            </Link>
                            {!user && (
                                <Link to="/registro" className="btn btn-ghost btn-lg rounded-2xl px-12 text-white border-2 border-white/20 hover:bg-white/10 transition-all text-lg font-bold normal-case">
                                    Unirme Ahora
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Tiers */}
            <section className="py-32 px-6">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-5xl font-black tracking-tighter mb-6 uppercase">Excelencia en <br />cada detalle</h2>
                            <p className="text-lg opacity-60 font-medium">
                                No solo conectamos espacios; seleccionamos experiencias transformadoras para que tu único trabajo sea disfrutar.
                            </p>
                        </div>
                        <div className="hidden md:block h-1 w-32 bg-primary rounded-full mb-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: '🏰',
                                title: 'Directo Propietario',
                                desc: 'Sin intermediarios. Comunicación fluida y precios transparentes directo con los dueños de los salones.',
                                color: 'bg-amber-100 text-amber-900'
                            },
                            {
                                icon: '🥂',
                                title: 'Catering Premium',
                                desc: 'Acceso a las mejores casas de banquetes y mixología de autor integradas a cada salón.',
                                color: 'bg-rose-100 text-rose-900'
                            },
                            {
                                icon: '📅',
                                title: 'Gestión Agile',
                                desc: 'Reserva, modifica y monitorea tu evento desde un dashboard intuitivo y profesional.',
                                color: 'bg-indigo-100 text-indigo-900'
                            }
                        ].map((tier, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-base-200 hover:bg-white hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-500 border border-transparent hover:border-base-300">
                                <div className={`w-20 h-20 ${tier.color} rounded-[1.5rem] flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition-transform`}>
                                    {tier.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{tier.title}</h3>
                                <p className="opacity-60 leading-relaxed font-medium">
                                    {tier.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA for Owners */}
            <section className="py-20 px-6 px-4">
                <div className="container mx-auto">
                    <div className="bg-neutral p-12 md:p-24 rounded-[4rem] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
                        {/* Abstract Background Elements */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>

                        <div className="lg:w-1/2 relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight uppercase tracking-tighter">
                                ¿Tu salón merece <br />estar en el trono?
                            </h2>
                            <p className="text-white/60 text-lg mb-10 font-medium max-w-md">
                                Únete a la comunidad de propietarios más selecta de la región. Digitaliza tu negocio y llena tu calendario con eventos de alto nivel.
                            </p>
                            <Link
                                to={user?.userType === 'propietario' || user?.role === 'propietario' ? '/mis-banquetes?action=nuevo' : '/registro-propietario'}
                                className="btn btn-primary btn-lg rounded-2xl px-12 font-black uppercase text-sm tracking-widest border-none"
                            >
                                Agregar un Banquete
                            </Link>
                        </div>

                        <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10">
                            {[
                                { val: '15k+', label: 'Usuarios mes' },
                                { val: '500+', label: 'Eventos/año' },
                                { val: '98%', label: 'Satisfacción' },
                                { val: '0%', label: 'Comisiones' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
                                    <p className="text-4xl font-black text-primary mb-2">{stat.val}</p>
                                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Refined Footer */}
            <footer className="bg-base-100 border-t border-base-content/5 py-20 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <h2 className="text-2xl font-black tracking-tighter mb-8 uppercase text-primary">Le Banquets</h2>
                            <p className="text-sm opacity-50 font-medium leading-relaxed">
                                Redefiniendo la planificación de eventos con tecnología y exclusividad. La plataforma líder en conexión directa de banquetes.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Directorio</h4>
                            <ul className="space-y-4 font-bold text-sm">
                                <li><Link to="/banquetes" className="hover:text-primary transition-colors">Todos los Salones</Link></li>
                                <li><Link to="/catering" className="hover:text-primary transition-colors">Experiencia Catering</Link></li>
                                <li><Link to="/eventos" className="hover:text-primary transition-colors">Tipos de Evento</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Soporte</h4>
                            <ul className="space-y-4 font-bold text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">Centro de Ayuda</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Términos Legales</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-base-content/5 gap-8">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
                            © {new Date().getFullYear()} LE BANQUETS GROUP · PREMIUM EVENT MANAGEMENT
                        </p>
                        <div className="flex gap-6 opacity-30 hover:opacity-100 transition-opacity">
                            {/* Social Icons Placeholder */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 bg-current rounded-sm"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home;
