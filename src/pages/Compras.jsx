import React, { useState, useEffect } from "react";
import "../style/Compras.css";

 const Compras = ({ vista, setVista, productoSeleccionado, setProductoSeleccionado }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [resumenCompra, setResumenCompra] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [datosComprador, setDatosComprador] = useState({
    nombre: "",
    residencia: "",
    direccion: "",
    telefono: "",
    tipo: ""
  });

  useEffect(() => {
    const historialGuardado = JSON.parse(localStorage.getItem("historialCompras")) || [];
    setHistorial(historialGuardado);
  }, []);

  useEffect(() => {
    if (productoSeleccionado) {
      setMostrarFormulario(true);
    }
  }, [productoSeleccionado]);

  const agregarAlCarrito = () => {
    const total = cantidad * productoSeleccionado.precio;

    const nuevoItem = {
      ...productoSeleccionado,
      cantidad,
      total,
      comprador: datosComprador
    };

    setCarrito([...carrito, nuevoItem]);
    setMostrarFormulario(false);
    setCantidad(1);
    setProductoSeleccionado(null);
    alert("El producto se agregó al carrito correctamente");
  };

  const finalizarCompra = () => {
    const fecha = new Date().toLocaleString();
    const totalCompra = carrito.reduce((acc, item) => acc + item.total, 0);

    const resumen = {
      id: Date.now(),
      comprador: carrito[0].comprador.nombre,
      productos: carrito,
      totalCompra,
      fecha,
      estado: "En proceso"
    };

    const nuevoHistorial = [...historial, resumen];
    setHistorial(nuevoHistorial);
    localStorage.setItem("historialCompras", JSON.stringify(nuevoHistorial));

    setResumenCompra(resumen);
    setCarrito([]);
    setVista("resumen");
  };

  const cambiarEstado = (id, nuevoEstado) => {
    const actualizado = historial.map(p =>
      p.id === id ? { ...p, estado: nuevoEstado } : p
    );
    setHistorial(actualizado);
    localStorage.setItem("historialCompras", JSON.stringify(actualizado));
  };

  return (
    <>
{vista === "carrito" && (
<div className="carrito">
<h2>Detalle de la Compra</h2>
{carrito.map((item, i) => (
<div key={i}>
<p>{item.nombre}</p>
<p>Cantidad: {item.cantidad}</p>
<p>Total: L.{item.total}</p>
</div>
))}
<button onClick={finalizarCompra}>Finalizar compra</button>
<button onClick={() => setVista("productos")}>Volver</button>
</div>
      )}

{vista === "resumen" && resumenCompra && (
<div>
<h2>Resumen</h2>
<p>Comprador: {resumenCompra.comprador}</p>
<p>Total: L.{resumenCompra.totalCompra}</p>
<button onClick={() => setVista("productos")}>Volver</button>
</div>
)}


{vista === "historial" && (
<div className="historial-container">
<h2>Historial de Compras</h2>
{historial.map(pedido => (
<div key={pedido.id} className="pedido-card">
<div className="pedido-info">
<strong>L.{pedido.totalCompra}</strong>
<span>{pedido.fecha}</span>
</div>
<div className="pedido-status">
<select value={pedido.estado} onChange={(e) => cambiarEstado(pedido.id, e.target.value)}>
<option>En proceso</option>
<option>Entregado</option>
<option>Finalizado</option>
</select>
</div>
</div>
))}
<button className="btn-secundario" onClick={() => setVista("productos")}>Volver a la tienda</button>
</div>
)}

{mostrarFormulario && (
 <div className="modal">
<div className="modal-content">
<h2>Deja tus datos para el productor</h2>
<input placeholder="Nombre"
onChange={e => setDatosComprador({ ...datosComprador, nombre: e.target.value })} />
<input placeholder="Residencia"
onChange={e => setDatosComprador({ ...datosComprador, residencia: e.target.value })} />
<input placeholder="Dirección"
onChange={e => setDatosComprador({ ...datosComprador, direccion: e.target.value })} />
<input placeholder="Teléfono"
onChange={e => setDatosComprador({ ...datosComprador, telefono: e.target.value })} />
<select value={datosComprador.tipo}onChange={e =>setDatosComprador({
...datosComprador,
tipo: e.target.value
})
}
>
<option value="">Tipo de consumidor</option>
<option value="Persona consumidor">Persona consumidora</option>
<option value="Restaurante">Restaurante</option>
<option value="Supermercado">Supermercado</option>
<option value="Tienda">Tienda</option>
<option value="Otros">Otros</option>
</select>

<input type="number" min="1" value={cantidad}
onChange={e => setCantidad(e.target.value)} />
<button onClick={agregarAlCarrito}>Confirmar compra</button>
<button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
</div>
</div>
)}
    </>
  );
};

export default Compras;