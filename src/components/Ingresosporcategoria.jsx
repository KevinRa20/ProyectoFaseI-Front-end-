import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const IngresosPorCategoria = ({ productos }) => {

  const {
ingresosPorCategoria,
dataCategorias,
opcionesCategorias
} = useMemo(() => {
const ingresosPorCategoria = productos.reduce((acc, producto) => {
const categoria = producto.categoria || "Sin categoría";
const ingresos = Number(producto.ingresos) || 0;
acc[categoria] = (acc[categoria] || 0) + ingresos;
return acc;
}, {});
const categoriasOrdenadas = Object.entries(ingresosPorCategoria)
.sort((a, b) => b[1] - a[1]);
const dataCategorias = {
labels: categoriasOrdenadas.map(c => c[0]),
datasets: [
{
label: "Ingresos por Categoría (L.)",
data: categoriasOrdenadas.map(c => c[1]),
backgroundColor: [
"#4CAF50",
"#FF9800",
"#2196F3",
"#9C27B0",
"#E91E63",
"#795548",
"#00BCD4",
 "#8BC34A"],
borderRadius: 12,
barThickness: 40
}]
};
const opcionesCategorias = {
responsive: true,
maintainAspectRatio: false,
indexAxis: "y",
plugins: {
legend: { display: false },
tooltip: {
callbacks: {
label: (context) => `L. ${context.raw.toLocaleString()}`
}}
},
scales: {
x: {
ticks: {
callback: (value) => "L. " + value.toLocaleString(),
font: { size: 14 }}},
y: {
ticks: {
font: { size: 14 }
}}}};
return { ingresosPorCategoria, dataCategorias, opcionesCategorias };
}, [productos]);
// Modulo de IA: Recomendacion de productos
// ordenar productos por cantidad vendida
const productosMasVendidos = [...productos]
.sort((a,b) => (b.vendido || 0) - (a.vendido || 0))
.slice(0,5);
// Datos para grafica productos mas vendidos
const dataProductosVendidos = {
labels: productosMasVendidos.map(p => p.nombre),
datasets: [
{
label: "Cantidad Vendida",
data: productosMasVendidos.map(p => p.vendido || 0),
backgroundColor: "#4CAF50"
}]};
// recomendación simple de IA
let recomendacionIA = "";

if(productosMasVendidos.length > 0){
recomendacionIA = `Tu producto más demandado es ${productosMasVendidos[0].nombre}. 
Considera aumentar el stock para aprovechar la demanda.`;
}else{
recomendacionIA = "Aún no hay suficientes ventas para generar recomendaciones.";
}
return (
<section className="box">
<h2>Ingresos por Categoría</h2>
{Object.keys(ingresosPorCategoria).length === 0 ? (
<div className="empty">No hay ingresos por categoría</div>
) : (<>
<div style={{ width: "900px", height: "450px", margin: "auto" }}>
<Bar data={dataCategorias} options={opcionesCategorias} /></div>
<div style={{ marginTop: "15px" }}>
{Object.entries(ingresosPorCategoria).map(([cat, total], i) => (
<div key={i}>
<strong>{cat}</strong> : L.{total}
</div>
))}
</div>
</>
)}
<section className="box">
<h2> Productos Más Vendidos</h2>
{productosMasVendidos.length === 0 ? (
<div className="empty">No hay datos suficientes</div>
) : (
<div style={{width:"600px",height:"400px", margin:"auto"}}>
<Bar data={dataProductosVendidos} />
</div>
)}

<p style={{marginTop:"10px", fontStyle:"italic"}}>
{recomendacionIA}
</p>
</section>
</section>
);
};

export default IngresosPorCategoria;