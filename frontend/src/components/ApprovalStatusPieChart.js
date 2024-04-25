import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const ApprovalStatusPieChart = ({ designs }) => {
    const statusCounts = designs.reduce((acc, design) => {
      acc[design.status] = (acc[design.status] || 0) + 1;
      return acc;
    }, {});
  
    const data = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Design Approval Status',
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 10
          }
        },
      },
    };
  
    return <Pie data={data} options={options} />;
  };

  export default ApprovalStatusPieChart;
  

