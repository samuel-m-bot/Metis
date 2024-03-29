import React, { useState } from 'react';
import { Tab, Tabs, Button } from 'react-bootstrap';
import ReviewDecisionTab from './ReviewDecisionTab';
import './ChangeRequest.css'

const ChangeRequestReview = () => {
  const [key, setKey] = useState('details');

  const handleDownload = () => {
    const documentUrl = `documents/sample-document.pdf`;
    console.log(documentUrl)
  
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = documentUrl;
    link.setAttribute("download", "sample-document.pdf"); 
    document.body.appendChild(link);
  
    link.click();
  
    document.body.removeChild(link);
  };
  
  return (
    <div className="change-request-review-container">
      <Tabs
        id="change-request-review-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details" className="change-request-details-tab">
            <div className="change-request-details">
                <h3>Change Request Details</h3>
                <p><strong>ID:</strong> CR001</p>
                <p><strong>Title:</strong> Update Safety Protocols</p>
                <p><strong>Description:</strong> This change request aims to update the safety protocols to align with new regulatory standards introduced in Q1 2023.</p>
                <p><strong>Requested By:</strong> Jane Doe</p>
                <p><strong>Priority:</strong> High</p>
                <p><strong>Status:</strong> Pending Review</p>
            </div>
            
            <div className="item-to-review">
                <h3>Item to Review</h3>
                <p>The following document outlines the proposed changes to the safety protocols:</p>
                <Button variant="primary" onClick={handleDownload}>Download Document</Button>
            </div>
            </Tab>

        <Tab eventKey="reviewDecision" title="Review & Decision">
            <ReviewDecisionTab/>
        </Tab>

        <Tab eventKey="historyComments" title="History & Comments">
          <div className="change-request-history-comments">
            <div className="history-log">
              <h3>Change Request History</h3>
              <ul className="list-group">
                <li className="list-group-item">2022-09-15: Change request created by Jane Doe</li>
                <li className="list-group-item">2022-09-16: Status updated to "Under Review" by Project Manager</li>
                <li className="list-group-item">2022-09-17: Feedback added by Design Lead</li>
                <li className="list-group-item">2022-09-20: Status updated to "Pending Approval" by Compliance Officer</li>
              </ul>
            </div>

            <div className="comments-section">
              <h3>Comments</h3>
              <div className="comments-list">
                <div className="comment">
                  <p className="comment-author">Jane Doe - <small>2022-09-16</small></p>
                  <p className="comment-text">"I've added the initial requirements. Please review and provide feedback."</p>
                </div>
                <div className="comment">
                  <p className="comment-author">John Smith - <small>2022-09-17</small></p>
                  <p className="comment-text">"Reviewed. Please see the attached document for my detailed feedback."</p>
                </div>
              </div>
              <form className="new-comment-form">
                <textarea className="form-control" placeholder="Write a comment..." rows="3"></textarea>
                <button type="submit" className="btn btn-primary mt-2">Post Comment</button>
              </form>
            </div>
          </div>
        </Tab>

        <Tab eventKey="relatedDocuments" title="Related Documents & Items">
          <div className="related-documents-items">
            <h3>Related Documents</h3>
            <ul className="related-documents-list">
              <li>Project Proposal (Document ID: DOC-001)</li>
              <li>Safety Protocol Revision (Document ID: DOC-002)</li>
            </ul>

            <h3>Related Items</h3>
            <ul className="related-items-list">
              <li>New Product Design (Design ID: DES-001)</li>
              <li>Compliance Checklist (Product ID: PROD-001)</li>
            </ul>
          </div>
        </Tab>
      </Tabs>
    </div>
  );

  function handleReviewDecision(decision) {
    console.log(`Decision made: ${decision}`);
  }
};

export default ChangeRequestReview;
