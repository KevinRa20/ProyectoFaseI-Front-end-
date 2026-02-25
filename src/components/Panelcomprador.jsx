import React, { useState, useEffect } from "react";
import "../style/Panelcomprador.css";
import { useNavigate } from "react-router-dom";
import Chat from "../pages/Chat";

const PanelComprador = () => {
  const [categoria, setCategoria] = useState("Todas");
  const [region, setRegion] = useState("Todas");
  const [precioMax, setPrecioMax] = useState("Todos");
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("productos"); 


  const navigate = useNavigate();
  const usuario = "comprador";
  const categorias = ["Todas", "Hortalizas", "Frutas", "Verduras", "Cereales", "Lácteos", "Raíces", "Industriales", "Leguminosas", "Otros"];
  const regiones = ["Todas", "Occidental", "Noroccidental", "Nororiental", "Centro Occidental", "Centro Oriental", "Sur"];
  const precios = ["Todos", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Cargar productos del productor
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(data);
  }, []);

  //  FILTRO COMBINADO
    const productosFiltrados = productos.filter((p) => {
    const cumpleCategoria = categoria === "Todas" || p.categoria === categoria;
    const cumpleRegion = region === "Todas" || p.region === region;
    const cumplePrecio = precioMax === "Todos" || Number(p.precio) <= Number(precioMax);

    return cumpleCategoria && cumpleRegion && cumplePrecio;
  });

return (
<div className="panel-comprador">

{/* HEADER */}
<header className="header">
<div>
<h1>Agro Commerce</h1>
<h2>Bienvenido, Has ingresado como comprador</h2>
</div>
<div className="icons">
<img
  className="icono-mensajes"
  src="https://cdn-icons-png.flaticon.com/128/876/876221.png"
  alt="icono-mensajes"
  onClick={() => setVista("chat")}/>
<img src="https://cdn-icons-png.flaticon.com/128/3239/3239952.png" alt="notificaciones" />
<img src="https://cdn-icons-png.flaticon.com/128/15598/15598573.png" alt="carrito" />
<button className="logout1" onClick={() => navigate("/login")}>Salir</button>
</div>
</header>

 <section className="search-bar">
<div className="search-input">
🔍
<input type="text" placeholder="Buscar productos" />
</div>

<div className="filters">
<select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
{categorias.map(cat => (
<option key={cat} value={cat}>{cat}</option>
))}
</select>

<select value={region} onChange={(e) => setRegion(e.target.value)}>
{regiones.map(reg => (
<option key={reg} value={reg}>{reg}</option>
))}
</select>

<select value={precioMax} onChange={(e) => setPrecioMax(e.target.value)}>
{precios.map(p => (
<option key={p} value={p}>
{p === "Todos" ? "Todos los precios" : `Hasta L.${p}`}
</option>
))}
</select>
  </div>
</section>
  {/* CHAT */}
  {vista === "chat" && (
  <Chat usuario={usuario} volver={() => setVista("productos")} />)}
  

{/* PRODUCTOS */}
 <section className="products">
{productosFiltrados.length === 0 ? (
<p style={{ textAlign: "center", width: "100%" }}>
No hay productos con esos filtros
</p>
) : (
productosFiltrados.map((prod, index) => (
<div className="card2" key={index}>
<img src={prod.imagen} alt={prod.nombre} />
<div className="card-body">
<div className="info">
<h2>{prod.nombre}</h2>
<span className="category">{prod.categoria}</span>
<p><strong>Región:</strong> {prod.region}</p>
<p>{prod.descripcion}</p>
<p><strong>Finca:</strong> {prod.finca}</p>
<p><strong>Ubicación:</strong> {prod.ubicacion}</p>
<p><strong>Nombre del Productor:</strong> {prod.productor}</p>
<div className="price">L.{prod.precio}/{prod.unidad}</div>
</div>
<div className="actions">
<span className="stock">{prod.stock} {prod.unidad}</span>
<button>Agregar</button>
</div>
</div>
</div>
)) )}
</section>
</div>
  );
};

export default PanelComprador;