import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Pantallaprincipal from "./components/Panelproductor";
import PantallaComprador from "./components/Panelcomprador";


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

