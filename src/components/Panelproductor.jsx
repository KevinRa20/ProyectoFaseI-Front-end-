import React, { useState, useEffect } from "react";
import "../style/Panelproductor.css";
import { useNavigate } from "react-router-dom";
import Inventario from "../pages/Inventario";
import Notificaciones from "../pages/Notificaciones"
import Chat from "../pages/Chat";

const PanelProductor = () => {
  const [vista, setVista] = useState("inicio");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

const usuario = "productor"; 

const [perfil, setPerfil] = useState({
  productor:"",
  finca: "",
  ubicacion: "",
  telefono: "",
  email: "",
  tamano: "",
  año: "",
  descripcion: "",
  imagen: ""
});
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    categoria: "Hortalizas",
    region:"Noroccidental",
    unidad: "kg",
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

const handlePerfilImage = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    setPerfil({ ...perfil, imagen: reader.result });
  };
  reader.readAsDataURL(file);
};
  const agregarProducto = () => {
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
    categoria: "Hortalizas",
    region: "Noroccidental",
    unidad: "kg",
    precio: "",
    stock: "",
    imagen: ""
  });

  setMostrarForm(false);
};
  return (
<div className="panel">

<header className="header">
<div>
<h1>Agro Commerce</h1>
<h2>Bienvenido, Has ingresado como productor</h2>
</div>
<button className="logout"onClick={() => navigate("/login")}>Salir</button>
<img
  className="icono-perfil"
  src={perfil.imagen || "https://cdn-icons-png.flaticon.com/128/2550/2550260.png"}
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
</header>
<nav className="menu">
<button className="active"onClick={() => navigate("/panelproductor")}>Análisis de Ventas</button>
<button onClick={() => setMostrarForm(true)}>Mis Productos</button>
<button onClick={() => setVista("inventario")}>Inventario</button>
<button onClick={() => setVista("notificaciones")}>Notificaciones</button>
</nav>
{vista === "inventario" && <Inventario />}
{vista === "notificaciones" && <Notificaciones/>}
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

 <input type="file" accept="image/*" onChange={handlePerfilImage} />

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
<option>Occidental</option>
<option>Noroccidental</option>
<option>Nororiental</option>
<option>Centro Occidental</option>
<option>Centro Oriental</option>
<option>Centro Sur</option>
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
<p>L.{productos.reduce((a,b)=>a+b.ingresos,0)}</p>
</div>
<div className="card blue">
<h3>Total Órdenes</h3>
<p>0</p>
</div>
<div className="card purple">
<h3>Productos Activos</h3>
<p>{productos.length}</p>
</div>
<div className="card orange">
<h3>Ticket Promedio</h3>
<p>L.0.00</p>
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
<th>Calificación</th>
</tr>
</thead>
<tbody>
{productos.map((p, i) => (
<tr key={i}>
<td>{p.nombre}</td>
<td>{p.categoria}</td>
<td>{p.vendido}</td>
<td>L.{p.ingresos}</td>
<td>{p.stock} {p.unidad}</td>
<td>⭐ N/A</td>
</tr>
))}
</tbody>
</table>
</section>

<section className="box">
<h2>Ingresos por Categoría</h2>
{productos.map((p,i)=>(
<div key={i}>{p.categoria} - L.{p.ingresos}</div>

))}
</section>
<section className="box"> <h2>Órdenes Recientes</h2> 
<div className="empty">No hay órdenes recientes</div> 
</section>
</div>
 

  );
};

export default PanelProductor;