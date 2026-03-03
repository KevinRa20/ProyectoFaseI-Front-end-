import React, { useState, useEffect } from "react";
import "../style/Panelcomprador.css";
import { useNavigate } from "react-router-dom";
import Chat from "../pages/Chat";
import Compras from "../pages/Compras";

const PanelComprador = () => {
  const [categoria, setCategoria] = useState("Todas");
  const [region, setRegion] = useState("Todas");
  const [precioMax, setPrecioMax] = useState("Todos");
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("productos");

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  //  búsqueda
  const [busqueda, setBusqueda] = useState("");

  //  notificaciones
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const navigate = useNavigate();
  const usuario = "comprador";

  const categorias = ["Todas", "Hortalizas", "Frutas", "Verduras", "Cereales", "Lácteos", "Raíces", "Industriales", "Leguminosas", "Otros"];
  const regiones = ["Todas", "Región Occidental", "Región Noroccidental", "Región Nororiental", "Región Centro Occidental", "Región Centro Oriental", "Región Sur"];
  const precios = ["Todos", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(data);

    const historial = JSON.parse(localStorage.getItem("historialCompras")) || [];
    setNotificaciones(historial);
  }, []);

  //  FILTRO COMPLETO (categoría + región + precio + búsqueda)
  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();

    const cumpleBusqueda =
      p.nombre.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto) ||
      p.region.toLowerCase().includes(texto);

    const cumpleCategoria = categoria === "Todas" || p.categoria === categoria;
    const cumpleRegion = region === "Todas" || p.region === region;
    const cumplePrecio = precioMax === "Todos" || Number(p.precio) <= Number(precioMax);

    return cumpleBusqueda && cumpleCategoria && cumpleRegion && cumplePrecio;
  });

  const abrirFormulario = (producto) => {
    setProductoSeleccionado(producto);
  };

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

{/*  NOTIFICACIONES */}
<img
src="https://cdn-icons-png.flaticon.com/128/3239/3239952.png"
alt="notificaciones"
onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
/>
<img
 src="https://cdn-icons-png.flaticon.com/128/15598/15598573.png"
alt="carrito"
onClick={() => setVista("carrito")}/>
<button onClick={() => setVista("historial")}>Historial</button>
<button className="logout1" onClick={() => navigate("/login")}>Salir</button>
</div>
</header>

{/*  PANEL DE NOTIFICACIONES */}
{mostrarNotificaciones && (
<div className="notificaciones">
<h3>Notificaciones</h3>
{notificaciones.length === 0 ? (
<p>No hay notificaciones</p>
) : (
notificaciones.map((n) => (
<div key={n.id}>
<p>Compra del {n.fecha}</p>
<p>Estado: {n.estado}</p>
<hr />
</div>
))
)}
</div>
)}

{/* BARRA DE BÚSQUEDA */}
<section className="search-bar">
 <div className="search-input">
🔍
<input
 type="text"
placeholder="Buscar por producto, categoría o región"
value={busqueda}
onChange={(e) => setBusqueda(e.target.value)}/>
        </div>
<div className="filters">
 <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
 {categorias.map(cat => <option key={cat}>{cat}</option>)}
          </select>

          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regiones.map(reg => <option key={reg}>{reg}</option>)}
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
      {vista === "chat" && <Chat usuario={usuario} volver={() => setVista("productos")} />}

      {/* COMPRAS */}
      <Compras
        vista={vista}
        setVista={setVista}
        productoSeleccionado={productoSeleccionado}
        setProductoSeleccionado={setProductoSeleccionado}
      />

{/* PRODUCTOS */}
{vista === "productos" && (
<section className="products">
{productosFiltrados.length === 0 ? (
<p style={{ textAlign: "center", width: "100%" }}>No hay resultados</p>
) : (
productosFiltrados.map((prod, index) => (
  <div className="card2" key={index}>
  <img src={prod.imagen} alt={prod.nombre} />
 <div className="card-body">
<h2>{prod.nombre}</h2>
<span className="category">{prod.categoria}</span>
<p>{prod.descripcion}</p>
<p><strong>Finca: </strong> {prod.finca}</p>
<p><strong>Ubicación: </strong> {prod.ubicacion}</p>
<p><strong>Productor: </strong> {prod.productor}</p>
<p><strong>Región: </strong>{prod.region}</p>
<p><strong>Precio Disponible: </strong>L.{prod.precio}/{prod.unidad}</p>
<button onClick={() => abrirFormulario(prod)}>Agregar</button>
</div>
</div>
))
)}
</section>)}
</div>
  );
};

export default PanelComprador;