import React, { useState } from 'react';
import { Tab, Tabs, ButtonGroup, Dropdown, Button } from 'react-bootstrap';
import './Item.css'
// import ChangeRequestsTable from '../../components/ChangeRequestsTable ';
import ChangeRequestsTable from '../changes/ChangeRequestsTable';
import HistoryGraph from '../../components/HistoryGraph';
import RelatedObjects from '../../components/RelatedObjects';
import ItemActions from './ItemActions';
import ReviewsApprovalsTab from '../reviews/ReviewsApprovalsTab';
import ItemDetails from './ItemDetails';


const Item = ({ itemType, itemData, completedChangeRequests }) => {
  const [key, setKey] = useState('details');
  console.log(itemType)

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
            <ItemDetails itemData={itemData} itemType={itemType} />
          </Tab>


        <Tab eventKey="changes" title="Changes">
          {console.log(itemData.id)}
          {itemData.id && (
            <>
             <h2>Change Request for Item</h2>
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
          <ReviewsApprovalsTab projectId={itemData.id} />
        </Tab>
        
      </Tabs>
      </div>
    </div>
  );
};

export default Item;
