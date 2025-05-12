import React from "react";
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const GraficoProductos = ({ nombres, precios }) => {
  // Configuración de los datos del gráfico
    const data = {
        labels: nombres, // Nombres de los productos
        datasets: [
        {
            label: "Precio (C$)",
            data: precios, // Precios de los productos
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
        },
        ],
    };

    // Configuración de las opciones del gráfico
    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Precios de Productos",
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: "Precio (C$)",
            },
        },
        x: {
            title: {
            display: true,
            text: "Productos",
            },
        },
        },
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
        <Card>
            <Card.Body>
            <Card.Title>Gráfico de Precios</Card.Title>
            <Bar data={data} options={options} />
            </Card.Body>
        </Card>
        </div>
    );
};

export default GraficoProductos;
