import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../style/Chat.css";

// conexión única
const socket = io("http://localhost:3001");

const Chat = ({ usuario }) => {
  const [mensaje, setMensaje] = useState("");
  const [destino, setDestino] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const chatEndRef = useRef(null);

  // registrar usuario
  useEffect(() => {
    if (!usuario) return;

    socket.emit("registrarUsuario", usuario);

    const recibirMensaje = (data) => {
      setMensajes((prev) => [...prev, data]);
    };

    socket.on("recibirMensaje", recibirMensaje);

    return () => {
      socket.off("recibirMensaje", recibirMensaje);
    };
  }, [usuario]);

  // scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = () => {
    if (!mensaje.trim() || !destino.trim()) return;

    const data = {
      de: usuario,
      para: destino,
      texto: mensaje.trim(),
      fecha: new Date().toLocaleTimeString()
    };

    socket.emit("enviarMensaje", data);

    setMensajes((prev) => [...prev, data]);

    setMensaje("");
  };

  const mensajesFiltrados = mensajes.filter(
    (m) =>
      (m.de === usuario && m.para === destino) ||
      (m.de === destino && m.para === usuario)
  );

  return (
    <div className="chat-container">

      <div className="usuarios">
        <h3>Chat con:</h3>

        <input
          placeholder="Nombre del Productor o Comprador"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
      </div>

      <div className="chat-box">

        <div className="mensajes">

          {mensajesFiltrados.map((m, i) => (
            <div
              key={i}
              className={`msg ${m.de === usuario ? "propio" : "otro"}`}
            >
              <strong>{m.de}</strong>

              <p>{m.texto}</p>

              <span>{m.fecha}</span>
            </div>
          ))}

          <div ref={chatEndRef}></div>

        </div>

        <div className="input-chat">

          <input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
            onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          />

          <button onClick={enviarMensaje}>
            Enviar
          </button>

        </div>

      </div>

    </div>
  );
};

export default Chat;