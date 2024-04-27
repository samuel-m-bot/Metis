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
import RevisionLog from '../activity/RevisionLog';


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

          <RevisionLog itemData={itemData} />
          
        </Tab>


        <Tab eventKey="history" title="History">
          <HistoryGraph revisions={itemData.revisions} />
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
