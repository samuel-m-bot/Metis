import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ProgressHorizontalBarChart = () => {
  const data = {
    labels: ['Completed', 'Ongoing', 'Not Started'],
    datasets: [
      {
        label: 'Tasks',
        data: [5, 3, 2],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ProgressHorizontalBarChart;
