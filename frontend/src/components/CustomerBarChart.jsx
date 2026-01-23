// src/components/CustomerBarChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerBarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "売上総額 (円)",
        data: data.map((item) => item.sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y", // ✅ 棒グラフを横向きに表示
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "顧客別売上ランキング",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CustomerBarChart;
