import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const ReviewDecisionTab = ({ handleReviewDecision }) => {
  const [comment, setComment] = useState('');
  const [verificationChecked, setVerificationChecked] = useState(false);

  const isApproveEnabled = comment.trim() !== '' && verificationChecked;

  return (
    <div>
      <h3>Review Decision</h3>
      <p>Review the item and select your decision below:</p>
      
      <Form>
        <Form.Group className="mb-3" controlId="reviewComment">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your review comment here..."
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="verificationCheckbox">
          <Form.Check 
            type="checkbox" 
            label="I confirm that I have thoroughly reviewed the item and agree to the decision made."
            checked={verificationChecked}
            onChange={(e) => setVerificationChecked(e.target.checked)}
          />
        </Form.Group>

        <div className="decision-buttons">
          <Button 
            variant="success" 
            onClick={() => handleReviewDecision('approve')}
            disabled={!isApproveEnabled}
          >
            Approve
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleReviewDecision('disapprove')}
          >
            Disapprove
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReviewDecisionTab;
