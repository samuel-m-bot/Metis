import React from 'react';
import Modal from 'react-bootstrap/Modal';
import EditDocumentForm from '../documents/EditDocumentForm'
import EditDesignForm from '../designs/EditDesignForm'
import EditProductForm from '../products/EditProductForm'

const EditItemModal = ({ show, itemType, closeModal, projectId, itemData }) => {
    const renderForm = () => {
        switch (itemType) {
            case 'Product':
                return <EditProductForm projectId={projectId} itemData={itemData} closeModal={closeModal} />;
            case 'Design':
                return <EditDesignForm projectId={projectId} itemData={itemData} closeModal={closeModal} />;
            case 'Document':
                return <EditDocumentForm projectId={projectId} document={itemData} closeModal={closeModal} />;
            default:
                return <p>No form available for this type.</p>;
        }
    };

    return (
        <Modal show={show} onHide={closeModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit {itemType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderForm()}
            </Modal.Body>
        </Modal>
    );
};

export default EditItemModal;
