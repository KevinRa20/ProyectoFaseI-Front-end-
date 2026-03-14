import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";

function Home() {
  return (
<div className="home-container">
{/* HERO */}
<header className="hero-section">
<img
className="logo"
src="data:image/png;base64,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"
alt="Agro Commerce Logo"
/>
<h1>AGRO COMMERCE</h1>
<p>
          La plataforma de comercialización agrícola más inteligente, 
          analisis en tiempo real, y herramientas para hacer crecer tu negocio. 
          Conectamos productores agrícolas hondureños con compradores
          en todo el país.
</p>
        

<div className="hero-buttons">
<Link to="/registro" className="btn-primary">
Empezar Ahora
</Link>
<Link to="/login" className="btn-secondary">
Iniciar Sesión
</Link>
</div>
</header>

{/* PROBLEMA / PROPUESTA DE VALOR */}
<section className="info-section">
<h2>Transformamos la comercialización agrícola en Honduras</h2>
<p>
Muchos productores agrícolas enfrentan dificultades para vender sus productos directamente al mercado. 
Nuestra plataforma elimina a los intermediarios y conecta a los productores con compradores de manera directa, rápida y segura, permitiéndoles obtener mejores precios, mayor visibilidad y oportunidades de crecimiento.
</p>
<img
          className="imagen"
          src="https://d26m4ikkajfmz.cloudfront.net/wp-content/uploads/2022/11/principal-16.jpg"
          alt="Agricultura"
/>
</section>
{/* COMO FUNCIONA */}
<section className="info-section light">
 <h2>¿Cómo funciona?</h2>
<div className="steps">
<div className="step">
<h3>1. Regístrate</h3>
<p>Crea una cuenta y registrate como productor o comprador.</p>
</div>
<div className="step">
<h3>2. Publica o Explora</h3>
<p>
Los productores publican sus productos y los compradores
exploran el catálogo agrícola y adquiere las compras.
</p>
</div>
<div className="step">
<h3>3. Conecta y Compra</h3>
<p>
Realiza pedidos y coordina ventas directamente con el productor.
</p>
</div>
</div>
</section>
{/* BENEFICIOS */}
<section className="info-section">
<h2>Beneficios de la Plataforma</h2>
<div className="features">
<div className="feature-card">
<h3>Venta Directa</h3>
<p>Productores venden sin intermediarios.</p>
</div>
<div className="feature-card">
<h3>Sin comisiones ni pagas por vender tus productos</h3>
<p>Coordina tus propias ventas a tu manera</p>
</div>
<div className="feature-card">
<h3>Mayor Alcance</h3>
<p>Acceso a compradores en todo Honduras.</p>
</div>
<div className="feature-card">
<h3>Gestión Digital</h3>
<p>Administra productos, compras y pedidos fácilmente.</p>
</div>

<div className="feature-card">
<h3>Transacciones Seguras</h3>
<p>Comunicación clara y confiable entre ambas partes.</p>
</div>
</div>
</section>
{/* PLANES PRODUCTORES */}
<section className="pricing-section">
<h2>Planes para Productores</h2>
<div className="pricing-cards">
<div className="pricing-card">
<h3>Plan Básico</h3>
<h4>Gratis</h4>
<ul>
<li>Publica hasta 5 productos</li>
<li>Acceso al marketplace</li>
<li>Perfil de productor</li>
</ul>
<Link to="/login" className="btn-plan">Obtener plan
</Link>
</div>
<div className="pricing-card popular">
<h3>Plan Estandar</h3>
<h4>$9 / mes</h4>
<ul>
<li>Publicacion de catálogo hasta 10 productos</li>
<li>Mayor visibilidad en búsquedas</li>
<li>Estadísticas de ventas</li>
</ul>
<Link to="/login" className="btn-plan"> Obtener plan
</Link>
</div>
<div className="pricing-card">
<h3>Plan Premium</h3>
<h4>$19 / mes</h4>
<ul>
<li>Publicacion de catálogo de Productos ilimitados</li>
<li>Promoción destacada</li>
<li>Soporte prioritario</li>
</ul>
<Link to="/login" className="btn-plan">Obtener plan</Link>
</div>
</div>
</section>

{/* PLANES COMPRADORES */}
<section className="pricing-section light">
<h2>Planes para Compradores</h2>
<div className="pricing-cards">
<div className="pricing-card">
<h3>Plan  Básico</h3>
<h4>Gratis</h4>
<ul>
<li>Acceso al catálogo</li>
<li>Compras hasta de 5 productos</li>
<li>Contactar productores</li>
</ul>
<Link to="/login" className="btn-plan">
Obtener plan
</Link>
</div>
<div className="pricing-card popular">
<h3>Plan Premium</h3>
<h4>$7 / mes</h4>
<ul>
<li>Compras ilimitadas</li>
<li>Acceso a productores verificados</li>
<li>Prioridad en pedidos</li>
</ul>
<Link to="/login" className="btn-plan">
Obtener plan
</Link>
</div>
</div>
</section>

{/* CTA FINAL */}

<section className="cta-section">
<h2>Empieza a vender o comprar hoy</h2>

  <p>
          Únete a la red agrícola digital que conecta productores
          y compradores en todo Honduras.
</p>

<Link to="/registro" className="btn-primary">
Crear Cuenta
</Link>

</section>

{/* FOOTER */}

<footer className="footer">
        <p>
          © 2026 AGRO COMMERCE - Marketplace agrícola para Honduras
        </p>
</footer>

</div>
  );
}

export default Home;