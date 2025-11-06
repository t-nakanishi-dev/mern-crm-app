// src/components/StatusPieChart.jsx
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.status),
    datasets: [
      {
        label: "案件数",
        data: data.map((item) => item.count),
        backgroundColor: [
          "#4299E1", // 青
          "#48BB78", // 緑
          "#ECC94B", // 黄
          "#F56565", // 赤
          "#A0AEC0", // 灰色
        ],
        hoverBackgroundColor: [
          "#63B3ED",
          "#68D391",
          "#F6E05E",
          "#F68787",
          "#CBD5E0",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-center mb-4">
        案件ステータス別案件数
      </h2>
      <Pie data={chartData} />
    </>
  );
};

export default StatusPieChart;
