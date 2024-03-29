import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ProjectWorkloadChart = () => {
  const teamMembersTasks = [
    { name: 'Member 1', completed: 5, remaining: 10, overdue: 2 },
    { name: 'Member 2', completed: 7, remaining: 8, overdue: 3 },
    { name: 'Member 3', completed: 6, remaining: 5, overdue: 1 },
  ];

  const data = {
    labels: teamMembersTasks.map(member => member.name),
    datasets: [
      {
        label: 'Completed',
        data: teamMembersTasks.map(member => member.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Remaining',
        data: teamMembersTasks.map(member => member.remaining),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Overdue',
        data: teamMembersTasks.map(member => member.overdue),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks',
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

export default ProjectWorkloadChart;
