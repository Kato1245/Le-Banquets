// src/features/banquetes/pages/Catering.jsx
// NOTA: Le Banquets es una plataforma intermediaria — no ofrece catering propio.
// Esta página explica qué esperar del catering ofrecido por los propietarios de cada espacio.

const Catering = () => {
    const tiposServicio = [
        {
            id: 1,
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V5a2 2 0 012-2h14a2 2 0 012 2v10.546z" />
                </svg>
            ),
            titulo: "Menú personalizado",
            descripcion: "Muchos propietarios ofrecen menús adaptables a tu tipo de evento, desde banquetes formales hasta cocktails informales."
        },
        {
            id: 2,
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            titulo: "Servicio incluido en el espacio",
            descripcion: "Algunos salones incluyen el servicio de catering en su paquete. Revisá los detalles de cada espacio al contactar al propietario."
        },
        {
            id: 3,
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            titulo: "Proveedor externo",
            descripcion: "En otros casos, el propietario permite traer tu propio proveedor de catering. Coordinalo directamente con ellos antes de reservar."
        },
        {
            id: 4,
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            titulo: "Consultá al propietario",
            descripcion: "Cada espacio tiene sus propias condiciones. Al contactar al propietario podés preguntar sobre el catering disponible, restricciones y costos."
        }
    ];

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Catering en los Salones</h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Le Banquets no provee catering directamente. Conectamos clientes con propietarios
                        de salones, y cada espacio puede tener diferentes opciones de catering.
                    </p>
                </div>

                {/* Alert informativo */}
                <div className="alert mb-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current text-info" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>¿Cómo funciona el catering?</strong> Cada propietario define las condiciones de su espacio.
                        Al ver los detalles de un salón, encontrarás información sobre el catering disponible.
                    </span>
                </div>

                {/* Cards informativas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {tiposServicio.map(servicio => (
                        <div key={servicio.id} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        {servicio.icono}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{servicio.titulo}</h3>
                                        <p className="text-base-content/70">{servicio.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="card bg-primary text-primary-content shadow-xl">
                    <div className="card-body text-center">
                        <h2 className="text-2xl font-bold mb-2">¿Buscás un salón con catering incluido?</h2>
                        <p className="mb-6 opacity-90">Explorar los salones disponibles y contactá directamente al propietario para coordinar todos los detalles.</p>
                        <div className="card-actions justify-center">
                            <a href="/salones" className="btn btn-secondary btn-lg">Ver Salones Disponibles</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catering;
