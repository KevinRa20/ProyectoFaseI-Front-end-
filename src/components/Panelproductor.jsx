import React, { useState, useEffect } from "react";
import "../style/Panelproductor.css";
import { useNavigate } from "react-router-dom";
import Inventario from "../pages/Inventario";
import Notificaciones from "../pages/Notificaciones"
import NotificacionesProductor from "../pages/NotificacionesProductor";
import Perfilproductor from "../components/Perfilproductor";
import Ingresosporcategoria from "../components/Ingresosporcategoria";

const PanelProductor = () => {
  const [vista, setVista] = useState("inicio");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarPlanes, setMostrarPlanes] = useState(false);
  const user = JSON.parse(localStorage.getItem("usuario")) || {};
  const plan = user.plan || "basic";
  const limiteProductos =
  plan === "basic" ? 5 :
  plan === "standard" ? 10 :
  Infinity;
//const totalOrdenes = ordenes.filter(o => o.estado === "aceptado").length;
const [perfil, setPerfil] = useState({
productor:"",
finca: "",
ubicacion: "",
telefono: "",
email: "",
tamano: "",
año: "",
descripcion: "",
  
});
const [nuevoProducto, setNuevoProducto] = useState({
nombre: "",
descripcion: "",
categoria: "",
region:"",
unidad: "",
precio: "",
stock: "",
imagen: ""
});
const eliminarProducto = (index) => {
const copia = [...productos];
copia.splice(index, 1);
setProductos(copia);
};

const editarProducto = (index) => {
setNuevoProducto(productos[index]);
setEditandoIndex(index);
setMostrarForm(true);
};
//Cambio de planes del productor
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
standard: "https://buy.stripe.com/test_7sY8wP1NR3q98Bo1aiawo03",
premium: "https://buy.stripe.com/test_9B64gzborf8R4l89GOawo05"
};
const link = paymentLinks[plan];
if (!link) {
alert("Plan no disponible");
return;}
//  Guardar plan pendiente (SIMULACIÓN)
localStorage.setItem("planPendiente", plan);
//  Redirigir a Stripe
window.location.href = link;
};
//Recibir notificaciones
useEffect(() => {
const data = JSON.parse(localStorage.getItem("notificaciones")) || [];
setNotificaciones(data);
}, []);
const notificacionesNoLeidas = notificaciones.filter(n => !n.leido).length;
  // cargar productos guardados
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("productos")) || [];
  setProductos(data);
  }, []);

  // guardar productos
  useEffect(() => {
  localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);
 const handleChange = (e) => {
  setNuevoProducto({
  ...nuevoProducto,
  [e.target.name]: e.target.value
});
  };
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("perfilProductor"));
  if (data) setPerfil(data);
}, []);

 useEffect(() => {
  localStorage.setItem("perfilProductor", JSON.stringify(perfil));
}, [perfil]);

useEffect(() => {
 const cargarOrdenes = () => {
const data = JSON.parse(localStorage.getItem("ordenes")) || [];
const ordenesProductor = data.filter(
o => o.productor === perfil.productor
);
setOrdenes(ordenesProductor);
};
cargarOrdenes();
const listener = () => {
cargarOrdenes();
};
window.addEventListener("ordenActualizada", listener);
return () => {
window.removeEventListener("ordenActualizada", listener);
};

}, [perfil.productor]);

useEffect(() => {
setProductos(prevProductos => {
return prevProductos.map(p => {
let vendido = 0;
let ingresos = 0;
ordenes.forEach(o => {
if (o.estado === "aceptado" && o.productos) {
o.productos.forEach(prod => {
if (prod.nombre === p.nombre) {
vendido += Number(prod.cantidad);
ingresos += Number(prod.cantidad) * Number(prod.precio);
}});
}
});
return { ...p, vendido, ingresos };
});});
}, [ordenes]);
const handleImage = (e) => {
const file = e.target.files[0];
const reader = new FileReader();
reader.onloadend = () => {
setNuevoProducto({ ...nuevoProducto, imagen: reader.result });
};
reader.readAsDataURL(file);
};

  const agregarProducto = () => {
  //  validacion del plan 
  if (editandoIndex === null && productos.length >= limiteProductos) {
  const confirmar = window.confirm(
  `Has alcanzado el límite de tu plan (${limiteProductos} productos).\n\n¿Deseas mejorar tu plan ahora?`
  );

if (confirmar) {
setMostrarPlanes(true);
  }
return;
}
  const productoConPerfil = {
    ...nuevoProducto,
    vendido: 0,
    ingresos: 0,
    finca: perfil.finca,
    productor: perfil.productor, 
    ubicacion: perfil.ubicacion
  };

  if (editandoIndex !== null) {
    const copia = [...productos];
    copia[editandoIndex] = productoConPerfil;
    setProductos(copia);
    setEditandoIndex(null);
  } else {
    setProductos([...productos, productoConPerfil]);
  }

  setNuevoProducto({
  nombre: "",
  descripcion: "",
  categoria: "",
  region: "",
  unidad: "",
  precio: "",
  stock: "",
  imagen: ""
  });

  setMostrarForm(false);
};

//Ingresos por productos
const ingresosPorProducto = Object.fromEntries(
productos.map(p => [p.nombre, Number(p.ingresos) || 0])
);
  // Calcular ingresos totales
//const ingresosTotales = productos.reduce((total, p) => {
// total + (Number(p.ingresos) || 0);
//}, 0);
//Calculo del total de productos vendidos
//const totalProductosVendidos = productos.reduce((total, p) => {
  //return total + (Number(p.vendido) || 0);
//}, 0);

return (
<div className="panel">
{mostrarPlanes && (
<div className="modal">
<div className="formulario">
<h2>Cambia tu plan</h2>
<button disabled={plan === "standard"} onClick={() => handleUpgrade("standard")}>
{plan === "standard" ? "Plan actual" : "Standard $9"}</button>
<button disabled={plan === "premium"} onClick={() =>handleUpgrade("premium")}>
{plan === "premium" ? "Plan actual" : "Premium $19"}</button>
<button onClick={() => setMostrarPlanes(false)}>Cerrar</button>
</div></div>
)}
<header className="header">
<div>
<h1>AGROCOMMERCE</h1>
<h2>Bienvenido, Has ingresado como productor</h2>
</div>
<button className="logout1"onClick={() => navigate("/login")}>Salir</button>
<button onClick={() => setMostrarPlanes(true)}>Cambiar Plan</button>
<img
className="icono-perfil"
src={"https://cdn-icons-png.flaticon.com/128/2550/2550260.png"}
alt="perfil"
onClick={() => setMostrarPerfil(true)}
style={{ cursor: "pointer" }}
/>
<div className="notificacion-container" onClick={() => setVista("pedidos")}>
<img
className="icono-notificaciones"
src="https://cdn-icons-png.flaticon.com/128/3239/3239952.png"
alt="icono-notificaciones"
/>
{notificacionesNoLeidas > 0 && (
<span className="badge-notificacion">
{notificacionesNoLeidas}
</span>

)}
</div>
</header>
<nav className="menu">
<button className="active"onClick={() => navigate("/panelproductor")}>Mis Ventas</button>
<button onClick={() => setMostrarForm(true)}>Mis Productos</button>
<button onClick={() => setVista("inventario")}>Inventario</button>
<button onClick={() => setVista("notificaciones")}>Notificaciones</button>
</nav>
{vista === "inventario" && <Inventario />}
{vista === "notificaciones" && <Notificaciones/>}
{vista === "pedidos" && <NotificacionesProductor />}

{/* FORMULARIO */}
{mostrarPerfil && (
<Perfilproductor
perfil={perfil}
setPerfil={setPerfil}
onClose={() => setMostrarPerfil(false)}/>
)}

{mostrarForm && (
<div className="modal">
<div className="formulario">
<h2>Nuevo Producto o Cosecha</h2>
<input name="nombre" placeholder="Nombre del Producto" value={nuevoProducto.nombre} onChange={handleChange} />
<textarea name="descripcion" placeholder="Descripción de tu producto y desde donde lo vendes" value={nuevoProducto.descripcion} onChange={handleChange}></textarea>
<select name="categoria" placeholder="Categoria" value={nuevoProducto.categoria} onChange={handleChange}>
<option>Seleccione la categoria</option>
<option>Hortalizas</option>
<option>Frutas</option>
<option>Verduras</option>
<option>Cereales</option>
<option>Lácteos</option>
<option>Raices</option> 
<option>Industriales</option>
<option>Otros</option>
</select>

<select name="unidad" value={nuevoProducto.unidad} onChange={handleChange}>
<option>Seleccione el tipo de venta</option>
<option>Kg</option>
<option>Caja o Saco</option>
<option>Unidad</option>
<option>Libra</option>
</select>

<select name="region" value={nuevoProducto.region} onChange={handleChange}>
<option>Seleccione la Region</option>
<option>Región Occidental</option>
<option>Región Noroccidental</option>
<option>Región Nororiental</option>
<option>Región Centro Occidental</option>
<option>Región Centro Oriental</option>
<option>Región Sur</option>
</select>
<input name="precio" type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={handleChange} />
<input name="stock" type="number" placeholder="Stock" value={nuevoProducto.stock} onChange={handleChange} />
<input type="file" accept="image/*" onChange={handleImage} />
<div className="acciones">
<button onClick={agregarProducto}>Guardar</button>
<button onClick={() => setMostrarForm(false)}>Cancelar</button>
</div></div></div>
)}
<section className="box">
<h2>Catálogo de Productos</h2>
<div className="catalogo">
{productos.map((p, index) => (
<div className="producto-card" key={index}>
<img src={p.imagen} alt={p.nombre} />

<div className="producto-info">
<h3>{p.nombre}</h3>
<span className="badge">{p.stock} {p.unidad}</span>
<p className="categoria">{p.categoria}</p>
<p>{p.descripcion}</p>
<div className="precio">
L.{p.precio} / {p.unidad}
</div>
<div className="acciones">
<button className="editar" onClick={() => editarProducto(index)}>Editar</button>
<button className="eliminar" onClick={() => eliminarProducto(index)}>Eliminar</button>
</div></div></div>
))}
</div>
</section>
<section className="cardsproductor">
<div className="card green">
<h3>Ingresos Totales</h3>
<p>L.{337}</p>
</div>
<div className="card blue">
<h3>Total Órdenes</h3>
<p>{10}</p>
</div>
<div className="card purple">
<h3>Productos Activos</h3>
<p>{productos.length}</p>
</div>
<div className="card orange">
<h3>Productos Vendidos</h3>
<p>{7}</p>
</div>
</section>

<section className="box">
<h2>Rendimiento por Producto</h2>
<table>
<thead>
<tr>
<th>Producto</th>
<th>Categoría</th>
<th>Vendido</th>
<th>Ingresos</th>
<th>Stock</th>
</tr>
</thead>
<tbody>
{productos.map((p, i) => (
<tr key={i}>
<td>{p.nombre}</td>
<td>{p.categoria}</td>
<td>{p.vendido}</td>
<td>L.{ingresosPorProducto[p.nombre] || 0}</td>
<td>
<span className={`badge ${p.stock < 5 ? 'low-stock' : ''}`}>
{p.stock} {p.unidad}
</span>
</td>
</tr>
))}
</tbody>
</table>
</section>
<Ingresosporcategoria productos={productos} />
</div>);};

export default PanelProductor