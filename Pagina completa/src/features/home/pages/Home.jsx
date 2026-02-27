import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">

          <h1 className="text-5xl font-bold text-primary">
            Encuentra el banquete perfecto
          </h1>

          <p className="py-6 text-base-content/70">
            Reserva salones, catering y eventos en un solo lugar.
          </p>

          <Link to="/banquetes" className="btn btn-primary btn-lg">
            Explorar ahora
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Home;
// src/features/home/pages/Home.jsx
import { Link } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section
                className="hero min-h-screen bg-base-200"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)' }}
            >
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-lg">
                        <h1 className="mb-5 text-5xl font-bold">Le Banquets</h1>
                        <p className="mb-5 text-lg">
                            Encuentra y reserva el salón perfecto para tu evento. Conectamos a personas
                            como tú con los mejores propietarios de salones y espacios para banquetes.
                        </p>
                        {user ? (
                            <Link to="/banquetes" className="btn btn-primary btn-lg">Explorar Banquetes</Link>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/banquetes" className="btn btn-primary btn-lg">Ver Banquetes Disponibles</Link>
                                <Link to="/registro" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black">Crear Cuenta</Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Cómo funciona */}
            <section className="py-16 px-4 bg-base-100">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
                    <p className="text-xl opacity-70 max-w-2xl mx-auto">
                        Le Banquets es la plataforma que te conecta directamente con propietarios de salones y espacios para eventos
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Paso 1 */}
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <div className="badge badge-primary badge-lg mb-2">1</div>
                            <h3 className="text-xl card-title">Busca tu espacio</h3>
                            <p className="text-lg">Explora cientos de salones y espacios para banquetes publicados por propietarios verificados.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/banquetes" className="text-lg btn btn-primary btn-sm">Ver banquetes</Link>
                            </div>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <div className="badge badge-primary badge-lg mb-2">2</div>
                            <h3 className="text-xl card-title">Compara y elige</h3>
                            <p className="text-lg">Revisa fotos, capacidades, precios y disponibilidad de cada espacio para tomar la mejor decisión.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/banquetes" className="text-lg btn btn-primary btn-sm">Ver banquetes</Link>
                            </div>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </figure>
                        <div className="card-body items-center text-center">
                            <div className="badge badge-primary badge-lg mb-2">3</div>
                            <h3 className="text-xl card-title">Reserva directo</h3>
                            <p className="text-lg">Contacta directamente al propietario del espacio y coordina tu evento sin intermediarios innecesarios.</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/registro" className="text-lg btn btn-primary btn-sm">Registrarse gratis</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ¿Eres propietario? */}
            <section className="py-16 px-4 bg-base-200">
                <div className="max-w-4xl mx-auto">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-3">¿Tenés un salón o espacio para eventos?</h2>
                                <p className="text-lg opacity-70 mb-4">
                                    Publicá tu espacio en Le Banquets y llegá a miles de personas que buscan
                                    el lugar perfecto para su evento. Es gratis registrarse.
                                </p>
                                <ul className="space-y-2 mb-6 text-base-content/80">
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Publicá fotos y detalles de tu espacio
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Recibí consultas de clientes interesados
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Administrá tu disponibilidad y precios
                                    </li>
                                </ul>
                                <Link to="/registro-propietario" className="btn btn-primary">
                                    Registrar mi espacio
                                </Link>
                            </div>
                            <div className="flex-shrink-0 hidden md:block">
                                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
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
