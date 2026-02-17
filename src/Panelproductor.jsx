import React, { useState } from "react";
import "./Panelproductor.css";

const PanelProductor = () => {
  const [filtro, setFiltro] = useState("semana");

  return (
    <div className="panel">

      <header className="header">
        <div>
          <h1>Panel de Productor</h1>
          <h2>Bienvenido</h2>
        </div>
        <button className="logout">Cerrar Sesión</button>
      </header>

      <nav className="menu">
        <button className="active">Análisis de Ventas</button>
        <button>Mis Productos</button>
        <button>Inventario</button>
        <button>Notificaciones</button>
      </nav>

      <section className="dashboard-header">
        <h2>Dashboard de Ventas</h2>
        <div className="filtros">
          <button className={filtro==="semana"?"activo":""} onClick={()=>setFiltro("semana")}>Semana</button>
          <button className={filtro==="mes"?"activo":""} onClick={()=>setFiltro("mes")}>Mes</button>
          <button className={filtro==="año"?"activo":""} onClick={()=>setFiltro("año")}>Año</button>
        </div>
      </section>

      <section className="cards">
        <div className="card green">
          <h3>Ingresos Totales</h3>
          <p>L.0.00</p>
        </div>
        <div className="card blue">
          <h3>Total Órdenes</h3>
          <p>0</p>
        </div>
        <div className="card purple">
          <h3>Productos Activos</h3>
          <p>0</p>
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
            <tr>
              <td colSpan="6" className="empty">No hay datos de ventas para mostrar</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="box">
        <h2>Ingresos por Categoría</h2>
        <div className="empty">No hay datos de categorías</div>
      </section>

      <section className="box">
        <h2>Órdenes Recientes</h2>
        <div className="empty">No hay órdenes recientes</div>
      </section>

    </div>
  );
};

export default PanelProductor;