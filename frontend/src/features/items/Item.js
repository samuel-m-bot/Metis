import React, { useState } from 'react';
import { Tab, Tabs, ButtonGroup, Dropdown, Button } from 'react-bootstrap';
import './Item.css'
import ChangeRequestsTable from '../../components/ChangeRequestsTable ';
import HistoryGraph from '../../components/HistoryGraph';
import RelatedObjects from '../../components/RelatedObjects';
import ChangeRequestModal from '../changes/ChangeRequestModal';

const Item = ({taskType, itemData, changeRequests, completedChangeRequests }) => {
  const [key, setKey] = useState('details');

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);


  const handleDownload = () => {
    const documentUrl = `${process.env.PUBLIC_URL}/path/to/your/document.pdf`;
  
    const link = document.createElement("a");
    link.href = documentUrl;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="item-container">
      <div className="actions-and-tabs-container">
      <Dropdown as={ButtonGroup} className="actions-dropdown">
        <Button variant="secondary">Actions</Button>

        <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Check Out</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Check In</Dropdown.Item>
          <Dropdown.Item onClick={handleOpenModal}>Make a Change Request</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ChangeRequestModal show={showModal} handleClose={handleCloseModal} />
      <Tabs
        id="item-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        
        <Tab disabled eventKey="Title" title={<span style={{ color: '#287379', fontWeight: 'bold', fontSize: 'x-large' }}>Waveform DRD</span>}></Tab>
        <Tab eventKey="details" title="Details" className="document-details">
        <div className="detail-section">
          <h2>General Details</h2>
          <div className="detail-row">
            <p className="detail-item"><span className="detail-label">Item Title:</span>{itemData.name}</p>
            <p className="detail-item"><span className="detail-label">Item ID:</span> {itemData.ID}</p>
          </div>
          <div className="detail-row">
            <p className="detail-item"><span className="detail-label">Version:</span> {itemData.version}</p>
            <p className="detail-item"><span className="detail-label">Status:</span> {itemData.status}</p>
          </div>
          <div className="detail-row">
            <p className="detail-item"><span className="detail-label">Creation Date:</span> {itemData.creationDate}</p>
            <p className="detail-item"><span className="detail-label">Last Modified:</span> {itemData.lastModified}</p>
          </div>
          {/* Download button */}
          <Button onClick={handleDownload} variant="primary">Download Item</Button>
        </div>
          <div className='row'>
            <div className='col'>
              <div className="detail-section">
                <h2>Item Description</h2>
                <div className="detail-row">
                  <p className="detail-item"><span className="detail-label">Description:</span> {itemData.description}</p>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className="detail-section">
                <h2>Authorship & Ownership</h2>
                <div className="detail-row">
                  <p className="detail-item"><span className="detail-label">Author(s):</span> {itemData.Author}</p>
                  <p className="detail-item"><span className="detail-label">Owner(s):</span> {itemData.Owners}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col'>
              <div className="detail-section">
                <h2>Classification</h2>
                <div className="detail-row">
                  <p className="detail-item"><span className="detail-label">Type:</span> {itemData.classificationType}</p>
                </div>
              </div>
            </div>
            {/* <div className='col'>
              <div className="detail-section">
                <h2>Approval Workflow</h2>
                <div className="detail-row">
                  <p className="detail-item"><span className="detail-label">Author(s):</span> Approval stages and approvers</p>
                </div>
              </div>
            </div> */}
            <div className='col'>
              <div className="detail-section">
                <h2>Access Control</h2>
                <div className="detail-row">
                  <p className="detail-item"><span className="detail-label">Detail(s):</span> {itemData.accessDetails}</p>
                </div>
              </div>
            </div>
          </div>

        </Tab>


        <Tab eventKey="changes" title="Changes">
          <div className="changes-summary">
            <h3>Summary of Changes</h3>
            <p>Total Change Requests: <strong>10</strong></p>
            <p>Approved: <strong>4</strong></p>
            <p>Pending Approval: <strong>3</strong></p>
            <p>Rejected: <strong>2</strong></p>
            <p>In Review: <strong>1</strong></p>
          </div>

          
          <ChangeRequestsTable/>

          <div className="revision-log">
            <h3>Revision Log</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Revision Number</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Author</th>
                  <th>Change Request ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.0</td>
                  <td>Initial creation of the document.</td>
                  <td>01/01/2021</td>
                  <td>John Doe</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>1.1</td>
                  <td>Added section on safety protocols.</td>
                  <td>02/15/2021</td>
                  <td>Jane Smith</td>
                  <td>CR123</td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </Tab>


        <Tab eventKey="history" title="History">
          <HistoryGraph completedChangeRequests={completedChangeRequests} />
        </Tab>

        <Tab eventKey="relatedObjects" title="Related Objects">
          <RelatedObjects/>
        </Tab>
        <Tab eventKey="reviewsApprovals" title="Reviews & Approvals">
          <div className="reviews-approvals">
            <h3>Change Request Reviews</h3>
            {changeRequests.map((cr, index) => (
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
                    {cr.reviews.map((review, index) => (
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
            ))}
          </div>
        </Tab>
      </Tabs>
      </div>
    </div>
  );
};

export default Item;
