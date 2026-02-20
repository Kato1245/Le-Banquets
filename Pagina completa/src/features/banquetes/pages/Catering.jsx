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