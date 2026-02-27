// src/features/banquetes/pages/Catering.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const Catering = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedItems, setSelectedItems] = useState([]);

  const menuItems = [
    {
      id: 1,
      nombre: "Menú Imperial Internacional",
      descripcion: "Una fusuón majestuosa de platillos mediterráneos y asiáticos. Incluye entrada, plato fuerte y postre.",
      imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "comida",
      precio_base: 125000,
      tipo: "Buffet Dirigido"
    },
    {
      id: 2,
      nombre: "Barra de Mixología Premium",
      descripcion: "Cocktails de autor, licores importados y baristas profesionales para una noche inolvidable.",
      imagen: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      categoria: "bebidas",
      precio_base: 85000,
      tipo: "Barra Libre"
    },
    {
      id: 3,
      nombre: "Estación de Repostería Fina",
      descripcion: "Mini postres gourmet, macarons franceses y cascada de chocolate belga.",
      imagen: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1468&q=80",
      categoria: "postres",
      precio_base: 45000,
      tipo: "Estación"
    },
    {
      id: 4,
      nombre: "Gala Vegetariana",
      descripcion: "Ingredientes orgánicos salteados al wok con especias de oriente y reducciones balsámicas.",
      imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      categoria: "comida",
      precio_base: 95000,
      tipo: "Plato Servido"
    }
  ];

  const categorias = [
    { id: "todos", nombre: "Explorar Todo" },
    { id: "comida", nombre: "Platos Fuertes" },
    { id: "bebidas", nombre: "Licores y Bebidas" },
    { id: "postres", nombre: "Dulce y Café" }
  ];

  const filteredItems = selectedCategory === "todos"
    ? menuItems
    : menuItems.filter(item => item.categoria === selectedCategory);

  const addToSelection = (item) => {
    if (!selectedItems.find(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeFromSelection = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.precio_base, 0);
  };

  return (
    <div className="min-h-screen bg-base-100 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Experiencias Gastronómicas</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg text-base-content/70">
            Cada salón ofrece sus propias delicias. Aquí te mostramos una selección premium de lo que puedes coordinar con nuestros propietarios asociados.
          </p>
        </div>

        {/* Important Notice */}
        <div className="alert bg-primary/10 border-primary/20 text-primary mb-12 rounded-2xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium italic">
            Le Banquets es una plataforma de conexión. El servicio de catering es provisto directamente por el propietario del salón o sus aliados comerciales.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Menu Explorer */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-wrap gap-3 justify-start">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  className={`btn btn-sm rounded-xl px-6 normal-case ${selectedCategory === cat.id ? 'btn-primary shadow-lg' : 'btn-ghost bg-base-200 hover:bg-base-300'}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredItems.map(item => (
                <div key={item.id} className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden group">
                  <figure className="h-56 relative overflow-hidden">
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4">
                      <div className="badge badge-secondary py-3 font-bold">{item.tipo}</div>
                    </div>
                  </figure>
                  <div className="card-body p-6">
                    <h2 className="card-title text-xl font-bold">{item.nombre}</h2>
                    <p className="text-sm opacity-70 mb-4">{item.descripcion}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xl font-extrabold text-primary">${item.precio_base.toLocaleString()} <small className="text-xs opacity-50 font-normal">/ pers.</small></span>
                      <button
                        className="btn btn-outline btn-primary btn-sm rounded-lg"
                        onClick={() => addToSelection(item)}
                      >
                        Simular
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Panel */}
          <div className="space-y-6">
            <div className="card bg-base-200/50 backdrop-blur-md shadow-2xl border border-base-300 rounded-3xl sticky top-8">
              <div className="card-body p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Tu Simulación
                </h3>

                {selectedItems.length === 0 ? (
                  <div className="text-center py-10 opacity-40">
                    <div className="text-5xl mb-4">🍽️</div>
                    <p>Agrega opciones del menú para simular tu presupuesto</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <ul className="space-y-4">
                      {selectedItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center bg-base-100 p-4 rounded-xl border border-base-300">
                          <div>
                            <p className="font-bold text-sm">{item.nombre}</p>
                            <p className="text-xs opacity-60">${item.precio_base.toLocaleString()} c/u</p>
                          </div>
                          <button
                            className="btn btn-ghost btn-circle btn-xs text-error"
                            onClick={() => removeFromSelection(item.id)}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="divider opacity-50"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold opacity-70">Subtotal p/p</span>
                      <span className="text-3xl font-extrabold text-primary">${calculateTotal().toLocaleString()}</span>
                    </div>

                    <div className="card-actions flex-col gap-3 mt-4">
                      <Link to="/salones" className="btn btn-primary w-full rounded-xl shadow-lg normal-case font-bold">
                        Encontrar un Salón
                      </Link>
                      <button
                        className="btn btn-ghost w-full rounded-xl opacity-50 hover:opacity-100"
                        onClick={() => setSelectedItems([])}
                      >
                        Limpiar Todo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catering;
