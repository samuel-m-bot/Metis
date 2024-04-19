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
    id: 4,
    projectId: "6621cb51b0e4321947c1b560",  // Example Project ObjectId
    name: "New Software Tool",
    description: "A new tool designed to improve workflow efficiency by automating repetitive tasks.",
    category: "Productivity Software",
    lifecycleStatus: "Development",
    version: "1.0",
    partNumber: "PN7890",
    createdAt: new Date("2023-03-05T00:00:00Z"),
    updatedAt: new Date("2023-03-12T00:00:00Z"),
    documents: [],  // Array of ObjectIds linking to related documents
    type: "Software",
    digitalAttributes: {
        softwareType: "Desktop",
        version: "1.0",
    },
    physicalAttributes: {
        material: null, // Not applicable for software
        color: null,
        dimensions: null,
    }
};
  
  return (
    <>
      <Item 
        taskType="Product" 
        itemData={productData} 
        changeRequests={changeRequests} 
        completedChangeRequests={completedChangeRequests}
      />
    </>
  );
};

export default Product;
