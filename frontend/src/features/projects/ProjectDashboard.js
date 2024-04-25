import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs, Dropdown, Button, Modal, ButtonGroup  } from 'react-bootstrap';
import TasksTable from '../Tasks/TasksTable';
import ProgressHorizontalBarChart from '../Tasks/ProgressHorizontalBarChart';
import TimeChart from './TimeChart';
import CostBarChart from './CostBarChart';
import ProjectWorkloadChart from './ProjectWorkloadChart';
import { useGetProjectByIdQuery } from './projectsApiSlice';
import { useGetDocumentsByProjectIdQuery } from '../documents/documentsApiSlice';
import { useGetTasksByProjectIdQuery } from '../Tasks/tasksApiSlice';
import './ProjectDashboard.css'
import useAuth from '../../hooks/useAuth';
import NewTaskForm from '../Tasks/NewTaskForm';
import ProductsTab from '../products/ProductsTab';
import DesignTab from '../designs/DesignTab';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProjectCharts from './ProjectCharts';

const ProjectDashboard = () => {

  const { projectId } = useParams();
  const {
    data: project,
    isLoading,
    isError,
    error
  } = useGetProjectByIdQuery(projectId, {
    pollingInterval: 300000, // Polling every 5 minutes
    refetchOnFocus: true, // Refetch when the window gains focus
    refetchOnMountOrArgChange: true // Refetch on component mount or argument changes
  });
  console.log(project)
  const [key, setKey] = useState('overview');
  const {isAdmin, isProjectManager} = useAuth()
  const [showTaskModal, setShowTaskModal] = useState(false);

  
  const { data: documents, isLoadingDocuments, isErrorDocuments, errorD } = useGetDocumentsByProjectIdQuery(project?.id);
  const { data: tasks, isLoadingTasks, isErrorTasks, errorT } = useGetTasksByProjectIdQuery(project?.id);


  const navigate = useNavigate()
  if (!project) {
    return <div className="container mt-3">Project not found.</div>;
  }
  console.log(project)
  const handleCreateTaskClicked = () => {
      setShowTaskModal(true);
  };

  const handleCloseModal = () => {
      setShowTaskModal(false);
  };
  const handleViewDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };
  

  const viewAllTasks = () => {
    navigate('/tasks/all');
  };

  // const ongoingTasks = project.tasks.filter(task => task.status === 'Ongoing');
  // const completedTasks = project.tasks.filter(task => task.status === 'Completed');
  // const upcomingTasks = project.tasks.filter(task => task.status === 'Not Started');

  // const ongoingChangeRequest = project.changeRequests.filter(task => task.status !== 'Completed');
  // const completedChangeRequest = project.changeRequests.filter(task => task.status === 'Completed');

  const handleManageTeamClicked = () => {
    navigate('manage-team/');
  };

  if (isLoading) return <LoadingSpinner />
  return (
    <div className="container-fluid">
      {(isAdmin || isProjectManager) && (
                <Dropdown as={ButtonGroup} className="actions-dropdown">
                    <Button variant="secondary">Actions</Button>
                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleManageTeamClicked}>Manage Team</Dropdown.Item>
                        <Dropdown.Item onClick={handleCreateTaskClicked}>Create Task</Dropdown.Item>
                        <Dropdown.Item>Edit Project</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}

            <Modal show={showTaskModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewTaskForm onClose={handleCloseModal} /> 
                </Modal.Body>
            </Modal>

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
          <p><strong>Project Manager:</strong> {project.projectManagerID.firstName} {project.projectManagerID.surname}</p>
          <p><strong>Team Members:</strong> {project.teamMembers.map(member => `${member.userId.firstName} ${member.userId.surname}`).join(', ')}</p>
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
          <ProjectCharts projectId={project.id} />
        </Tab>
        
        <Tab eventKey="documents" title="Documents" className="project-documents">
          {console.log(documents)}
          {isLoadingDocuments ? (
            <p>Loading documents...</p>
          ) : isErrorDocuments ? (
            <p>Error: {errorD?.data?.message}</p>
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
        {isLoadingTasks ? (
            <p>Loading tasks...</p>
          ) : isErrorTasks ? (
            <p>Error: {errorT?.data?.message}</p>
          ) : tasks?.ids.length > 0 ? (
            <>
              <div className="row">
                <div className="col-md-6">
                  <TasksTable taskIds={tasks.ids} status="In Progress" title="Ongoing Tasks" />
                </div>
                <div className="col-md-6">
                  <TasksTable taskIds={tasks.ids} status="Completed" title="Completed Tasks" />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <TasksTable taskIds={tasks.ids} status="Not Started" title="Upcoming Tasks" />
                </div>
              </div>
              <div className="mt-4">
                <button onClick={viewAllTasks} className="btn btn-primary">View All Tasks</button>
              </div>
            </>
          ) : (
            <p>No tasks available.</p>
          )}
        </Tab>

        <Tab eventKey="products" title="Products">
          <ProductsTab projectId={project.id} />
        </Tab>

        
        <Tab eventKey="design" title="Design" className="design-tab-content">
          <DesignTab projectId={project.id} />
        </Tab>


      </Tabs>
    </div>
  );
};

export default ProjectDashboard;
