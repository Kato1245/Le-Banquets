// src/features/banquetes/pages/Catering.jsx
import { useState } from "react";

const Catering = () => {
    const [selectedCategory, setSelectedCategory] = useState("todos");
    const [selectedItems, setSelectedItems] = useState([]);

    const menuItems = [
        { id: 1, nombre: "Menú Internacional", categoria: "comida", precio: 450 },
        { id: 2, nombre: "Barra de Bebidas Premium", categoria: "bebidas", precio: 250 }
    ];

    return (
        <div className="min-h-screen bg-base-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Servicio de Catering</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuItems.map(item => (
                        <div key={item.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{item.nombre}</h2>
                                <p>${item.precio} por persona</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Catering;
