import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Pantallaprincipal from "./Panelproductor";
import PantallaComprador from "./Panelcomprador";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/panelproductor" element={<Pantallaprincipal />} />
      <Route path="/panelcomprador" element={<PantallaComprador />} />
    </Routes>
  );
}

export default App;

