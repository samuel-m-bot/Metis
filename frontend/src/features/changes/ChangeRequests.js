import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import './ChangeRequest.css'

const ChangeRequest = () => {
  const [key, setKey] = useState('details');

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
  ];

  
  return (
    <div className="change-request-container">
      <Tabs
        id="change-request-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab disabled eventKey="Title" title={<span style={{ color: '#287379', fontWeight: 'bold', fontSize: 'x-large' }}>CR001 - CWF</span>}></Tab>
        <Tab eventKey="details" title="Details">
          <div className="change-request-details">
            <div className="general-information">
              <h3>General Information</h3>
              <p><strong>ID:</strong> CR001</p>
              <p><strong>Title:</strong> Implement New Compliance Standards</p>
              <p><strong>Item Affected:</strong> Safety Protocols (Design)</p>
              <p><strong>Status:</strong> Pending Approval</p>
              <p><strong>Request Date:</strong> 2022-09-15</p>
              <p><strong>Requested By:</strong> Jane Doe</p>
            </div>

            <div className="rationale">
              <h3>Rationale for Change</h3>
              <p>The change is necessitated by updated compliance standards affecting our main product line. Adherence to these standards ensures continued market competitiveness.</p>
            </div>

            <div className="impact-analysis">
              <h3>Impact Analysis</h3>
              <p>The change will have the following impacts:</p>
              <ul>
                <li>Product Design: Requires redesign of core components.</li>
                <li>Manufacturing: Adjustments to the manufacturing process.</li>
                <li>Estimated Costs: Expected to increase project budget by 10%.</li>
              </ul>
            </div>

            <div className="approvals">
              <h3>Approvals</h3>
              <p><strong>Design Lead:</strong> Pending</p>
              <p><strong>Production Manager:</strong> Approved</p>
              <p><strong>Finance Department:</strong> Reviewing</p>
            </div>
          </div>
        </Tab>

        <Tab eventKey="impactAnalysis" title="Impact Analysis">
        </Tab>
        <Tab eventKey="reviewsApprovals" title="Reviews & Approvals">
          <div className="reviews-approvals">
            <h3>Change Request Reviews</h3>
            <p>This section provides an overview of each change request's review process, including reviewer feedback and approval status.</p>

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

        <Tab eventKey="implementationPlan" title="Implementation Plan">
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
};

export default ChangeRequest;
