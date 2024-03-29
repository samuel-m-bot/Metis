import React from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const HistoryGraph = ({ completedChangeRequests }) => {
  const navigate = useNavigate();

  const data = {
    datasets: [{
      label: 'Completed Change Requests',
      data: completedChangeRequests.map(cr => ({
        x: new Date(cr.dateCompleted),
        y: 1,
        crId: cr.id,
      })),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointRadius: 7, 
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2, 
    }],
    };


  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd/MM/yyyy',
        },
        title: {
          display: true,
          text: 'Date Completed',
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let crId = context.raw.crId;
            return `CR ID: ${crId}`;
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const crId = elements[0].element.$context.raw.crId;
        navigate(`/change-requests/${crId}`);
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return <Line data={data} options={options} />;
};

export default HistoryGraph;
