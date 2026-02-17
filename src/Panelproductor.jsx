import React, { useState } from "react";
import "./Panelproductor.css";
import { useNavigate } from "react-router-dom";
import Inventario from "./Inventario";
import Notificaciones from "./Notificaciones";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [vista, setVista] = useState("inicio"); 

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    tipoventa: "",
    location: "",
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
    console.log("Buscando:", e.target.value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProducts([...products, formData]);
    setFormData({
      image: null,
      name: "",
      description: "",
      price: "",
      quantity: "",
      tipoventa: "",
      location: "",
    });
    setShowForm(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");

  };
   
  return (
<div className="dashboard-container">
{/* Barra superior */}
<header className="top-bar">
 <h2>Agro Commerce</h2>

{/* Buscador */}
<input
type="text"
placeholder="Buscador"
value={search}
onChange={handleSearch}
className="search-input"
/>
{/* Perfil */}
<div className="profile-container">
<img
src="https://cdn-icons-png.flaticon.com/128/2550/2550260.png"
alt="Perfil"
className="profile-icon"
onClick={() => setMenuOpen(!menuOpen)}
/>

{menuOpen && (
<div className="dropdown-menu">
<button onClick={() => setVista("inicio")}>
Inicio </button>
<button onClick={() => setShowForm(true)}>
Publicar un producto</button>

<button onClick={() => setVista("inventario")}>
Inventario
</button>
<button onClick={() => setVista("notificaciones")}>Notificaciones</button>
<button>Compras</button>
<button>Ventas</button>
<button>Chats</button>
<hr />
<button className="loginout" onClick={handleLogout}>Cerrar Sesión</button>
<button className="delete">Eliminar cuenta</button>
</div>
 )}
</div></header>

{/* Modal registrar producto */}
  {showForm && (
  <div className="modal">
  <div className="modal-content">
  <h3>Publica un producto</h3>

  <form onSubmit={handleSubmit}>
  <input type="file" onChange={handleImageChange} required />

  <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
  <input name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required />
  <input name="price" type="number" placeholder="Precio" value={formData.price} onChange={handleChange} required />
  <input name="quantity" type="number" placeholder="Cantidad" value={formData.quantity} onChange={handleChange} required />
  <input name="tipoventa" placeholder="Tipo de venta" value={formData.tipoventa} onChange={handleChange} required />
  <input name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} required />

<div className="modal-buttons">
<button type="submit">Guardar Producto</button>
<button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
</div>
</form>
</div>
</div>
)}

{/* CONTENIDO CENTRAL */}
<main className="main-content">
{vista === "inicio" && (
<>
<h3>Bienvenido a tu panel</h3>
<p>Use el buscador o el menú para gestionar sus productos.</p>

<h3>Productos Disponibles</h3>
<div className="product-grid">
{products.map((product, index) => (
<div className="product-card" key={index}>
<img src={product.image} alt="producto" />
<h4>{product.name}</h4>
<p>Descripción: {product.description}</p>
<p>Precio: L. {product.price}</p>
<p>Cantidad: {product.quantity}</p>
<p>Tipo de Venta: {product.tipoventa}</p>
<p>Ubicación: {product.location}</p>
</div>
))}
</div>
</>
)}
{vista === "notificaciones" && <Notificaciones />}
{vista === "inventario" && <Inventario />}
</main>
</div>
  );
};

export default Dashboard;