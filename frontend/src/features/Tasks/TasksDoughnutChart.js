import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const TasksDoughnutChart = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const ongoingTasks = tasks.filter(task => task.status === 'Ongoing').length;
  const notStartedTasks = tasks.filter(task => task.status === 'Not Started').length;

  const data = {
    labels: ['Completed', 'Ongoing', 'Not Started'],
    datasets: [
      {
        data: [completedTasks, ongoingTasks, notStartedTasks],
        backgroundColor: ['green', 'blue', 'grey'],
        borderColor: ['white', 'white', 'white'],
        borderWidth: 2,
        cutout: '80%',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, 
      },
    },
    maintainAspectRatio: false,
  };



const legendItems = data.labels.map((label, index) => (
  <div key={label} className="d-flex align-items-center">
    <div style={{ width: '20px', height: '20px', backgroundColor: data.datasets[0].backgroundColor[index], marginRight: '10px' }}></div>
    <span>{label}</span>
  </div>
));

return (
  <div className="chart-container">
      <div className="d-flex flex-row justify-content-center flex-wrap">
        {legendItems}
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );

};

export default TasksDoughnutChart;
