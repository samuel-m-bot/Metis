import React from 'react';
import { Table } from 'react-bootstrap';

const RelatedObjects = () => {
  const relatedProjects = [
    { id: 'P1', name: 'Project Alpha', description: 'Initial phase of development' },
  ];

  const relatedTasks = [
    { id: 'T1', title: 'Review document', status: 'Pending' },
  ];

  const relatedDesigns = [
    { id: 'D1', name: 'Initial Design', status: 'Approved' },
  ];

  return (
    <div className="related-objects">
      <h3>Related Projects</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {relatedProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Related Tasks</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {relatedTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Related Designs</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {relatedDesigns.map((design) => (
            <tr key={design.id}>
              <td>{design.id}</td>
              <td>{design.name}</td>
              <td>{design.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RelatedObjects;
