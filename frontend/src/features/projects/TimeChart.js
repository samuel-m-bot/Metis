import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TimeChart = ({ tasks }) => {
  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  
  const processData = (tasks) => {
    let weeklyData = { completed: [], ongoing: [], notStarted: [] };
    let maxWeeks = 4; // project start and end date
    let weekLabels = Array.from({ length: maxWeeks }, (_, i) => `Week ${i + 1}`);

    for (let i = 0; i < maxWeeks; i++) {
      let currentWeek = i + 1;
      weeklyData.completed.push(tasks.filter(task => task.status === 'Completed' && getWeekNumber(new Date(task.completionDate)) === currentWeek).length);
      weeklyData.ongoing.push(tasks.filter(task => task.status === 'In Progress' && getWeekNumber(new Date(task.creationDate)) <= currentWeek && (!task.completionDate || getWeekNumber(new Date(task.completionDate)) > currentWeek)).length);
      weeklyData.notStarted.push(tasks.filter(task => task.status === 'Not Started' && getWeekNumber(new Date(task.creationDate)) > currentWeek).length);
    }

    return {
      labels: weekLabels,
      datasets: [
        { label: 'Completed', data: weeklyData.completed, borderColor: 'rgba(75, 192, 192, 1)' },
        { label: 'Ongoing', data: weeklyData.ongoing, borderColor: 'rgba(54, 162, 235, 1)' },
        { label: 'Not Started', data: weeklyData.notStarted, borderColor: 'rgba(255, 206, 86, 1)' },
      ]
    };
  };

  const chartData = processData(tasks);

  return <Line data={chartData} />;
};

export default TimeChart;