import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Project from './Project';

const ProjectList = () => {
  const mockProjects = [
    {
      id: 1,
      name: 'Project Alpha',
      startDate: '2021-01-01',
      endDate: '2021-12-31',
      description: 'This is a brief description of Project Alpha.',
      projectManagerName: 'Alex Johnson', // Replacing projectManagerID with name
      status: 'In Progress',
      teamMembersNames: ['Sam Tyler', 'Gene Hunt'], // Using names instead of IDs
      associatedProducts: ['Product1', 'Product2'],
      relatedDesigns: ['Design1', 'Design2'],
      notes: ['Note 1', 'Note 2'],
      attachments: [
        {
          fileName: 'Attachment1',
          filePath: '/path/to/attachment1',
          description: 'This document outlines the initial project proposal.',
          uploadDate: '2021-01-10',
        },
        {
          fileName: 'Attachment2',
          filePath: '/path/to/attachment2',
          description: 'This document contains the finalized project scope.',
          uploadDate: '2021-02-05',
        },
      ],
      milestones: [
        { name: 'Design Phase', dueDate: '2021-03-01' },
        { name: 'Development Phase', dueDate: '2021-06-01' },
        { name: 'Testing Phase', dueDate: '2021-09-01' },
        { name: 'Launch', dueDate: '2021-12-01' },
      ],
      tasks: [
        { id: 1, title: "Task 1", start: "2021-01-10", end: "2021-01-20", status: "Ongoing", assignedTo: "Alex Johnson", issuedBy: "Sam Tyler", relatedDocuments: ["Doc1", "Doc2"] },
        { id: 2, title: "Task 2", start: "2021-02-05", end: "2021-02-15", status: "Completed", assignedTo: "Gene Hunt", issuedBy: "Chris Skelton", relatedDocuments: ["Doc3"] },
        { id: 2, title: "Task 3", start: "2025-02-05", end: "2026-02-15", status: "Not Started", assignedTo: "Gene Hunt", issuedBy: "Chris Skelton", relatedDocuments: ["Doc3"] },
      ],
      changeRequests: [
        {
          id: 'CR001',
          title: 'Update Project Scope',
          description: 'This request is to include additional features in the project scope.',
          status: 'Pending',
          dateIssued: '2021-04-15',
        },
        {
          id: 'CR002',
          title: 'Update Project Scope',
          description: 'This request is to include additional features in the project scope.',
          status: 'Completed',
          dateIssued: '2021-04-15',
        }
      ],  
      designs: [
        {
          _id: "design1",
          productID: "Product1",
          version: 1,
          changes: "Initial design",
          status: "Draft",
          comments: ["Initial draft submitted"],
          designer: "Alex Johnson",
          creationDate: new Date(),
          approvalStatus: "Pending",
          approver: "",
          attachments: ["http://example.com/design1.pdf"],
          versionNotes: "Initial version",
          linkedChangeRequests: ["CR001", "CR002"]
        },
      ],    
    },    
    {
      id: 2,
      name: 'Project Beta',
      startDate: '2021-01-01',
      endDate: '2021-12-31',
      description: 'This is a brief description of Project Beta.',
      projectManagerName: 'Jessie Smith',
      status: 'In Progress',
      teamMembersNames: ['Chris Skelton', 'Ray Carling'],
      associatedProducts: ['Product3', 'Product4'],
      relatedDesigns: ['Design3', 'Design4'],
      notes: ['Note 3', 'Note 4'],
      attachments: [
        { fileName: 'Attachment3', filePath: '/path/to/attachment3' },
        { fileName: 'Attachment4', filePath: '/path/to/attachment4' },
      ],
      milestones: [
        { name: 'Initial Planning', dueDate: '2021-02-15' },
        { name: 'Prototype Development', dueDate: '2021-04-15' },
        { name: 'User Testing', dueDate: '2021-07-15' },
        { name: 'Final Review', dueDate: '2021-11-15' }
      ],
    },
  ];  
  const navigate = useNavigate();

  return (
    <div className="container mt-3">
        <h1>Project Dashboard</h1>
        <div className='row'>
            <div className='col'>
                <h2>Assigned projects</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Description</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockProjects.map(project => <Project key={project.id} project={project} />)}
                    </tbody>
                </table>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <h2>Completed projects</h2>
            </div>
        </div>
    </div>
  );
};

export default ProjectList;
