import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../style/Chat.css";

const socket = io("http://localhost:3001"); // servidor backend

const Chat = ({ usuario }) => {
  const [mensaje, setMensaje] = useState("");
  const [destino, setDestino] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.emit("registrarUsuario", usuario);

    socket.on("recibirMensaje", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    return () => socket.off("recibirMensaje");
  }, [usuario]);

  const enviarMensaje = () => {
    if (!mensaje || !destino) return;

    const data = {
      de: usuario,
      para: destino,
      texto: mensaje,
      fecha: new Date().toLocaleTimeString()
    };

    socket.emit("enviarMensaje", data);
    setMensajes((prev) => [...prev, data]);
    setMensaje("");
  };

  const mensajesFiltrados = mensajes.filter(
    m =>
      (m.de === usuario && m.para === destino) ||
      (m.de === destino && m.para === usuario)
  );

  return (
<div className="chat-container">
<div className="usuarios">
<h3>Chat con:</h3>
<input
placeholder="Productor o Comprador"
value={destino}
onChange={(e) => setDestino(e.target.value)}
/>
</div>

<div className="chat-box">
<div className="mensajes">
{mensajesFiltrados.map((m, i) => (
<div key={i} className={`msg ${m.de === usuario ? "propio" : ""}`}>
<strong>{m.de}</strong>
<p>{m.texto}</p>
<span>{m.fecha}</span>
</div>
))}
</div>
<div className="input-chat"><input
value={mensaje}
onChange={(e) => setMensaje(e.target.value)}
placeholder="Escribe un mensaje..."
/>
<button onClick={enviarMensaje}>Enviar</button>
</div>
</div>
</div>
  );
};

export default Chat;