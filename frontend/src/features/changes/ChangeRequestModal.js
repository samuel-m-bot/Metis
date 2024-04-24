import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import NewChangeRequestForm from './NewChangeRequestForm';
import ReviewerSelectionModal from '../../components/ReviewerSelectionModal';

const ChangeRequestModal = ({ show, handleClose, projectId, mainItemId, itemType }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdChangeRequest, setCreatedChangeRequest] = useState(null);

  const handleCreateSuccess = (changeRequest) => {
    setCreatedChangeRequest(changeRequest);
    setCurrentStep(2); // Move to reviewer selection step after successful creation
  };

  return (
    <Modal show={show} onHide={() => {
      handleClose();
      setCurrentStep(1);
      setCreatedChangeRequest(null);
    }} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{currentStep === 1 ? 'Make a Change Request' : 'Select Reviewers'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentStep === 1 ? (
          <NewChangeRequestForm
            projectId={projectId}
            mainItemId={mainItemId}
            itemType={itemType}
            closeModal={handleClose}
            onSuccess={handleCreateSuccess}
          />
        ) : (
          <ReviewerSelectionModal
            show={currentStep === 2}
            handleClose={() => {
              handleClose();
              setCurrentStep(1);
            }}
            changeRequestData={createdChangeRequest}
            isChangeRequest={true}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ChangeRequestModal;
