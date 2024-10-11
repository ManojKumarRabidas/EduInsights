// BarChartComponent.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.label,
        data: data.values,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//   };

//   return <Bar data={chartData} options={options} height={1200}/>;
  return <Bar data={chartData}/>;
};

export default BarChartComponent;
