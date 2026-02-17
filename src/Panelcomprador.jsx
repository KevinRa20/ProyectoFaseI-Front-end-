import React, { useState } from "react";
import "./Panelcomprador.css";

const PanelComprador = () => {
  const [categoria, setCategoria] = useState("Todas");

  const categorias = ["Todas", "Hortalizas", "Frutas", "Cereales", "Lácteos", "Otros"];

  const productos = [
    {
      id: 1,
      nombre: "Tomates Orgánicos",
      categoria: "Hortalizas",
      descripcion: "Tomates frescos cultivados sin pesticidas",
      precio: 3.5,
      stock: "150 kg",
      imagen: "https://cdn.portalfruticola.com/2025/08/agronotips-16-1024x683.jpg"
    },
    {
      id: 2,
      nombre: "Manzanas Rojas",
      categoria: "Frutas",
      descripcion: "Manzanas frescas de la temporada",
      precio: 4,
      stock: "200 kg",
      imagen: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
    }
  ];

  return (
    <div className="panel-comprador">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Agro Commerce</h1>
          <p>Bienvenido</p>
        </div>

        <div className="icons">
          <img src="https://cdn-icons-png.flaticon.com/128/3239/3239952.png" alt="icono-notificacion" />
          <img src="https://cdn-icons-png.flaticon.com/128/15598/15598573.png" alt="icono-compras" />
          <button className="logout">Salir</button>
        </div>
      </header>

      {/* BUSCADOR Y CATEGORÍAS */}
      <section className="search-bar">
        <div className="search-input">
          🔍
          <input type="text" placeholder="Buscar productos, productores o filtros" />
        </div>

        <div className="categories">
          {categorias.map(cat => (
            <button
              key={cat}
              className={categoria === cat ? "active" : ""}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="products">
        {productos.map(prod => (
          <div className="card" key={prod.id}>
            <img src={prod.imagen} alt={prod.nombre} />

            <div className="card-body">
              <div className="info">
                <h2>{prod.nombre}</h2>
                <span className="category">{prod.categoria}</span>
                <p>{prod.descripcion}</p>
                <div className="price">${prod.precio}/kg</div>
              </div>

              <div className="actions">
                <span className="stock">{prod.stock}</span>
                <button>Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
};

export default PanelComprador;