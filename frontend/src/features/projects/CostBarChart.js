import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CostBarChart = () => {
  const costData = {
    actual: 120000,
    planned: 100000,
    budget: 150000,
  };

  const data = {
    labels: ['Cost Overview'],
    datasets: [
      {
        label: 'Actual',
        data: [costData.actual],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Planned',
        data: [costData.planned],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Budget',
        data: [costData.budget],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost (£)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CostBarChart;
