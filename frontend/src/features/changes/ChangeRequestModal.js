// ChangeRequestModal.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ChangeRequestModal = ({ show, handleClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [changeRequestData, setChangeRequestData] = useState({
    title: '',
    description: '',
    priority: '',
    estimatedCompletionDate: '',
    relatedItems: [] 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeRequestData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDownload = () => {
    console.log("Downloading affected item...");
  };
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRelatedItemChange = (e) => {
    const { value, checked } = e.target;
    setChangeRequestData(prevData => ({
      ...prevData,
      relatedItems: checked 
        ? [...prevData.relatedItems, value]
        : prevData.relatedItems.filter(item => item !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(changeRequestData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Make a Change Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentStep === 1 && (
          <Form>
            <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={changeRequestData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={changeRequestData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          {/* Priority */}
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={changeRequestData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>
          
          {/* Affected Item */}
          <Form.Group className="mb-3">
            <Form.Label>Affected Item</Form.Label>
            <div className="d-flex align-items-center">
              <span className="me-2">sample.pdf</span>
              <Button variant="outline-primary" size="sm" onClick={handleDownload}>Download</Button>
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Estimated Completion Date</Form.Label>
            <Form.Control
              type="date"
              name="estimatedCompletionDate"
              value={changeRequestData.estimatedCompletionDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
            <Button variant="secondary" onClick={handleNext}>Next</Button>
          </Form>
        )}

        {currentStep === 2 && (
          <Form onSubmit={handleSubmit}>
            <h5>Specify Related Items</h5>
            <Form.Check 
              type="checkbox" 
              label="Item 1" 
              name="relatedItems" 
              value="Item1"
              onChange={handleRelatedItemChange} 
            />
            <Form.Check 
              type="checkbox" 
              label="Item 2" 
              name="relatedItems" 
              value="Item2"
              onChange={handleRelatedItemChange} 
            />
            
            <div className="mt-3">
              <Button variant="secondary" onClick={handleBack} className="me-2">Back</Button>
              <Button variant="primary" type="submit">Submit Request</Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ChangeRequestModal;
