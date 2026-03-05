import React, { useState, useEffect } from "react";
import "../style/Panelcomprador.css";
import { useNavigate } from "react-router-dom";
import Chat from "../pages/Chat";
import Compras from "../pages/Compras";
import axios from "axios";

 const PanelComprador = () => {
  const [categoria, setCategoria] = useState("Todas");
  const [region, setRegion] = useState("Todas");
  const [precioMax, setPrecioMax] = useState("Todos");
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("productos");
  const [vistaDetalle, setVistaDetalle] = useState(false);
 const [reseñas, setReseñas] = useState([]);
 const [mostrarFormularioReseña, setMostrarFormularioReseña] = useState(false);
 const [nuevaReseña, setNuevaReseña] = useState({
  estrellas: 5,
  comentario: ""
});

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  //  búsqueda
  const [busqueda, setBusqueda] = useState("");

  //  notificaciones
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const navigate = useNavigate();
 const usuario = JSON.parse(localStorage.getItem("usuario"));
 const comprador = usuario?.email;
  const categorias = ["Todas", "Hortalizas", "Frutas", "Verduras", "Cereales", "Lácteos", "Raíces", "Industriales", "Leguminosas", "Otros"];
  const regiones = ["Todas", "Región Occidental", "Región Noroccidental", "Región Nororiental", "Región Centro Occidental", "Región Centro Oriental", "Región Sur"];
  const precios = ["Todos", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
 const registrarCompra = (producto, cantidad) => {

  const orden = {
    producto: producto.nombre,
    categoria: producto.categoria,
    precio: Number(producto.precio),
    cantidad: Number(cantidad),
    fecha: new Date().toLocaleString()
  };

  const ordenesActuales = JSON.parse(localStorage.getItem("ordenes")) || [];

  ordenesActuales.push(orden);

  localStorage.setItem("ordenes", JSON.stringify(ordenesActuales));

};
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("productos")) || [];
  setProductos(data);

  if (!comprador) return;

  const cargarNotificaciones = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notificaciones/${encodeURIComponent(comprador)}`
      );
      setNotificaciones(res.data);
    } catch (err) {
      console.error("Error al cargar notificaciones", err);
    }
  };

  cargarNotificaciones();
  const intervalo = setInterval(cargarNotificaciones, 3000);

  return () => clearInterval(intervalo);
}, [comprador]);

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
    setVistaDetalle(true);

  const todas = JSON.parse(localStorage.getItem("reseñas")) || [];
  const reseñasProducto = todas.filter(r => r.producto === producto.nombre);
  setReseñas(reseñasProducto);
  };
  const guardarReseña = () => {

  const reseña = {
    producto: productoSeleccionado.nombre,
    comprador: comprador,
    estrellas: nuevaReseña.estrellas,
    comentario: nuevaReseña.comentario,
    fecha: new Date().toLocaleString()
  };

  const todas = JSON.parse(localStorage.getItem("reseñas")) || [];
  todas.push(reseña);

  localStorage.setItem("reseñas", JSON.stringify(todas));

  setReseñas([...reseñas, reseña]);
  setMostrarFormularioReseña(false);

  setNuevaReseña({
    estrellas: 5,
    comentario: ""
  });
 
};
 const promedio =
  reseñas.length === 0
  ? 0
  : (
  reseñas.reduce((acc, r) => acc + Number(r.estrellas), 0) /
  reseñas.length
  ).toFixed(1);
const verReseñas = (producto) => {

  setProductoSeleccionado(producto);
  setVistaDetalle(true);

  const todas = JSON.parse(localStorage.getItem("reseñas")) || [];

  const reseñasProducto = todas.filter(
    r => r.producto === producto.nombre
  );

  setReseñas(reseñasProducto);

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
<div key={n._id} className="notificacion-item">
<p><strong>📦 Producto:</strong> {n.producto}</p>
<p><strong>👨‍🌾 Productor:</strong> {n.productor}</p>
<p><strong>✉️ Mensaje:</strong> {n.mensaje}</p>
<small>{new Date(n.fecha).toLocaleString()}</small>
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
registrarCompra={registrarCompra}
/>

{/* PRODUCTOS */}
{vistaDetalle && productoSeleccionado && (
<div className="detalle-producto">

<button onClick={() => setVistaDetalle(false)}>Volver al Producto</button>

<h2>{productoSeleccionado.nombre}</h2>

<img
  src={productoSeleccionado.imagen}
  alt={productoSeleccionado.nombre}
  style={{width:"200px"}}
/>

<p>{productoSeleccionado.descripcion}</p>

<p><strong>Precio:</strong> L.{productoSeleccionado.precio}</p>
<p><strong>Productor:</strong> {productoSeleccionado.productor}</p>

<hr/>

<h2>Reseñas de {productoSeleccionado.nombre}</h2>

<div className="resumen-reseñas">

<h1>{promedio}</h1>
<p>{reseñas.length} reseñas</p>

<button onClick={() => setMostrarFormularioReseña(true)}>
Escribir Reseña</button>
</div>

{reseñas.length === 0 ? (
<p>No hay reseñas aún. ¡Sé el primero en dejar una!</p>
) : (
reseñas.map((r, i) => (
<div key={i} className="reseña">
<p>⭐ {r.estrellas}</p>
<p>{r.comentario}</p>
<small>{r.comprador} - {r.fecha}</small>
<hr/>
</div>
))
)}

{mostrarFormularioReseña && (
<div className="form-reseña">

<h3>Escribir reseña</h3>

<select
value={nuevaReseña.estrellas}
onChange={(e) =>
setNuevaReseña({...nuevaReseña, estrellas:e.target.value})
}
>
<option value="5">⭐⭐⭐⭐⭐</option>
<option value="4">⭐⭐⭐⭐</option>
<option value="3">⭐⭐⭐</option>
<option value="2">⭐⭐</option>
<option value="1">⭐</option>
</select>

<textarea
placeholder="Escribe tu reseña"
value={nuevaReseña.comentario}
onChange={(e)=>
setNuevaReseña({...nuevaReseña, comentario:e.target.value})
}/>

<button onClick={guardarReseña}>Publicar</button>

</div>
)}

</div>
)}
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
<div className="botones-producto">
<button 
className="btn-agregar"
onClick={() => abrirFormulario(prod)}>Agregar al Carrito</button>
<button 
className="btn-reseñas"
onClick={() => verReseñas(prod)}>Ver Reseñas</button>
</div>
</div>
</div>
))
)}
</section>)}
</div>
  );
};

export default PanelComprador;