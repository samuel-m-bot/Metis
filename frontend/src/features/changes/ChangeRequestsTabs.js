import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import './ChangeRequest.css'
import RelatedItems from '../../components/RelatedItems';
import ChangeRequestDetails from '../../components/ChangeRequestDetails';
import EditChangeRequestModal from './EditChangeRequestModal'
import useAuth from '../../hooks/useAuth';
import HistoryCommentsTab from '../../components/HistoryCommentsTab';
import { useGetChangeRequestByIdQuery } from './changeRequestsApiSlice';
import LoadingSpinner from "../../components/LoadingSpinner";

const ChangeRequestTabs = () => {
  const { changeRequestID } = useParams();
  const { data: changeRequestData, isLoading, isError, error } = useGetChangeRequestByIdQuery(changeRequestID);
  const { isAdmin, isProjectManager } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState('details');

  console.log(changeRequestData)
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching change request: {error?.data?.message || 'Unknown error'}</div>;

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  const mockHistory = [
    "2023-04-01: Change request created by Alice Johnson",
    "2023-04-02: Status updated to 'Under Review' by Project Manager",
    "2023-04-03: Assigned to John Doe for initial assessment",
    "2023-04-04: Comments added by Alice Johnson regarding project scope adjustments",
    "2023-04-05: Status updated to 'Pending Approval' by Compliance Officer",
    "2023-04-06: Feedback requested from the engineering team",
    "2023-04-07: Revised following feedback from engineering",
    "2023-04-08: Status updated to 'Approved' awaiting final sign off"
];

  return (
    <div className="change-request-container">
      {(isAdmin || isProjectManager) && (
        <>
        <Dropdown as={ButtonGroup} className="actions-dropdown">
        <Button variant="secondary">Actions</Button>
        <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
        <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenModal}>Edit Change Request</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
    <EditChangeRequestModal
        show={showModal}
        handleClose={handleCloseModal}
        projectId={changeRequestData.projectId}
        mainItemId={changeRequestData._id}
        changeRequest={changeRequestData}
      />
        </>
      )}

      <Tabs
        id="change-request-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab disabled eventKey="Title" title={<span style={{ color: '#287379', fontWeight: 'bold', fontSize: 'x-large' }}>CR - {changeRequestData.title}</span>}></Tab>
        <Tab eventKey="details" title="Details">
          <ChangeRequestDetails changeRequestData={changeRequestData} />
        </Tab>

        <Tab eventKey="reviewsApprovals" title="Reviews & Approvals">
          <div className="reviews-approvals">
            <h3>Change Request Reviews</h3>
            <p>This section provides an overview of each change request's review process, including reviewer feedback and approval status.</p>

            {/* {changeRequestData.map((cr, index) => (
              <div key={index} className="change-request-review">
                <h4>{`Change Request: ${cr.title} (${cr.id})`}</h4>
                <p>Status: <strong>{cr.status}</strong></p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Reviewer</th>
                      <th>Role</th>
                      <th>Review Date</th>
                      <th>Feedback</th>
                      <th>Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cr?.reviews.map((review, index) => (
                      <tr key={index}>
                        <td>{review.reviewer}</td>
                        <td>{review.role}</td>
                        <td>{new Date(review.date).toLocaleDateString()}</td>
                        <td>{review.feedback}</td>
                        <td>{review.decision}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))} */}
          </div>
        </Tab>

        {console.log(changeRequestData)}
        <Tab eventKey="historyComments" title="History & Comments">
          <HistoryCommentsTab changeRequestId={changeRequestData._id} history={mockHistory}/>
        </Tab>

        <Tab eventKey="relatedDocuments" title="Related Documents & Items">
          <RelatedItems changeRequestData={changeRequestData} />
        </Tab>

      </Tabs>
    </div>
  );
};

export default ChangeRequestTabs;
