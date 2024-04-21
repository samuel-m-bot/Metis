import React from 'react';
import Modal from 'react-bootstrap/Modal';
import NewDocumentForm from '../features/documents/NewDocumentForm';
import NewDesignForm from '../features/designs/NewDesignForm';
import NewProductForm from '../features/products/NewProductForm';

const CreationModal = ({ show, taskType, closeModal, projectId, task }) => {
    const renderForm = () => {
        switch (taskType) {
            case 'Product':
                return <NewProductForm />;
            case 'Design':
                return <NewDesignForm />;
            case 'Document':
                console.log(projectId)
                return <NewDocumentForm projectId={projectId} task={task} closeModal={closeModal}/>;
            default:
                return <p>No form available for this type</p>;
        }
    };

    return (
        <Modal show={show} onHide={closeModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create New {taskType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderForm()}
            </Modal.Body>
        </Modal>
    );
};

export default CreationModal;
