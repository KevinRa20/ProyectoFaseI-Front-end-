import React from "react";

const PerfilProductorModal = ({ perfil, setPerfil, onClose }) => {
const handleChange = (e) => {
setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

return (
<div className="modal">
<div className="formulario perfil-form">
<h2>Completa Tu Perfil</h2>
<input name="productor" placeholder="Nombre completo" value={perfil.productor} onChange={handleChange} />
<input name="finca" placeholder="Nombre de la Finca" value={perfil.finca} onChange={handleChange} />
<input name="ubicacion" placeholder="Ubicación" value={perfil.ubicacion} onChange={handleChange} />
<input name="telefono" placeholder="Teléfono" value={perfil.telefono} onChange={handleChange} />
<input name="email" placeholder="Email" value={perfil.email} onChange={handleChange} />
<textarea name="descripcion" placeholder="Describe tu finca" value={perfil.descripcion} onChange={handleChange}></textarea>
<div className="acciones">
<button onClick={onClose}>Guardar</button>
<button onClick={onClose}>Cerrar</button>
</div>
</div>
</div>
);
};

export default PerfilProductorModal;