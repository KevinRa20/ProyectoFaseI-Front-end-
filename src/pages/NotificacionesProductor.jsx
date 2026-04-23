import React, { useEffect, useState } from "react";
import "../style/NotificacionesProductor.css";

const NotificacionesProductor = () => {
const [pedidos, setPedidos] = useState([]);
const [mostrarLogistica, setMostrarLogistica] = useState(null);
const [formVisible, setFormVisible] = useState(null);
const [formTransporte, setFormTransporte] = useState({
  nombre: "",
  producto: "",
  telefono: "",
  tipoTransporte: "",
  fechaInicio: "",
  fechaEntrega: "",
  horaEntrega: ""
});

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
const aceptarPedido = (id) => {

  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

  const nuevasOrdenes = ordenes.map(o => {
    if (o.id === id) {
      return { ...o, estado: "aceptado" };
    }
    return o;
  });

  localStorage.setItem("ordenes", JSON.stringify(nuevasOrdenes));
   window.dispatchEvent(new Event("ordenActualizada"));

};
const contactarWhatsApp = (telefono, nombre, id) => {
  const mensaje = `Hola ${nombre}, soy el productor. Estoy contactándote sobre tu pedido #${id}.`;
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
};
const enviarSolicitudTransporte = (pedido) => {
  const envios = JSON.parse(localStorage.getItem("envios")) || [];

  const nuevoEnvio = {
    id: Date.now(),
    pedidoId: pedido.id,
    ...formTransporte,
    estado: "Pendiente"
  };

  envios.push(nuevoEnvio);
  localStorage.setItem("envios", JSON.stringify(envios));

  alert("Solicitud Enviada correctamente. Te contactaremos para el seguimiento de tu pedido");

  // Reset estados
  setFormVisible(null);
  setMostrarLogistica(null);

  setFormTransporte({
    nombre: "",
    producto: "",
    telefono: "",
    tipoTransporte: "",
    fechaInicio: "",
    fechaEntrega: "",
    horaEntrega: ""
  });
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
</div>
 ))}
</div>
</section>
</div>
<div className="pedido-footer">
{!p.leido ? (
<button
className="btn-marcar"
onClick={() => {
marcarLeido(p.id);
aceptarPedido(p.id);
setMostrarLogistica(p.id);
}}>Aceptar Pedido</button>
) : (
<div className="acciones-pedido">
<span className="gestionado-check">✓ Aceptado</span>
{mostrarLogistica === p.id && (
<div className="logistica-box">
<p>¿Deseas solicitar un servicio de transporte para este pedido?</p>
<button className="btn-logistica"  onClick={() => setFormVisible(p.id)}>Solicitar Transporte</button>
<button className="btn-skip" onClick={() => setMostrarLogistica(null)}>Omitir</button>
</div>
)}
{formVisible === p.id && (
<div className="form-logistica">
<h4>Solicitud de Transporte</h4>

<input
type="text"
placeholder="Nombre"
value={formTransporte.nombre}
onChange={(e) =>
setFormTransporte({ ...formTransporte, nombre: e.target.value })
} />

<input
type="text"
placeholder="Nombre del producto"
value={formTransporte.producto}
onChange={(e) =>
setFormTransporte({ ...formTransporte, producto: e.target.value })}
/>

<input
type="text"
placeholder="Teléfono"
value={formTransporte.telefono}
onChange={(e) =>
setFormTransporte({ ...formTransporte, telefono: e.target.value })}
/>
<select
value={formTransporte.tipoTransporte}
onChange={(e) =>
setFormTransporte({ ...formTransporte, tipoTransporte: e.target.value })}>
<option value="">Tipo de transporte</option>
<option value="Camión">Camión</option>
<option value="Motocarga">Motocarga</option>
<option value="Pickup">Pickup</option>
</select>

<input
type="date"
value={formTransporte.fechaInicio}
onChange={(e) =>
setFormTransporte({ ...formTransporte, fechaInicio: e.target.value })
}
/>

<input
type="date"
value={formTransporte.fechaEntrega}
onChange={(e) =>
setFormTransporte({ ...formTransporte, fechaEntrega: e.target.value })
}
/>

<input
type="time"
value={formTransporte.horaEntrega}
onChange={(e) =>
setFormTransporte({ ...formTransporte, horaEntrega: e.target.value })
}/>

<button
className="btn-enviar"
onClick={() => enviarSolicitudTransporte(p)}>Enviar Solicitud</button>
</div>
)}
<button
className="btn-whatsapp"
onClick={() =>
contactarWhatsApp(
p.comprador.telefono,
p.comprador.nombre,
p.id
)
}>Contactar por WhatsApp
</button>
</div>
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