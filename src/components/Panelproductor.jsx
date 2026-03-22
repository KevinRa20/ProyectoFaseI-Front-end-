import React, { useState, useEffect } from "react";
import "../style/Panelproductor.css";
import { useNavigate } from "react-router-dom";
import Inventario from "../pages/Inventario";
import Notificaciones from "../pages/Notificaciones"
import NotificacionesProductor from "../pages/NotificacionesProductor";
import Chat from "../pages/Chat";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend} from "chart.js";
import { Bar,  } from "react-chartjs-2";
ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Tooltip,
Legend
);

const PanelProductor = () => {
  const [vista, setVista] = useState("inicio");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const plan = localStorage.getItem("plan") || "basic";
  const limiteProductos =
  plan === "basic" ? 5 :
  plan === "standard" ? 10 :
  Infinity;
const usuario = "productor"; 
const totalOrdenes = ordenes.length;
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
  if (ordenes.length === 0) return;

  setProductos(prevProductos => {

    return prevProductos.map(p => {

      let vendido = 0;
      let ingresos = 0;

      ordenes.forEach(o => {
        if (o.producto === p.nombre && o.estado === "aceptado") {
          vendido += Number(o.cantidad);
          ingresos += Number(o.cantidad) * Number(o.precio);
        }
      });

      return {
         ...p,
  vendido,
  ingresos
      };

    });

  });

}, [ordenes]);

  const handleImage = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
  setNuevoProducto({ ...nuevoProducto, imagen: reader.result });
    };
    reader.readAsDataURL(file);
  };
 const handlePerfilChange = (e) => {
  setPerfil({ ...perfil, [e.target.name]: e.target.value });
};

  const agregarProducto = () => {
  //  VALIDACIÓN DE PLAN
  if (editandoIndex === null && productos.length >= limiteProductos) {
    alert(`Has alcanzado el límite de tu plan (${limiteProductos} productos). Actualiza tu plan para seguir publicando.`);
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
 // Calcular ingresos por categoría
const ingresosPorCategoria = productos.reduce((acc, producto) => {
  const categoria = producto.categoria || "Sin categoría";
  const ingresos = Number(producto.ingresos) || 0;

  acc[categoria] = (acc[categoria] || 0) + ingresos;

  return acc;
}, {});
const categoriasOrdenadas = Object.entries(ingresosPorCategoria)
.sort((a,b) => b[1] - a[1]);
const dataCategorias = {
labels: categoriasOrdenadas.map(c => c[0]),
datasets: [
{
label: "Ingresos por Categoría (L.)",
data: categoriasOrdenadas.map(c => c[1]),
backgroundColor: [
"#4CAF50",
"#FF9800",
"#2196F3",
"#9C27B0",
"#E91E63",
"#795548",
"#00BCD4",
"#8BC34A"
],
borderRadius: 12,
barThickness: 40
}
]
};
const opcionesCategorias = {
responsive: true,
maintainAspectRatio: false,
indexAxis: "y",
plugins: {
legend: {
display: false
},
tooltip: {
callbacks: {
label: function(context) {
return `L. ${context.raw.toLocaleString()}`;
}}}},
scales: {
x: {
ticks: {
callback: function(value) {
return "L. " + value.toLocaleString();
},
font: {
size: 14
}}},
y: {
ticks: {
font: {
size: 14}}}}};
//Ingresos por productos
const ingresosPorProducto = Object.fromEntries(
  productos.map(p => [p.nombre, Number(p.ingresos) || 0])
);
  // Calcular ingresos totales
  const ingresosTotales = productos.reduce((total, p) => {
   return total + (Number(p.ingresos) || 0);
}, 0);
//Calculo del total de productos vendidos
const totalProductosVendidos = productos.reduce((total, p) => {
  return total + (Number(p.vendido) || 0);
}, 0);
// MODULO IA: ANALISIS DE PRODUCTOS

// ordenar productos por cantidad vendida
const productosMasVendidos = [...productos]
.sort((a,b) => (b.vendido || 0) - (a.vendido || 0))
.slice(0,5);
// Datos para grafica productos mas vendidos
const dataProductosVendidos = {
labels: productosMasVendidos.map(p => p.nombre),
datasets: [
{
label: "Cantidad Vendida",
data: productosMasVendidos.map(p => p.vendido || 0),
backgroundColor: "#4CAF50"
}
]
};
// recomendación simple de IA
let recomendacionIA = "";

if(productosMasVendidos.length > 0){
  recomendacionIA = `Tu producto más demandado es ${productosMasVendidos[0].nombre}. 
  Considera aumentar el stock para aprovechar la demanda.`;
}else{
  recomendacionIA = "Aún no hay suficientes ventas para generar recomendaciones.";
}

  return (
<div className="panel">

<header className="header">
<div>
<h1>Agro Commerce</h1>
<h2>Bienvenido, Has ingresado como productor</h2>
</div>
<button className="logout1"onClick={() => navigate("/login")}>Salir</button>
<img
  className="icono-perfil"
  src={"https://cdn-icons-png.flaticon.com/128/2550/2550260.png"}
  alt="perfil"
  onClick={() => setMostrarPerfil(true)}
  style={{ cursor: "pointer" }}
/>
<img
  className="icono-mensajes"
  src="https://cdn-icons-png.flaticon.com/128/876/876221.png"
  alt="icono-mensajes"
  onClick={() => setVista("chat")}
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
<button className="active"onClick={() => navigate("/panelproductor")}>Análisis de Ventas</button>
<button onClick={() => setMostrarForm(true)}>Mis Productos</button>
<button onClick={() => setVista("inventario")}>Inventario</button>
<button onClick={() => setVista("notificaciones")}>Notificaciones</button>
</nav>
{vista === "inventario" && <Inventario />}
{vista === "notificaciones" && <Notificaciones/>}
{vista === "pedidos" && <NotificacionesProductor />}
{vista === "chat" && <Chat usuario={usuario} />}

{/* FORMULARIO */}
{mostrarPerfil && (
<div className="modal">
<div className="formulario perfil-form">
<h2>Completa Tu Perfil</h2>
<input name="productor" placeholder="Nombre completo" value={perfil.productor} onChange={handlePerfilChange} />
<input name="finca" placeholder="Nombre de la Finca" value={perfil.finca} onChange={handlePerfilChange} />
<input name="ubicacion" placeholder="Ubicación" value={perfil.ubicacion} onChange={handlePerfilChange} />
<input name="telefono" placeholder="Teléfono" value={perfil.telefono} onChange={handlePerfilChange} />
<input name="email" placeholder="Email" value={perfil.email} onChange={handlePerfilChange} />
<input name="tamano" placeholder="Tamaño de la finca (ej: 50 ha)" value={perfil.tamano} onChange={handlePerfilChange} />
<input name="año" placeholder="Año de establecimiento" value={perfil.año} onChange={handlePerfilChange} />
<textarea name="descripcion" placeholder="Describe tu finca" value={perfil.descripcion} onChange={handlePerfilChange}></textarea>


<div className="acciones">
<button onClick={() => setMostrarPerfil(false)}>Guardar</button>
<button onClick={() => setMostrarPerfil(false)}>Cerrar</button>
</div>
</div>
</div>
    
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
</div>
</div>
</div>
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
</div>
</div>
</div>
))}
</div>
</section>
<section className="cardsproductor">
<div className="card green">
<h3>Ingresos Totales</h3>
<p>L.{ingresosTotales }</p>
</div>
<div className="card blue">
<h3>Total Órdenes</h3>
<p>{totalOrdenes}</p>
</div>
<div className="card purple">
<h3>Productos Activos</h3>
<p>{productos.length}</p>
</div>
<div className="card orange">
<h3>Productos Vendidos</h3>
<p>{totalProductosVendidos}</p>
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

<section className="box">
<h2>Ingresos por Categoría</h2>
{Object.keys(ingresosPorCategoria).length === 0 ? (
<div className="empty">No hay ingresos por categoría</div>
) : (
<>
<div style={{width:"900px",height:"450px", margin:"auto"}}>
<Bar data={dataCategorias} options={opcionesCategorias}/>
</div>

<div style={{marginTop:"15px"}}>
{Object.entries(ingresosPorCategoria).map(([cat,total],i)=>(
<div key={i}>
<strong>{cat}</strong> : L.{total}
</div>
))}
</div>
</>
)}
</section>
<section className="box">
<h2> Productos Más Vendidos</h2>
{productosMasVendidos.length === 0 ? (
<div className="empty">No hay datos suficientes</div>
) : (
<div style={{width:"600px",height:"450px", margin:"auto"}}>
<Bar data={dataProductosVendidos} />
</div>
)}

<p style={{marginTop:"10px", fontStyle:"italic"}}>
{recomendacionIA}
</p>

</section>
<section className="box">
<h2>Órdenes Recientes</h2>
{ordenes.length === 0 ? (
<div className="empty">No hay órdenes recientes</div>
) : (
ordenes.map((o, i) => (
<div key={i}>
{o.producto} - {o.cantidad} x L.{o.precio} = L.{o.precio * o.cantidad}
</div>
))
)}
</section>
</div>
  );
};

export default PanelProductor