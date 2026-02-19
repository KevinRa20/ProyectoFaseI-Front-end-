import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Inventario.css"

const API_URL = "http://localhost:5000/api/inventario";

const Inventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    idProducto: "",
    nombreProducto: "",
    fechaCosecha: "",
    estado: "Disponible",
  });

  // READ
  const obtenerInventario = async () => {
    const res = await axios.get(API_URL);
    setInventarios(res.data);
  };

  useEffect(() => {
    obtenerInventario();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE & UPDATE
  const guardar = async (e) => {
    e.preventDefault();

    if (editandoId) {
      // UPDATE
      await axios.put(`${API_URL}/${editandoId}`, form);
      setEditandoId(null);
    } else {
      // CREATE
      await axios.post(API_URL, form);
    }

    obtenerInventario();
    limpiarFormulario();
  };

  // DELETE
  const eliminar = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    obtenerInventario();
  };

  // Cargar datos para editar
  const editar = (item) => {
    setForm({
      idProducto: item.idProducto,
      nombreProducto: item.nombreProducto,
      fechaCosecha: item.fechaCosecha.split("T")[0],
      estado: item.estado,
    });
    setEditandoId(item._id);
  };

  const limpiarFormulario = () => {
    setForm({
      idProducto: "",
      nombreProducto: "",
      fechaCosecha: "",
      estado: "Disponible",
    });
  };

  return (
    // ... dentro del return de Inventario.js
<div className="inventario-container">
  <div className="inventario-header">
    <h2>Registro de Inventario</h2>
    <p>Gestiona el control de tus productos y fechas de cosecha.</p>
  </div>

  <form className="inventario-form" onSubmit={guardar}>
    <div className="form-grid">
      <input name="idProducto" placeholder="ID Producto" onChange={handleChange} value={form.idProducto} required />
      <input name="nombreProducto" placeholder="Nombre del producto" onChange={handleChange} value={form.nombreProducto} required />
      <input type="date" name="fechaCosecha" onChange={handleChange} value={form.fechaCosecha} required />
      <select name="estado" onChange={handleChange} value={form.estado}>
        <option>Disponible</option>
        <option>Agotado</option>
        <option>En proceso</option>
      </select>
    </div>
    <div className="form-actions">
      <button type="submit" className="btn-save">
        {editandoId ? "Actualizar Producto" : "Agregar al Inventario"}
      </button>
      {editandoId && (
        <button type="button" className="btn-cancel" onClick={() => { limpiarFormulario(); setEditandoId(null); }}>
          Cancelar
        </button>
      )}
    </div>
  </form>

  <div className="table-wrapper">
    <table className="inventario-table">
      <thead>
        <tr>
          <th>ID Producto</th>
          <th>Nombre del Producto</th>
          <th>Fecha de Cosecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {inventarios.map((item) => (
          <tr key={item._id}>
            <td><strong>#{item.idProducto}</strong></td>
            <td>{item.nombreProducto}</td>
            <td>{item.fechaCosecha.split("T")[0]}</td>
            <td>
              <span className={`badge ${item.estado.toLowerCase().replace(" ", "-")}`}>
                {item.estado}
              </span>
            </td>
            <td className="actions-cell">
              <button className="btn-edit" onClick={() => editar(item)}>Editar</button>
              <button className="btn-delete" onClick={() => eliminar(item._id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default Inventario;