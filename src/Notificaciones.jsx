// Notificaciones.js
import React, { useState } from "react";
import axios from "axios";
import "./Notificaciones.css"; // ¡No olvides importar el CSS!

const Notificaciones = () => {
  const [form, setForm] = useState({
    producto: "",
    mensaje: "",
    comprador: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviarNotificacion = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/notificaciones", form);
      alert("Notificación enviada correctamente ✅");
      setForm({ producto: "", mensaje: "", comprador: "" });
    } catch (error) {
      alert("Error al enviar notificación ❌");
      console.error(error);
    }
  };

  return (
    <div className="notificaciones-wrapper">
      <div className="notificaciones-card">
        <div className="notificaciones-header">
          <div className="icon-circle">
            <span role="img" aria-label="corn">🌽</span>
          </div>
          <h2>Enviar Notificación</h2>
          <p>Anuncia nuevas cosechas o actualizaciones a tus clientes.</p>
        </div>

        <form className="notificaciones-form" onSubmit={enviarNotificacion}>
          <div className="input-group">
            <label>Producto Relacionado</label>
            <input
              type="text"
              name="producto"
              placeholder="Ej: Maíz Dulce, Café Especial..."
              value={form.producto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Destinatario</label>
            <input
              type="text"
              name="comprador"
              placeholder="Correo o ID del comprador"
              value={form.comprador}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mensaje Personalizado</label>
            <textarea
              name="mensaje"
              placeholder="Escribe los detalles de la notificación aquí..."
              value={form.mensaje}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-send">
            <span>Enviar Notificación</span>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notificaciones;