import React, { useState } from "react";
import "./Completarperfil.css";

function CompletarPerfil() {
  const [form, setForm] = useState({
    userId: "",
    residencia: "",
    direccion: "",
    telefono: "",
    rol: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/perfil/completarperfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      alert(data.msg);

      if (res.ok) {
        setForm({
          userId: "",
          residencia: "",
          direccion: "",
          telefono: "",
          rol: ""
        });
      }

    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Completa Tu Perfil</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Numero de Identidad</label>
            <input
              type="text"
              name="userId"
              placeholder="Número de identidad"
              value={form.userId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Residencia</label>
            <input
              type="text"
              name="residencia"
              placeholder="Ciudad o departamento"
              value={form.residencia}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección exacta"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              placeholder="Número de teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rol</label>
            <select name="rol" value={form.rol} onChange={handleChange} required>
              <option value="">Seleccione un rol</option>
              <option value="productor">Productor</option>
              <option value="comprador">Comprador</option>
            </select>
          </div>

          <button type="submit">Guardar Perfil</button>
        </form>
      </div>
    </div>
  );
}

export default CompletarPerfil;