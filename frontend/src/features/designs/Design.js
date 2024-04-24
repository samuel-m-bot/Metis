import Item from '../items/Item';
import { useLocation } from 'react-router-dom';

const Design = () => {
  const location = useLocation();
  const itemData = location.state?.itemData;

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

  // const designData = {
  //   id:6,
  //   projectId: "6621cb51b0e4321947c1b560",  // Example Project ObjectId
  //   productID: "6621cb51b0e4321947c1b561",  // Example Product ObjectId
  //   name: "Main Interface Design",
  //   description: "Design specifications for the main user interface, including wireframes and user flow diagrams.",
  //   type: "Technical",
  //   revisionNumber: "A.2",
  //   status: "In Review",
  //   comments: [
  //       {
  //           text: "Needs more contrast in the color scheme.",
  //           author: "6621cb51b0e4321947c1b562",  // Example User ObjectId
  //           timestamp: new Date("2024-04-20T12:34:56Z")
  //       }
  //   ],
  //   designers: [
  //       "6621cb51b0e4321947c1b563",  // Example User ObjectId
  //       "6621cb51b0e4321947c1b564"   // Another Example User ObjectId
  //   ],
  //   creationDate: new Date("2023-02-15T00:00:00Z"),
  //   lastModifiedDate: new Date("2023-02-20T00:00:00Z"),
  //   attachment: {
  //       filePath: "/files/designs/main_interface_design_v2.pdf",
  //       fileName: "main_interface_design_v2.pdf"
  //   }
  // };

  return (
    <>
      <Item 
        itemType="Design" 
        itemData={itemData} 
        changeRequests={changeRequests} 
        completedChangeRequests={completedChangeRequests}
      />
    </>
  );
};

export default Design;
