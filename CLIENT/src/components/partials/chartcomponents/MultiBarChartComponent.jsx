// MultiBarChartComponent.jsx
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

const MultiBarChartComponent = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.setNames[0],
        data: data.values1,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: data.setNames[1],
        data: data.values2,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: data.setNames[2],
        data: data.values3,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//   };

//   return <Bar data={chartData } options={options} height={1200} />;
  return <Bar data={chartData } />;
};

export default MultiBarChartComponent;
