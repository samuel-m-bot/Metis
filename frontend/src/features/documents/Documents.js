import Item from '../items/Item';
import { useLocation } from 'react-router-dom';

const Documents = () => {
  const location = useLocation();
  const documentData = location.state?.documentData;

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

  const mockDocumentData = {
    id: 2,
    projectId: "60af924b36e78cae837afb45",  // Example ObjectId
    title: "Project Requirements Specification",
    type: "Requirements",
    description: "Detailed description of the project requirements including system, user, and functional requirements.",
    attachment: {
        filePath: "/documents/specifications.pdf",
        fileName: "specifications.pdf"
    },
    revisionNumber: "A.1",
    associatedProductIDs: [
        "60af924b36e78cae837afb46",  // Example Product ObjectId
    ],
    authors: [
        "60af924b36e78cae837afb47",  // Example User ObjectId
    ],
    creationDate: new Date("2023-03-01T00:00:00Z"),
    lastModifiedDate: new Date("2023-03-10T00:00:00Z"),
    status: "Draft",
    relatedDocuments: [
        "60af924b36e78cae837afb48",  // Example Related Document ObjectId
    ],
    comments: [
        {
            text: "Initial draft submitted for review.",
            author: "60af924b36e78cae837afb49",  // Example User ObjectId
            timestamp: new Date("2023-03-02T12:34:56Z")
        },
        {
            text: "Reviewed the initial draft, minor changes needed.",
            author: "60af924b36e78cae837afb50",  // Another Example User ObjectId
            timestamp: new Date("2023-03-03T09:30:00Z")
        }
    ]
};


  // Use passed documentData or default data
  const finalDocumentData = documentData || mockDocumentData;
  
  return (
    <>
      <Item 
        itemType="Document" 
        itemData={finalDocumentData} 
        changeRequests={changeRequests} 
        completedChangeRequests={completedChangeRequests}
      />
    </>
  );
};

export default Documents;
