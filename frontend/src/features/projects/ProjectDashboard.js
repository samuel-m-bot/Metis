import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import TasksTable from '../Tasks/TasksTable';
import ChangeRequestsTable from '../changes/ChangeRequestsTable';
import DesignTable from '../designs/DesignTable';
import TasksDoughnutChart from '../Tasks/TasksDoughnutChart';
import ProgressHorizontalBarChart from '../Tasks/ProgressHorizontalBarChart';
import TimeChart from './TimeChart';
import CostBarChart from './CostBarChart';
import ProjectWorkloadChart from './ProjectWorkloadChart';
import { useGetDocumentsByProjectIdQuery } from '../documents/documentsApiSlice';
import './ProjectDashboard.css'

const ProjectDashboard = () => {
  const location = useLocation();
  const project = location.state?.project;
  const [key, setKey] = useState('overview');
  
  const { data: documents, isLoading, isError, error } = useGetDocumentsByProjectIdQuery(project?.id);

  const navigate = useNavigate()
  if (!project) {
    return <div className="container mt-3">Project not found.</div>;
  }
  console.log(project)

  const handleViewDocument = (documentId) => {
    const documentData = documents.entities[documentId];  // Assuming documents.entities contains the full document data
    navigate(`/documents/${documentId}`, { state: { documentData } });
  };
  

  const viewAllTasks = () => {
    navigate('/tasks/all');
  };

  // const ongoingTasks = project.tasks.filter(task => task.status === 'Ongoing');
  // const completedTasks = project.tasks.filter(task => task.status === 'Completed');
  // const upcomingTasks = project.tasks.filter(task => task.status === 'Not Started');

  // const ongoingChangeRequest = project.changeRequests.filter(task => task.status !== 'Completed');
  // const completedChangeRequest = project.changeRequests.filter(task => task.status === 'Completed');

  return (
    <div className="container-fluid">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab disabled eventKey="Title" title={<span style={{ color: '#287379', fontWeight: 'bold', fontSize: 'x-large' }}>{project.name}</span>}></Tab>

        <Tab eventKey="overview" title="Overview" className="project-overview">
          <h2>Project Overview</h2>
          <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Status:</strong> <span className={`badge ${project.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>{project.status}</span></p>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Project Manager:</strong> {project.projectManagerID}</p>
          <p><strong>Team Members:</strong> {project.teamMembers.join(', ')}</p>
          <div><strong>Progress:</strong></div>
          <div className="progress" style={{ height: '20px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '50%' }}></div>
          </div>
          {/* Milestones */}
          <h3>Milestones</h3>
          {project.milestones && project.milestones?.length > 0 ? (
            <ul>
              {project.milestones.map((milestone, index) => (
                <li key={index}>
                  <strong>{milestone.name}:</strong> {new Date(milestone.dueDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No milestones set.</p>
          )}
        </Tab>


        <Tab eventKey="charts" title="Charts">
          {/* First row of charts */}
          <div className="row mb-4">
            <div className="col-md-4">
              <h5>Health Indicators</h5>
              <ul>
                <li>Time: 14% ahead of schedule</li>
                <li>Tasks: 12 tasks to be completed</li>
                <li>Workload: 0 Tasks overdue</li>
                <li>Progress: 14 complete</li>
                <li>Cost: 42% under budget</li>
              </ul>
            </div>
            <div className="col-md-4">
              {/* <TasksDoughnutChart tasks={project.tasks} /> */}
            </div>
            <div className="col-md-4">
              <div className="chart-container">
                <ProgressHorizontalBarChart/>
              </div>
            </div>
          </div>
          {/* Second row of charts */}
          <div className="row">
            <div className="col-md-4">
              <div className="chart-container">
                <h3>Time</h3>
                <TimeChart/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="chart-container">
                <h3>Cost Chart</h3>
                <CostBarChart/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="chart-container">
                <h3>Workload Chart</h3>
                <ProjectWorkloadChart/>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="documents" title="Documents" className="project-documents">
          {console.log(documents)}
          {isLoading ? (
            <p>Loading documents...</p>
          ) : isError ? (
            <p>Error: {error?.data?.message}</p>
          ) : documents?.ids.length > 0 ? (
            <div className="attachments-list">
              {documents?.ids.map((documentId, index) => (
                <div key={index} className="attachment-item">
                  <h5 className="attachment-title">{documents.entities[documentId].title}</h5>
                  <p className="attachment-description">{documents.entities[documentId].description}</p>
                  <p className="attachment-upload-date">{documents.entities[documentId].creationDate ? new Date(documents.entities[documentId].creationDate).toLocaleDateString() : ''}</p>
                  <button onClick={() => handleViewDocument(documentId)} className="btn btn-primary">
                    View Document
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No documents available.</p>
          )}
        </Tab>

        <Tab eventKey="tasks" title="Tasks" className="tab-tasks">
          <div className="row">
            <div className="col-md-6">
              <TasksTable taskIds={project.projectTasks} status="In Progress" title="Ongoing Tasks" />
            </div>
            <div className="col-md-6">
              <TasksTable taskIds={project.projectTasks} status="Completed" title="Completed Tasks" />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <TasksTable taskIds={project.projectTasks} status="Not Started" title="Upcoming Tasks" />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={viewAllTasks} className="btn btn-primary">View All Tasks</button>
          </div>
        </Tab>
        <Tab eventKey="changeRequests" title="Change Requests">
          <div className='row'>
            <h3>Ongoing Change Request</h3>
            <ChangeRequestsTable projectId={project.id} status="Reviewed" />
          </div>
          <div className='row'>
            <h3>Completed Change Request</h3>
            <ChangeRequestsTable projectId={project.id} status="Closed" />
          </div>
        </Tab>
        <Tab eventKey="design" title="Design" className="design-tab-content">
          <h2 className="design-tab-title">Project Design Overview</h2>
          <p className="design-tab-summary">Here's a brief overview of the current design phase, including key objectives and recent updates.</p>

          <div className="design-updates">
            <h3>Latest Design Updates</h3>
          </div>

          <div className="design-approval-status">
            <h3>Design Approval Status</h3>
            {/* PieChart or List showing approval statuses */}
          </div>

          <div className="featured-designs">
            <h3>Featured Designs</h3>
            {/* Thumbnails or links to featured designs */}
          </div>

          <div className="design-actions mb-4">
            <button className="btn btn-primary me-2">Add New Design</button>
            <button className="btn btn-secondary">View All Designs</button>
          </div>

          {/* <DesignTable designs={project.designs} /> */}
        </Tab>

      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
