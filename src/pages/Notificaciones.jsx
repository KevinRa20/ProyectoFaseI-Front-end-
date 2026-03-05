import React, { useState } from "react";
import axios from "axios";
import "../style/Notificaciones.css";

const Notificaciones = () => {

  const [form, setForm] = useState({
    productor:"",
    producto: "",
    mensaje: "",
    comprador: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const enviarNotificacion = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!form.productor ||!form.producto || !form.mensaje || !form.comprador) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/notificaciones", {
        ...form,
        fecha: new Date()
      });

      setSuccess("✅ Notificación enviada correctamente");
      setForm({ productor:"",producto: "", mensaje: "", comprador: "" });

    } catch (err) {
      console.error(err);
      setError("❌ Error al enviar la notificación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notificaciones-wrapper">
      <div className="notificaciones-card">

        <div className="notificaciones-header">
          <div className="icon-circle">🌽</div>
          <h2>Enviar Notificación</h2>
          <p>Anuncia nuevas cosechas o actualizaciones a tus clientes.</p>
        </div>

        <form className="notificaciones-form" onSubmit={enviarNotificacion}>

          {/* MENSAJES */}
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          
          <div className="input-group">
            <label>Tu Nombre o Correo</label>
            <input
              type="text"
              name="productor"
              placeholder="Juan Pérez o juan@gmail.com"
              value={form.productor}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Producto Relacionado</label>
            <input
              type="text"
              name="producto"
              placeholder="Ej: Maíz Dulce, Café Especial..."
              value={form.producto}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Destinatario (correo del comprador)</label>
            <input
              type="email"
              name="comprador"
              placeholder="ejemplo@gmail.com"
              value={form.comprador}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Mensaje Personalizado</label>
            <textarea
              name="mensaje"
              placeholder="Escribe los detalles aquí..."
              value={form.mensaje}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-send" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Notificación"}
            {!loading && (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Notificaciones;