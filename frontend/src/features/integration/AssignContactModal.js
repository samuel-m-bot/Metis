import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useUpdateProjectCustomerMutation, useGetProjectsQuery } from '../projects/projectsApiSlice'; // Import the query hook

const AssignContactModal = ({ show, onHide, contactId }) => {
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [updateProjectCustomer, { isLoading: isUpdating, isSuccess, isError, error }] = useUpdateProjectCustomerMutation();
    const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError } = useGetProjectsQuery();

    const handleAssignContact = async () => {
        if (selectedProjectId && contactId) {
            await updateProjectCustomer({ projectId: selectedProjectId, customerId: contactId })
                .unwrap()
                .then(() => {
                    console.log(`Contact ${contactId} successfully assigned to project ${selectedProjectId}`);
                    onHide();  // Close the modal after successful assignment
                })
                .catch(error => {
                    console.error('Failed to assign contact:', error);
                });
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Assign Contact to Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Select Project</Form.Label>
                        <Form.Control as="select" value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} disabled={isProjectsLoading}>
                            <option value="">Select a project</option>
                            {projects?.ids.map(projectId => (
                                <option key={projectId} value={projectId}>{projects.entities[projectId].name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {isProjectsError && <div className="alert alert-danger">Error loading projects</div>}
                    {isError && <div className="alert alert-danger">Error: {error?.data?.message || 'Failed to assign contact'}</div>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleAssignContact} disabled={isUpdating || !selectedProjectId}>
                    {isUpdating ? 'Assigning...' : 'Assign'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AssignContactModal;
