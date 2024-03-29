import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TimeChart = () => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: 'Project Progress',
      data: [20, 40, 60, 80],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return <Line data={data} />;
};
export default TimeChart