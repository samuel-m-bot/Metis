import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ProjectWorkloadChart = ({ tasks }) => {
  const aggregateTasks = (tasks) => {
    const taskAggregation = {};
    tasks.forEach(task => {
      task.assignedTo.forEach(user => {
        const userName = `${user.firstName} ${user.surname}`;
        if (!taskAggregation[userName]) {
          taskAggregation[userName] = { completed: 0, remaining: 0, overdue: 0, name: userName };
        }
        if (task.status === 'Completed') {
          taskAggregation[userName].completed += 1;
        } else if (task.status !== 'Completed' && new Date(task.dueDate) > new Date()) {
          taskAggregation[userName].remaining += 1;
        }
        if (task.status !== 'Completed' && new Date(task.dueDate) < new Date()) {
          taskAggregation[userName].overdue += 1;
        }
      });
    });
    return Object.values(taskAggregation);
  };

  const teamMembersTasks = aggregateTasks(tasks);

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
