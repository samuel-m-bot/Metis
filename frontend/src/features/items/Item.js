import React, { useState } from 'react';
import { Tab, Tabs, ButtonGroup, Dropdown, Button } from 'react-bootstrap';
import './Item.css'
// import ChangeRequestsTable from '../../components/ChangeRequestsTable ';
import ChangeRequestsTable from '../changes/ChangeRequestsTable';
import HistoryGraph from '../../components/HistoryGraph';
import RelatedObjects from '../../components/RelatedObjects';
import ItemActions from './ItemActions';

const Item = ({ itemType, itemData, changeRequests, completedChangeRequests }) => {
  const [key, setKey] = useState('details');
  const [showModal, setShowModal] = useState(false);
  console.log(itemData)

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDownload = () => {
    // Depending on the item type, the path may differ
    // const basePath = `${process.env.PUBLIC_URL}/path/to/your/files`;
    // const documentUrl = `${basePath}/${itemData.attachment?.fileName || 'default.pdf'}`;

    // const link = document.createElement("a");
    // link.href = documentUrl;
    // link.setAttribute("download", "");
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="item-container">
      <div className="actions-and-tabs-container">
        <ItemActions itemType={itemType} itemData={itemData} />

        <Tabs
          id="item-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="details" title="Details" className="document-details">
            <div className="detail-section">
              <h2>General Details</h2>
              <div className="detail-row">
                <p className="detail-item"><span className="detail-label">Item Title:</span>{itemData.name || itemData.title}</p>
                <p className="detail-item"><span className="detail-label">Item ID:</span> {itemData.id}</p>
                <p className="detail-item"><span className="detail-label">Version:</span> {itemData.revisionNumber}</p>
                <p className="detail-item"><span className="detail-label">Status:</span> {itemData.status}</p>
                <p className="detail-item">
                  <span className="detail-label">Creation Date:</span>
                  {new Date(itemData.createdAt || itemData.creationDate).toLocaleDateString()}
                </p>
                <p className="detail-item">
                  <span className="detail-label">Last Modified:</span>
                  {new Date(itemData.updatedAt || itemData.lastModifiedDate).toLocaleDateString()}
                </p>
                <Button onClick={handleDownload} variant="primary">Download Item</Button>
              </div>
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
              {['Document', 'Design'].includes(itemType) && (
                <div className='col'>
                  <div className="detail-section">
                    <h2>{itemType === 'Document' ? 'Authors' : 'Designers'}</h2>
                    <div className="detail-row">
                      <p className="detail-item">
                        <span className="detail-label">{itemType === 'Document' ? 'Author(s):' : 'Designer(s):'}</span>
                        {itemType === 'Document' ? itemData.authors?.join(', ') : itemData.designers?.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='row'>
              <div className='col'>
                <div className="detail-section">
                  <h2>Classification</h2>
                  <div className="detail-row">
                    <p className="detail-item"><span className="detail-label">Type:</span> {itemData.type}</p>
                  </div>
                </div>
              </div>
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
          {console.log(itemData.id)}
          {itemData.id && (
            <>
             {console.log("Before table")}
             <ChangeRequestsTable mainItemId={itemData.id} />
            </>

          )}

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
