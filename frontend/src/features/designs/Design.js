import React from 'react';
import Item from '../items/Item';

const Design = () => {
  
  const completedChangeRequests = [
    { id: 'CR001', title: 'Initial Creation', dateCompleted: '2022-01-10', status: 'Completed' },
    { id: 'CR002', title: 'Add Safety Section', dateCompleted: '2022-03-15', status: 'Completed' },
    { id: 'CR003', title: 'Revise Specifications', dateCompleted: '2022-04-20', status: 'Completed' },
  ];

  const changeRequests = [
    {
      id: 'CR001',
      title: 'Update Project Scope',
      status: 'Completed',
      reviews: [
        {
          reviewer: 'Alice Johnson',
          role: 'Project Manager',
          date: '2021-04-20',
          feedback: 'Approved with minor revisions needed.',
          decision: 'Approved',
        },
        {
          reviewer: 'Bob Smith',
          role: 'Quality Assurance',
          date: '2021-04-22',
          feedback: 'All checks passed. No further changes required.',
          decision: 'Approved',
        },
      ],
    },
    {
      id: 'CR002',
      title: 'Update Project requirements',
      status: 'Completed',
      reviews: [
        {
          reviewer: 'Gojo Sataru',
          role: 'The strongest',
          date: '2021-04-20',
          feedback: 'Approved with minor revisions needed.',
          decision: 'Approved',
        },
        {
          reviewer: 'Roymen Sukuna',
          role: 'The Fallen',
          date: '2021-04-22',
          feedback: 'All checks passed. No further changes required.',
          decision: 'Approved',
        },
      ],
    },
  ];

  const designData = {
    name: "Main Interface Design",
    ID: "DES456",
    version: "2.0",
    status: "In Review",
    creationDate: "2023-02-15",
    lastModified: "2023-02-20",
    description: "Design specifications for the main user interface, including wireframes and user flow diagrams.",
    Author: "Alex Smith",
    Owners: "UI/UX Department",
    classificationType: "Confidential",
    accessDetails: "Restricted to design and development teams",
  };
  return (
    <>
      <Item 
        taskType="document" 
        itemData={designData} 
        changeRequests={changeRequests} 
        completedChangeRequests={completedChangeRequests}
      />
    </>
  );
};

export default Design;
