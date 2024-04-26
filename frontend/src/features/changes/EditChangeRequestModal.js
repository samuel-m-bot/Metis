import { Modal } from 'react-bootstrap';
import EditChangeRequestForm from './EditChangeRequestForm';

const EditChangeRequestModal = ({ show, handleClose, projectId, mainItemId, changeRequest }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Change Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditChangeRequestForm
          projectId={projectId}
          changeRequest={changeRequest}
          mainItemId={mainItemId}
          closeModal={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditChangeRequestModal;
