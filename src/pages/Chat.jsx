import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "../style/Chat.css";

const Chat = ({ usuario }) => {

  const socketRef = useRef(null);

  const [mensaje, setMensaje] = useState("");
  const [destino, setDestino] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const chatEndRef = useRef(null);

  // conectar socket
  useEffect(() => {

    if (!usuario) return;

    socketRef.current = io("http://localhost:3001");

    socketRef.current.emit("registrarUsuario", usuario);

    socketRef.current.on("recibirMensaje", (data) => {

      setMensajes((prev) => [...prev, data]);

    });

    return () => {
      socketRef.current.disconnect();
    };

  }, [usuario]);


  // scroll automático
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [mensajes]);


  const enviarMensaje = () => {

    if (!mensaje.trim() || !destino.trim()) return;

    const nuevoMensaje = {
      de: usuario,
      para: destino,
      texto: mensaje,
      fecha: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    socketRef.current.emit("enviarMensaje", nuevoMensaje);

    setMensaje("");
  };


  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }

  };


  const mensajesFiltrados = mensajes.filter(
    (m) =>
      (m.de === usuario && m.para === destino) ||
      (m.de === destino && m.para === usuario)
  );


  return (
<div className="chat-wrapper">

<div className="chat-container">
 <header className="chat-header">
<div className="user-info">
<label>Negociando con:</label>
<input
className="input-destination"
placeholder="Ej. Juan"
value={destino}
onChange={(e) => setDestino(e.target.value)}
/>
</div>
</header>


<div className="chat-box">
<div className="mensajes-area">
{mensajesFiltrados.length === 0 && destino && (
<p className="chat-empty">
Inicia una conversación con {destino}
</p>
)}
{mensajesFiltrados.map((m, index) => (
<div
key={index}
className={`msg-bubble ${m.de === usuario ? "propio" : "otro"}`}
>
<div className="msg-content">
<p>{m.texto}</p>
<span className="msg-time">{m.fecha}</span>
</div>
</div>
))}
<div ref={chatEndRef}></div>
</div>
<div className="input-area">
<textarea
className="main-textarea"
value={mensaje}
onChange={(e) => setMensaje(e.target.value)}
onKeyDown={handleKeyDown}
placeholder="Escribe tu mensaje..."
rows="2"
/>
<button
className="btn-send2"
onClick={enviarMensaje}
 >Enviar </button>
</div>
</div>
</div>
</div>
  );
};

export default Chat;