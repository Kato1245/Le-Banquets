// src/pages/Catering.jsx - Versión completa
import { useState } from "react";

const Catering = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedItems, setSelectedItems] = useState([]);

  const menuItems = [
    {
      id: 1,
      nombre: "Menú Internacional",
      descripcion: "Una selección de platillos de diversas gastronomías del mundo.",
      imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "comida",
      precio: 450,
      tipo: "buffet"
    },
    {
      id: 2,
      nombre: "Barra de Bebidas Premium",
      descripcion: "Bebidas nacionales e importadas, cocktails exclusivos y bartender.",
      imagen: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      categoria: "bebidas",
      precio: 250,
      tipo: "barra libre"
    },
    {
      id: 3,
      nombre: "Postres Gourmet",
      descripcion: "Selección de postres finos, pastel personalizado y estación de café.",
      imagen: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1468&q=80",
      categoria: "postres",
      precio: 180,
      tipo: "estación"
    },
    {
      id: 4,
      nombre: "Menú Vegetariano",
      descripcion: "Opción especial con ingredientes frescos y de temporada.",
      imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "comida",
      precio: 380,
      tipo: "plato servido"
    },
    {
      id: 5,
      nombre: "Coctelería de Autor",
      descripcion: "Cocteles signature creados especialmente para tu evento.",
      imagen: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1486&q=80",
      categoria: "bebidas",
      precio: 320,
      tipo: "barra premium"
    },
    {
      id: 6,
      nombre: "Estación de Sushi",
      descripcion: "Sushi fresco preparado al momento por chefs especializados.",
      imagen: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "comida",
      precio: 550,
      tipo: "estación interactiva"
    }
  ];

  const categorias = [
    { id: "todos", nombre: "Todo el Menú" },
    { id: "comida", nombre: "Comida" },
    { id: "bebidas", nombre: "Bebidas" },
    { id: "postres", nombre: "Postres" }
  ];

  const filteredItems = selectedCategory === "todos" 
    ? menuItems 
    : menuItems.filter(item => item.categoria === selectedCategory);

  const addToSelection = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const removeFromSelection = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.precio, 0);
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Servicio de Catering</h1>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Ofrecemos experiencias culinarias excepcionales con menús personalizados para tu evento
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menú de catering */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 p-6 rounded-lg shadow-md mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categorias.map(categoria => (
                  <button
                    key={categoria.id}
                    className={`btn btn-sm ${selectedCategory === categoria.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSelectedCategory(categoria.id)}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="card bg-base-100 shadow-md">
                  <figure>
                    <img src={item.imagen} alt={item.nombre} className="h-48 w-full object-cover" />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-lg">{item.nombre}</h2>
                    <p className="text-sm">{item.descripcion}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="badge badge-outline">{item.tipo}</div>
                      <div className="font-bold">${item.precio} por persona</div>
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => addToSelection(item)}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de selección */}
          <div className="bg-base-200 p-6 rounded-lg shadow-md h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Tu selección</h2>
            
            {selectedItems.length === 0 ? (
              <p className="text-center py-4">Aún no has seleccionado items</p>
            ) : (
              <div>
                <ul className="space-y-3">
                  {selectedItems.map(item => (
                    <li key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-sm text-gray-600">${item.precio} c/u</p>
                      </div>
                      <button 
                        className="btn btn-xs btn-error"
                        onClick={() => removeFromSelection(item.id)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total estimado:</span>
                    <span>${calculateTotal().toLocaleString()}</span>
                  </div>
                  <p className="text-sm mt-2">* Precio por persona. El total final puede variar según el número de invitados.</p>
                  
                  <div className="mt-6 space-y-2">
                    <button className="btn btn-primary w-full">Solicitar cotización</button>
                    <button className="btn btn-outline w-full">Limpiar selección</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-16 bg-primary text-primary-content rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">¿Necesitas un menú personalizado?</h2>
          <p className="text-center max-w-3xl mx-auto mb-6">
            Nuestros chefs pueden crear un menú exclusivo para tu evento, considerando tus preferencias, 
            restricciones dietéticas y tema de la celebración.
          </p>
          <div className="text-center">
            <button className="btn btn-secondary btn-lg">Contactar a un chef</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catering;
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
