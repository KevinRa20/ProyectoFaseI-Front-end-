import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"; 
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  

  
 const navigate = useNavigate();
   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json(); // SOLO UNA VEZ
    alert(data.msg);

    if (res.ok) {
      setForm({ email: "", password: "" });

      if (data.rol === "productor") {
        navigate("/panelproductor");
      } else if (data.rol === "comprador") {
        navigate("/panelcomprador");
      }
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
          src="https://cdn-icons-png.flaticon.com/128/747/747376.png"
          alt="icono-login"
        />
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>

        <p>
          ¿No tienes cuenta? <Link to="/registro">Registrarse</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;