import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rol: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuario registrado correctamente");
        setForm({ name: "", email: "", password: "", rol: "" });
        navigate("/login");
      } else {
        alert(data.msg || "Error al registrar usuario");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
<div className="register-container">
<div className="register-card">
<img
className="icono-registro"
src="https://cdn-icons-png.flaticon.com/128/7542/7542074.png"
alt="icono-registro"
        />
<h2>Registro de Usuario</h2>
<form onSubmit={handleSubmit}>
<div className="form-group">
<label>Nombre</label>
<input
type="text"
name="name"
placeholder="Ingresa tu nombre"
value={form.name}
onChange={handleChange}
required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Crea una contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Que rol seras?</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="productor">Productor</option>
              <option value="comprador">Comprador</option>
            </select>
          </div>

          <button type="submit" className="btn-completeprofile">
            Registrarse
          </button>
        </form>

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Volver al Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;