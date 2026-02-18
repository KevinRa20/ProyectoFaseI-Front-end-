import React, { useState, useEffect } from "react";
import "./Panelproductor.css";
import { useNavigate } from "react-router-dom";

const PanelProductor = () => {
  const [filtro, setFiltro] = useState("semana");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    categoria: "Hortalizas",
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

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNuevoProducto({ ...nuevoProducto, imagen: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const agregarProducto = () => {
  if (editandoIndex !== null) {
    const copia = [...productos];
    copia[editandoIndex] = nuevoProducto;
    setProductos(copia);
    setEditandoIndex(null);
  } else {
    setProductos([...productos, { ...nuevoProducto, vendido: 0, ingresos: 0 }]);
  }

  setNuevoProducto({
    nombre: "",
    descripcion: "",
    categoria: "Hortalizas",
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
<button className="logout" onClick={() => navigate("/login")}>Salir</button>
</header>

<nav className="menu">
<button className="active">Análisis de Ventas</button>
<button onClick={() => setMostrarForm(true)}>Mis Productos</button>
<button>Inventario</button>
<button>Notificaciones</button>
</nav>

{/* FORMULARIO */}
{mostrarForm && (
<div className="modal">
<div className="formulario">
<h2>Nuevo Producto</h2>

<input name="nombre" placeholder="Nombre del Producto" value={nuevoProducto.nombre} onChange={handleChange} />
<textarea name="descripcion" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={handleChange}></textarea>
<select name="categoria" value={nuevoProducto.categoria} onChange={handleChange}>
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
<option>Kg</option>
<option>Caja o Saco</option>
<option>Unidad</option>
<option>Libra</option>
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
<section className="cards">
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
</div>
  );
};

export default PanelProductor;