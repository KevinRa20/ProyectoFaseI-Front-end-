import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificacionesComprador = ({ comprador }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    axios
.get(`http://localhost:5000/api/notificaciones/${comprador}`)
.then(res => setNotificaciones(res.data))
.catch(err => console.error(err));
  }, [comprador]);

return (
<div>
<h2>🔔 Mis Notificaciones</h2>
{notificaciones.length === 0 ? (
<p>No tienes notificaciones</p>
) : (
notificaciones.map((n, i) => (
<div key={i} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>
<strong>{n.producto}</strong>
<p>{n.mensaje}</p>
 <small>{new Date(n.fecha).toLocaleString()}</small>
</div>
))
)}
</div>
  );
};

export default NotificacionesComprador;