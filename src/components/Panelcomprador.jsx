import React, { useState, useEffect } from "react";
import "../style/Panelcomprador.css";
import { useNavigate } from "react-router-dom";

const PanelComprador = () => {
  const [categoria, setCategoria] = useState("Todas");
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const categorias = ["Todas", "Hortalizas", "Frutas", "Verduras","Cereales", "Lácteos", "Raíces", "Industriales", "Leguminosas", "Otros"];

  // Cargar productos del productor
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(data);
  }, []);

  // Filtrar por categoría
  const productosFiltrados =
    categoria === "Todas"
      ? productos
      : productos.filter(p => p.categoria === categoria);

  return (
    <div className="panel-comprador">

  {/* HEADER */}
  <header className="header">
  <div>
  <h1>Agro Commerce</h1>
  <h2>Bienvenido, Has ingresado como comprador</h2>
  </div>
<div className="icons">
<img src="https://cdn-icons-png.flaticon.com/128/3239/3239952.png" alt="notificaciones" />
<img src="https://cdn-icons-png.flaticon.com/128/15598/15598573.png" alt="carrito" />
<button className="logout" onClick={() => navigate("/login")}>Salir</button>
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
        {productosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            No hay productos disponibles
          </p>
        ) : (
          productosFiltrados.map((prod, index) => (
            <div className="card2" key={index}>
              <img src={prod.imagen} alt={prod.nombre} />

              <div className="card-body">
                <div className="info">
                  <h2>{prod.nombre}</h2>
                  <span className="category">{prod.categoria}</span>
                  <p>{prod.descripcion}</p>
                  <div className="price">L{prod.precio}/{prod.unidad}</div>
                </div>

                <div className="actions">
                  <span className="stock">{prod.stock} {prod.unidad}</span>
                  <button>Agregar</button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

    </div>
  );
};

export default PanelComprador;