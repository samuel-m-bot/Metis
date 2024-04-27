import { useGetTasksByProjectIdQuery } from '../Tasks/tasksApiSlice';
import ProgressHorizontalBarChart from '../Tasks/ProgressHorizontalBarChart';
import TimeChart from './TimeChart';
import CostBarChart from './CostBarChart';
import ProjectWorkloadChart from './ProjectWorkloadChart';
import TasksDoughnutChart from '../Tasks/TasksDoughnutChart';

const ProjectCharts = ({ projectId }) => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorDetails,
  } = useGetTasksByProjectIdQuery(projectId);

  if (tasksLoading) return <p>Loading tasks...</p>;
  if (tasksError) return (
    <div className="alert alert-info" role="alert">
      <h4 className="alert-heading">No Tasks Available</h4>
      <p>There are no tasks for this project; therefore, no charts can be presented.</p>
      <hr />
      <p className="mb-0">Please ensure tasks are added to the project for detailed visual analytics.</p>
    </div>
  );
  

  // Process tasks data here for chart inputs if necessary
  const taskSummary = tasks.ids.map(id => tasks.entities[id]);

  return (
    <div>
      {/* First row of charts */}
      <div className="row mb-4">
      <div className="col-md-4">
        <div className="card">
            <div className="card-body">
            <h5 className="card-title">Health Indicators</h5>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                <span className="fw-bold">Tasks:</span> {taskSummary.length} tasks to be completed
                </li>
                <li className="list-group-item">
                <span className="fw-bold">Workload:</span>
                <span className={`badge ${taskSummary.filter(task => task.status === 'On Hold').length > 0 ? 'bg-danger' : 'bg-success'} ms-2`}>
                    {taskSummary.filter(task => task.status === 'On Hold').length} Tasks overdue
                </span>
                </li>
                <li className="list-group-item">
                <span className="fw-bold">Progress:</span>
                <div className="progress">
                    <div className="progress-bar" style={{ width: `${(taskSummary.filter(task => task.status === 'Completed').length / taskSummary.length) * 100}%` }}>
                    {taskSummary.filter(task => task.status === 'Completed').length} complete
                    </div>
                </div>
                </li>
            </ul>
            </div>
        </div>
        </div>
        <div className="col-md-4">
          <TasksDoughnutChart tasks={taskSummary} />
        </div>
        <div className="col-md-4">
          <div className="chart-container">
            <ProgressHorizontalBarChart tasks={taskSummary} />
          </div>
        </div>
      </div>
      {/* Second row of charts */}
      <div className="row">
        <div className="col-md-4">
          <div className="chart-container">
            <h3>Time</h3>
            <TimeChart tasks={taskSummary} />
          </div>
        </div>
        {/* <div className="col-md-4">
          <div className="chart-container">
            <h3>Cost Chart</h3>
            <CostBarChart tasks={taskSummary} />
          </div>
        </div> */}
        <div className="col-md-4">
          <div className="chart-container">
            <h3>Workload Chart</h3>
            <ProjectWorkloadChart tasks={taskSummary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCharts;
