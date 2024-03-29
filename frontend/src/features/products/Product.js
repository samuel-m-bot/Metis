import React from 'react';
import Item from '../items/Item';

const Product = () => {
  
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

  const productData = {
    name: "New Software Tool",
    ID: "PROD789",
    version: "1.0",
    status: "Development",
    creationDate: "2023-03-05",
    lastModified: "2023-03-12",
    description: "A new tool designed to improve workflow efficiency by automating repetitive tasks.",
    Author: "Chris Johnson",
    Owners: "Product Development Team",
    classificationType: "Public",
    accessDetails: "Available to all employees",
  };
  
  return (
    <>
      <Item 
        taskType="document" 
        itemData={productData} 
        changeRequests={changeRequests} 
        completedChangeRequests={completedChangeRequests}
      />
    </>
  );
};

export default Product;
