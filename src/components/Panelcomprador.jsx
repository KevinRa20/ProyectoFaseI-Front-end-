import React, { useState, useEffect } from "react";
import "../style/Panelcomprador.css";
import { useNavigate } from "react-router-dom";
import Compras from "../pages/Compras";
import axios from "axios";

  const PanelComprador = () => {
  const [categoria, setCategoria] = useState("Todas");
  const [region, setRegion] = useState("Todas");
  const [precioMax, setPrecioMax] = useState("Todos");
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("productos");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [tipoDetalle, setTipoDetalle] = useState(null);
 const [reseñas, setReseñas] = useState([]);
 const [mostrarPlanes, setMostrarPlanes] = useState(false);
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
const comprador = usuario?.email?.toLowerCase();
const planComprador = usuario?.plan || "basic";
const categorias = ["Todas", "Hortalizas", "Frutas", "Verduras", "Cereales", "Lácteos", "Raíces", "Industriales", "Leguminosas", "Otros"];
const regiones = ["Todas", "Región Occidental", "Región Noroccidental", "Región Nororiental", "Región Centro Occidental", "Región Centro Oriental", "Región Sur"];
const precios = ["Todos", 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const registrarCompra = (producto, cantidad) => {

  const orden = {
  producto: producto.nombre,
  productor: producto.productor,
  categoria: producto.categoria,
  precio: Number(producto.precio),
  cantidad: Number(cantidad),
  estado: "pendiente",
  fecha: new Date().toLocaleString()
  };
const ordenesActuales = JSON.parse(localStorage.getItem("ordenes")) || [];
ordenesActuales.push(orden);
localStorage.setItem("ordenes", JSON.stringify(ordenesActuales));
};
useEffect(() => {
const data = JSON.parse(localStorage.getItem("productos")) || [];
setProductos(data);
}, [comprador]);
//Cargar las notificaciones al comprador 
const cargarNotificaciones = async () => {
if (!comprador) return;
try {
const res = await axios.get(
`http://localhost:5000/api/notificaciones/${encodeURIComponent(comprador)}`);
console.log("Notificaciones recibidas:", res.data);
setNotificaciones(res.data.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha)));
} catch (err) {
console.error("Error al cargar notificaciones", err);
}};
const marcarComoLeidas = async () => {
try {
await axios.put(`http://localhost:5000/api/notificaciones/marcar-leidas/${comprador}`);
cargarNotificaciones();
} catch (error) {
console.error("Error al marcar notificaciones");
}};
//Cambio de planes del comprador
const handleUpgrade = (plan) => {
const user = JSON.parse(localStorage.getItem("usuario"));
if (!user) {navigate("/login");
return;}
//  Evitar mismo plan
if (user.plan === plan) {
alert("Ya tienes este plan activo");
return;
  }
const paymentLinks = {
premium: "https://buy.stripe.com/test_7sY8wPcsvgcV2d05qyawo06"
};
const link = paymentLinks[plan];
if (!link) {
alert("Plan no disponible");
return;
  }
//  Guardar plan pendiente (SIMULACIÓN)
localStorage.setItem("planPendiente", plan);
//  Redirigir a Stripe
window.location.href = link;
};
  //  Filtros (categoría + región + precio + búsqueda)
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
const obtenerCantidadCarrito = () => {
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
return carrito.length;
};
const abrirFormulario = (producto) => { 
const cantidadCarrito = obtenerCantidadCarrito();

  //  Limitacion al plan  
  if (planComprador === "basico" && cantidadCarrito >= 5) {
  alert("Tu plan básico solo permite máximo 5 productos en el carrito. Actualiza a Premium para ilimitados.");
  return;
  }
  setProductoSeleccionado(producto);
  setVista("carrito"); 
  };

const guardarReseña = () => {
const reseña = {producto: productoSeleccionado.nombre,comprador: comprador,estrellas: nuevaReseña.estrellas,comentario: nuevaReseña.comentario,fecha: new Date().toLocaleString()
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
setTipoDetalle("reseñas");
setVistaDetalle(true);
const todas = JSON.parse(localStorage.getItem("reseñas")) || [];
const reseñasProducto = todas.filter(
r => r.producto === producto.nombre);
setReseñas(reseñasProducto);
};
// IA básica: detectar producto más vendido
const productoMasVendido = productos.reduce((max, prod) => {
if (!max) return prod;
return (prod.vendido || 0) > (max.vendido || 0) ? prod : max;
}, null);
return (
<div className="panel-comprador">
{/* HEADER */}
<header className="header">
<div>
<h1>AGROCOMMERCE</h1>
<h2>Bienvenido, Has ingresado como comprador</h2>
</div>
<div className="icons">

{/*  NOTIFICACIONES */}
<img
src="https://cdn-icons-png.flaticon.com/128/3239/3239952.png"
alt="notificaciones"
onClick={() => {
setMostrarNotificaciones(!mostrarNotificaciones);
cargarNotificaciones();
marcarComoLeidas();
}}/>
{notificaciones.length > 0 && (
<span className="badge-notificaciones">
{notificaciones.length}
</span>
)}
<img
src="https://cdn-icons-png.flaticon.com/128/15598/15598573.png"
alt="carrito"
onClick={() => {setProductoSeleccionado(null);setVista("carrito");}}/>
<button onClick={() => {setProductoSeleccionado(null);setVista("historial");}}>Historial</button>
<button className="logout2" onClick={() => navigate("/login")}>Salir</button>
<button onClick={() => setMostrarPlanes(true)}>Cambiar Plan</button>
</div>
</header>
{mostrarPlanes && (
<div className="modal">
<div className="formulario">
<h2>Cambia tu plan</h2>
{planComprador === "basic" && (
<button onClick={() =>handleUpgrade( "premium")}
>Pasar a Premium ($7)</button>)}
{planComprador === "premium" && (
<p>Ya tienes el plan Premium </p>
)}
<button onClick={() => setMostrarPlanes(false)}>Cerrar</button>
</div>
</div>
)}
{/*  PANEL DE NOTIFICACIONES */}
{mostrarNotificaciones && (
<div className="notificaciones">
<h3>Notificaciones</h3>
{notificaciones.length === 0 ? (
<p>No hay notificaciones</p>
) : (
notificaciones.map((n) => (
<div key={n._id} className="notificacion-item">
<p><strong>{n.productor}</strong> te envió una actualización
</p><p>Producto: <strong>{n.producto}</strong></p>
<p>{n.mensaje}</p>
<small>{new Date(n.fecha).toLocaleString()}</small>
<hr />
</div>
)))}
</div>
)}
{/* BARRA DE BÚSQUEDA */}
<section className="search-bar">
<div className="search-input">
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
))}</select></div>
</section>
{(vista === "carrito" || vista === "historial" || vista === "resumen") && (
<Compras
vista={vista}
setVista={setVista}
registrarCompra={registrarCompra}
productoSeleccionado={productoSeleccionado} 
setProductoSeleccionado={setProductoSeleccionado}/>)}
{/* PRODUCTOS */}
{vistaDetalle && productoSeleccionado && (
<div className="detalle-producto">
<button onClick={() => setVistaDetalle(false)}>Volver</button>
<h2>{productoSeleccionado.nombre}</h2>
<img
src={productoSeleccionado.imagen} 
alt={productoSeleccionado.nombre} 
style={{width:"200px"}}/>
<p>{productoSeleccionado.descripcion}</p>
<p><strong>Precio:</strong> L.{productoSeleccionado.precio}</p>
<p><strong>Productor:</strong> {productoSeleccionado.productor}</p>
<hr/>
{tipoDetalle === "reseñas" && (
<div>
<h2>Reseñas de {productoSeleccionado.nombre}</h2>
<div className="resumen-reseñas">
<h1>{promedio}</h1>
<p>{reseñas.length} reseñas</p>
<button onClick={() => setMostrarFormularioReseña(true)}>Escribir Reseña</button>
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
)))}
</div>
)}
{mostrarFormularioReseña && (
<div className="form-reseña">
<h3 className="titulo">Escribir reseña</h3>
{/* Rating con estrellas más visual */}
<div className="rating">
<label>Tu calificación:</label>
<div className="estrellas">
{[5,4,3,2,1].map((num) => (
<span
key={num}
className={nuevaReseña.estrellas >= num ? "estrella activa" : "estrella"}
onClick={() => setNuevaReseña({...nuevaReseña, estrellas: num})}
>⭐</span>
))}
</div></div>
{/* Comentario */}
<div className="campo">
<label>Tu opinión</label>
<textarea
placeholder="Cuéntanos tu experiencia con el producto..."
value={nuevaReseña.comentario}
 onChange={(e) =>
setNuevaReseña({...nuevaReseña, comentario: e.target.value})
}/>
</div>
{/* Botones */}
<div className="acciones">
<button 
className="btn-cancelar"
onClick={() => setMostrarFormularioReseña(false)}>Cancelar</button>
<button 
className="btn-publicar"
onClick={guardarReseña}
disabled={!nuevaReseña.comentario}>Publicar reseña</button></div>
</div>
)}
</div>)}
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
{productoMasVendido && prod.nombre === productoMasVendido.nombre && (
<p className="mas-vendido"> Producto más vendido</p>)}
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
)))}
</section>)}
</div>
);
};

export default PanelComprador;