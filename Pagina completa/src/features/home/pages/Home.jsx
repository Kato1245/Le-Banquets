import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section - Premium Vibe */}
            <section className="hero min-h-screen relative overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </div>

                <div className="hero-content relative z-10 text-neutral-content w-full flex justify-start px-8 lg:px-24">
                    <div className="max-w-xl text-left">
                        <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                            Momentos <span className="text-primary italic">Inolvidables</span> <br />
                            Espacios Únicos.
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed font-light">
                            Conectamos tus sueños con los banquetes y salones más exclusivos de la ciudad. Reserva con elegancia y facilidad.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/banquetes" className="btn btn-primary btn-lg px-10 shadow-xl hover:shadow-primary/40 group">
                                Explorar Banquetes
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

                            {!user && (
                                <Link to="/registro" className="btn btn-outline btn-lg text-white border-white/30 hover:bg-white/10 px-10">
                                    Registrar mi salón
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Cómo funciona */}
            <section className="py-24 px-4 bg-base-100 border-t border-primary/5">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">¿Cómo funciona?</h2>
                    <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
                    <p className="text-xl opacity-70 max-w-2xl mx-auto font-light">
                        Le Banquets es la plataforma que te conecta directamente con propietarios de salones y espacios para eventos más prestigiados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Paso 1 */}
                    <div className="group p-8 rounded-3xl bg-base-200/50 border border-transparent hover:border-primary/20 transition-all duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Busca tu espacio</h3>
                        <p className="text-base-content/70 leading-relaxed">Explora cientos de salones y espacios para banquetes publicados por propietarios verificados y con las mejores valoraciones.</p>
                    </div>

                    {/* Paso 2 */}
                    <div className="group p-8 rounded-3xl bg-base-200/50 border border-transparent hover:border-primary/20 transition-all duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Compara y elige</h3>
                        <p className="text-base-content/70 leading-relaxed">Revisa fotos en alta definición, capacidades reales, precios detallados y disponibilidad inmediata para tu gran día.</p>
                    </div>

                    {/* Paso 3 */}
                    <div className="group p-8 rounded-3xl bg-base-200/50 border border-transparent hover:border-primary/20 transition-all duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Reserva directo</h3>
                        <p className="text-base-content/70 leading-relaxed">Contacta directamente al propietario, coordina visitas y asegura tu fecha sin cargos ocultos ni intermediarios.</p>
                    </div>
                </div>
            </section>

            {/* ¿Eres propietario? */}
            <section className="py-24 px-4 bg-base-200/30">
                <div className="max-w-5xl mx-auto">
                    <div className="card bg-base-100 shadow-2xl border border-primary/10 overflow-hidden">
                        <div className="card-body md:flex-row items-center p-12 gap-12">
                            <div className="flex-1">
                                <span className="badge badge-primary badge-outline font-bold px-4 py-3 mb-4 uppercase tracking-widest text-xs">Para Socios</span>
                                <h2 className="text-4xl font-extrabold mb-6 leading-tight text-white mb-2">¿Tienes un salón exclusivo?</h2>
                                <p className="text-xl opacity-80 mb-8 font-light leading-relaxed">
                                    Únete a la red de anfitriones más selecta. Publica tu espacio y conecta con clientes que valoran el lujo y la exclusividad.
                                </p>
                                <ul className="space-y-4 mb-8 text-base-content/80">
                                    <li className="flex items-center gap-3">
                                        <div className="bg-success/20 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                                        <span>Exposición ante miles de clientes potenciales</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="bg-success/20 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                                        <span>Gestión intuitiva de reservas y disponibilidad</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="bg-success/20 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                                        <span>Directo con el cliente, sin comisiones por reserva</span>
                                    </li>
                                </ul>
                                <Link to="/registro-propietario" className="btn btn-primary btn-lg px-8">
                                    Registrar mi espacio
                                </Link>
                            </div>
                            <div className="flex-shrink-0 hidden md:block">
                                <div className="w-64 h-64 rounded-3xl bg-primary/5 flex items-center justify-center border-2 border-primary/20 rotate-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer footer-center p-20 bg-base-200/50 text-base-content border-t border-primary/5">
                <div className="grid grid-flow-col gap-8 opacity-70">
                    <Link to="/nosotros" className="link link-hover font-medium">Sobre nosotros</Link>
                    <Link to="/contacto" className="link link-hover font-medium">Contacto</Link>
                    <Link to="/terminos" className="link link-hover font-medium">Términos y condiciones</Link>
                </div>
                <div className="my-8">
                    <div className="grid grid-flow-col gap-6">
                        <a className="btn btn-ghost btn-circle text-primary hover:bg-primary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                        </a>
                        <a className="btn btn-ghost btn-circle text-primary hover:bg-primary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
                        </a>
                        <a className="btn btn-ghost btn-circle text-primary hover:bg-primary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                        </a>
                    </div>
                </div>
                <div>
                    <p className="font-mono text-xs opacity-50 tracking-widest uppercase">© {new Date().getFullYear()} Le Banquets - Excelencia en Eventos</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
