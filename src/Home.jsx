import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
<div className="home-container">
      
      {/* HERO / ENCABEZADO */}
      <header className="hero-section">
        <img className="Logo"src="data:image/jpeg;base64,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" alt="Logo" />
        <h1>AGRO COMMERCE</h1>
        <p>Tu Marketplace en Productos de Agrícola</p>

        <div className="hero-buttons">
          <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
          <Link to="/registro" className="btn-secondary">Registrarse</Link>
        </div>
      </header>

      {/* ¿QUÉ ES? */}
      <section className="info-section">
        <h2>¿Qué es AGRO COMMERCE?</h2>
        <img className="Imagen1" src="https://d26m4ikkajfmz.cloudfront.net/wp-content/uploads/2022/11/principal-16.jpg" alt=" Imagen1" />
        <p>
          Es una plataforma digital diseñada para conectar
          a los productores agrícolas con compradores, facilitando la 
          comercialización de productos en agrícolas de manera facil, rápida, segura y eficiente.
        </p>
      </section>

      {/* ¿CÓMO FUNCIONA? */}
      <section className="info-section light">
        <h2>¿Cómo funciona?</h2>
        <ul>
     <img  className="Imagen2"src="https://tecscience.tec.mx/es/wp-content/uploads/sites/8/2021/05/AdobeStock_288676847.jpeg" alt="Imagen2" />     
        <li> Registrate como productor o comprador.</li>
          <li>Publica productos agrícolas disponibles.</li>
          <li>Visualiza catalálogos y realiza pedidos.</li>
          <li>Coordina ventas de forma directa y transparente.</li>
        </ul>
        <img className="Imagen3" src="https://www.revistaagricultura.com/UploadedFiles/shutterstock_4550718345477.jpg" alt="Imagen3" />
      </section>

      {/* ¿QUÉ OFRECEMOS? */}
      <section className="info-section">
        <h2>¿Qué ofrecemos?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Comercialización directa</h3>
            <p>Sin intermediarios ni transporte costoso.</p>
          </div>

          <div className="feature-card">
            <h3>Gestión de compras y calidad de productos</h3>
            <p>Publica, edita y administra tus compras y productos fácilmente.</p>
          </div>

          <div className="feature-card">
            <h3>Acceso digital</h3>
            <p>Plataforma accesible desde cualquier dispositivo.</p>
          </div>
          <div className="feature-card">
            <h3>Disponible a nivel nacional</h3>
            <p>Plataforma segura y disponible en todo el pais.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 AGRO COMMERCE - Plataforma de Comercialización en productos de Agrícola</p>
      </footer>

    </div>
  );
}

export default Home;