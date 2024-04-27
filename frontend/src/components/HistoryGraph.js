import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const HistoryGraph = ({ revisions }) => {
  const navigate = useNavigate();

  const data = {
    datasets: [{
      label: 'Revisions',
      data: revisions?.map(rev => ({
        x: new Date(rev.date),  
        y: 1,  
        revisionId: rev._id,  
      })),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      pointRadius: 7, 
      pointBackgroundColor: 'rgb(75, 192, 192)',
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
          text: 'Date of Revision',
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
            let revisionId = context.raw.revisionId;
            return `Revision ID: ${revisionId}`;
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const revisionId = elements[0].element.$context.raw.revisionId;
        navigate(`/revisions/${revisionId}`);  
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
