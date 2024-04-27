import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ProgressHorizontalBarChart = ({ tasks }) => {
  // Compute task counts based on status
  const taskCounts = {
    completed: tasks.filter(task => task.status === 'Completed').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    notStarted: tasks.filter(task => task.status === 'Not Started').length
  };

  const data = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        label: 'Tasks',
        data: [taskCounts.completed, taskCounts.inProgress, taskCounts.notStarted],
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
    indexAxis: 'y', // Horizontal bar chart
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
