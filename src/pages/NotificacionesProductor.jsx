import React, { useEffect, useState } from "react";
import "../style/NotificacionesProductor.css";

const NotificacionesProductor = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notificaciones")) || [];
    setPedidos(data);
  }, []);

  const marcarLeido = (id) => {
    const actualizados = pedidos.map(p =>
      p.id === id ? { ...p, leido: true } : p
    );
    setPedidos(actualizados);
    localStorage.setItem("notificaciones", JSON.stringify(actualizados));
  };

  return (
  <div className="notificaciones-wrapper">
  <div className="notificaciones-container">
  <header className="notificaciones-header">
  <h2>Panel de Pedidos</h2>
  <span className="badge-count">
  {pedidos.filter(p => !p.leido).length} Pendientes
  </span>
  </header>

<div className="pedidos-list">
{pedidos.length === 0 ? (
<div className="empty-state">
<p>No tienes pedidos nuevos por ahora.</p>
</div>
) : (
pedidos.map((p) => (
<div key={p.id} className={`pedido-card ${!p.leido ? "nuevo" : "leido"}`}>
<div className="pedido-header">
<div className="title-group">
<h3>Pedido #{p.id.toString().slice(-4)}</h3>
{!p.leido && <span className="status-tag">Nuevo</span>}
</div>
<span className="pedido-fecha">{p.fecha}</span>
</div>

<div className="pedido-body">
<section className="info-seccion">
<h4>Datos del Comprador</h4>
<div className="grid-info">
<p><strong>Nombre:</strong> {p.comprador.nombre}</p>
<p><strong>Teléfono:</strong> {p.comprador.telefono}</p>
<p><strong>Ubicación:</strong> {p.comprador.residencia}</p>
<p><strong>Tipo:</strong> <span className="user-type">{p.comprador.tipo}</span></p>
</div>
</section>

<section className="info-seccion">
<h4>Resumen de Productos</h4>
<div className="productos-mini-list">
{p.productos.map((prod, i) => (
<div key={i} className="producto-item">
<span>{prod.nombre} x {prod.cantidad}</span>
<span className="precio-tag">L.{prod.precio}</span>
<span className="resumencompra">L.{prod.totalcompra}</span>
</div>
 ))}
</div>
</section>
</div>
<div className="pedido-footer">
{!p.leido ? (
<button className="btn-marcar" onClick={() => marcarLeido(p.id)}>Aceptar Pedido</button>
) : (
<span className="gestionado-check">✓ Aceptado</span>
)}
</div>
</div>
))
)}
</div>
</div>
</div>
  );
};

export default NotificacionesProductor;