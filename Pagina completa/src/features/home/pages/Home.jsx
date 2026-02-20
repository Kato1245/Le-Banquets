// src/features/home/pages/Home.jsx
import { Link } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import CarruselBanquetes from "../components/Carrusel"

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)' }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Le Banquets</h1>
                        <p className="mb-5 text-lg">Organiza el evento de tus sueños con nuestro servicio de banquetes de clase mundial. Desde bodas y quinces hasta eventos corporativos, hacemos realidad tu visión.</p>
                        {user ? (
                            <Link to="/eventos" className="btn btn-primary">Explorar Eventos</Link>
                        ) : (
                            <Link to="/registro" className="btn btn-primary btn-lg">Comenzar ahora</Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-base-100">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
                    <p className="text-xl opacity-70 max-w-2xl mx-auto">Ofrecemos una amplia gama de servicios para hacer de tu evento una experiencia inolvidable</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V5a2 2 0 012-2h14a2 2 0 012 2v10.546z" />
                                </svg>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <h3 className=" text-xl card-title">Catering Premium</h3>
                            <p className="text-lg">Menús personalizados creados por chefs expertos con ingredientes de la más alta calidad.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/catering" className=" text-lg btn btn-primary btn-sm">Ver más</Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <h3 className=" text-xl card-title">Planificación de Eventos</h3>
                            <p className="text-lg">Coordinación completa de tu evento para que te concentres en disfrutar cada momento.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/eventos" className=" text-lg btn btn-primary btn-sm">Ver más</Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <h3 className=" text-xl card-title">Locaciones Exclusivas</h3>
                            <p className="text-lg">Espacios elegantes y únicos que se adaptan a las necesidades específicas de tu evento.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/salones" className=" text-lg btn btn-primary btn-sm">Ver más</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Carrusel Section */}
            <section className="py-16 px-4 bg-base-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className=" text-xl text-3xl font-bold mb-3">Nuestros Espacios</h2>
                        <p className="text-xl opacity-70 max-w-2xl mx-auto">Descubre los lugares exclusivos donde puedes realizar tus eventos</p>
                    </div>
                    <CarruselBanquetes />
                    <div className="text-center mt-8">
                        <Link to="/salones" className=" text-lg btn btn-primary btn-lg">Ver todos los salones</Link>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-base-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
                        <p className="text-lg opacity-70 max-w-2xl mx-auto">Experiencias reales de quienes han confiado en nosotros</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <div className="rating rating-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <input key={i} type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" defaultChecked />
                                        ))}
                                    </div>
                                </div>
                                <p className="mb-4">"La mejor experiencia en banquetes. Todo estuvo perfecto en nuestra boda."</p>
                                <div className="flex items-center">
                                    <div className="avatar placeholder mr-3">
                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                            <span>MG</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">María González</p>
                                        <p className="text-sm opacity-70">Boda en Jardín Botánico</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <div className="rating rating-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <input key={i} type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" defaultChecked />
                                        ))}
                                    </div>
                                </div>
                                <p className="mb-4">"Excelente servicio para nuestro evento corporativo. Muy profesionales."</p>
                                <div className="flex items-center">
                                    <div className="avatar placeholder mr-3">
                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                            <span>CR</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Carlos Rodríguez</p>
                                        <p className="text-sm opacity-70">Evento Corporativo</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <div className="rating rating-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <input key={i} type="radio" name="rating-3" className="mask mask-star-2 bg-orange-400" defaultChecked />
                                        ))}
                                    </div>
                                </div>
                                <p className="mb-4">"La comida estaba deliciosa y la atención fue excepcional. Totalmente recomendado."</p>
                                <div className="flex items-center">
                                    <div className="avatar placeholder mr-3">
                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                            <span>LM</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Laura Martínez</p>
                                        <p className="text-sm opacity-70">Fiesta de 15 años</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-primary-content">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-6">¿Listo para planificar tu evento?</h2>
                    <p className="mb-8 text-lg">Regístrate hoy y comienza a crear el evento perfecto con nuestra ayuda experta.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <Link to="/mis-eventos" className="btn btn-secondary btn-lg">Mis Eventos</Link>
                        ) : (
                            <>
                                <Link to="/registro" className="btn btn-secondary btn-lg">Usuario Individual</Link>
                                <Link to="/registro-propietario" className="btn btn-outline btn-lg btn-secondary">Soy Propietario</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
                <div className="grid grid-flow-col gap-4">
                    <a className="link link-hover">Sobre nosotros</a>
                    <a className="link link-hover">Contacto</a>
                    <a className="link link-hover">Términos y condiciones</a>
                </div>
                <div>
                    <div className="grid grid-flow-col gap-4">
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                            </svg>
                        </a>
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                <div>
                    <p>© {new Date().getFullYear()} Le Banquets - Todos los derechos reservados</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
