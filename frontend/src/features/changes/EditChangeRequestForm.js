import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateChangeRequestMutation, useDeleteChangeRequestMutation } from './changeRequestsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProjectsQuery } from '../projects/projectsApiSlice';
import { useGetDocumentsQuery } from '../documents/documentsApiSlice';
import { useGetDesignsQuery } from '../designs/designsApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import useAuth from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditChangeRequestForm = ({ changeRequest }) => {
    const navigate = useNavigate();
    const [updateChangeRequest, { isLoading }] = useUpdateChangeRequestMutation();
    const [deleteChangeRequest] = useDeleteChangeRequestMutation();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError  } = useGetUsersQuery();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();
    const { data: documents, isFetching: isFetchingDocuments, isError: isDocumentsError } = useGetDocumentsQuery();
    const { data: designs, isFetching: isFetchingDesigns, isError: isDesignsError } = useGetDesignsQuery();
    const { data: products, isFetching: isFetchingProducts, isError: isProductsError } = useGetProductsQuery();
    const {id} = useAuth()

    console.log(changeRequest)
    const [projectId, setProjectId] = useState(changeRequest.projectId);
    const [description, setDescription] = useState(changeRequest.description);
    const [status, setStatus] = useState(changeRequest.status);
    const [priority, setPriority] = useState(changeRequest.priority);
    const [assignedTo, setAssignedTo] = useState(changeRequest.assignedTo);
    const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(
        changeRequest.estimatedCompletionDate 
          ? new Date(changeRequest.estimatedCompletionDate).toISOString().split('T')[0] 
          : ''
      );      
    const [type, setType] = useState('');
    const [relatedDocuments, setRelatedDocuments] = useState(changeRequest.relatedDocuments);
    const [relatedDesigns, setRelatedDesigns] = useState(changeRequest.relatedDesigns);
    const [relatedProducts, setRelatedProducts] = useState(changeRequest.relatedProducts);

    const handleMultiSelectChange = (event, setState) => {
        const values = Array.from(event.target.selectedOptions, option => option.value);
        setState(values);
    };

    useEffect (() => {
        if (changeRequest.relatedDocuments !== undefined || changeRequest.relatedDocuments.length != 0) {
            setType("Document")
        }else if(changeRequest.relatedDesigns !== undefined || changeRequest.relatedDesigns.length != 0){
            setType("Design")
        }else setType("Product")
    }, [changeRequest])
    const onSaveChangeRequestClicked = async () => {
        const updatedChangeRequest = {
            id: changeRequest.id,
            requestedBy: id,
            projectId,
            description,
            status,
            priority,
            assignedTo,
            estimatedCompletionDate
        };

        if(relatedDocuments!=='' && type ==='Document' ) updatedChangeRequest.relatedDocuments = relatedDocuments
        if(relatedDesigns!='' && type ==='Design') updatedChangeRequest.relatedDesigns = relatedDesigns
        if(relatedProducts!='' && type ==='Product') updatedChangeRequest.relatedProducts = relatedProducts

        try {
            await updateChangeRequest(updatedChangeRequest).unwrap();
            navigate('/admin-dashboard/change-requests');
        } catch (error) {
            console.error('Failed to update changeRequest:', error);
        }
    };

    const onDeleteChangeRequestClicked = async () => {
        await deleteChangeRequest({ id: changeRequest.id });
        navigate('/admin-dashboard/change-requests');
    };

    if (isFetchingUsers || isFetchingProjects ) return <p>Loading...</p>;
    if (isUsersError || isProjectsError) return <p>Error loading data.</p>;

    return (
        <div className="container mt-3">
            <h2>Edit Change Request</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="projectId" className="form-label">Project:</label>
                    <select
                        className="form-select"
                        id="projectId"
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                    >
                        <option value="">Select a project</option>
                        {projects?.ids.map(id => (
                            <option key={id} value={id}>
                                {projects.entities[id].name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="Requested">Requested</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Priority:</label>
                    <select
                        className="form-select"
                        id="priority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="assignedTo" className="form-label">Assigned To:</label>
                    <select
                        className="form-select"
                        id="assignedTo"
                        value={assignedTo}
                        onChange={e => setAssignedTo(e.target.value)}
                    >
                        <option value="">Select a user</option>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="estimatedCompletionDate" className="form-label">Estimated Completion Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="estimatedCompletionDate"
                        value={estimatedCompletionDate}
                        onChange={e => setEstimatedCompletionDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type:</label>
                    <select
                        className="form-select"
                        id="type"
                        value={type}
                        onChange={e => {
                            setType(e.target.value);
                        }}
                    >
                        <option value="Document">Document</option>
                        <option value="Design">Design</option>
                        <option value="Product">Product</option>
                    </select>
                </div>
                {type === 'Document' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="relatedDocuments" className="form-label">Related Documents:</label>
                            <select multiple className="form-select" id="relatedDocuments" value={relatedDocuments} onChange={(e) => handleMultiSelectChange(e, setRelatedDocuments)}>
                                {documents?.ids.map(documentId => (
                                    <option key={documentId} value={documentId}>{documents.entities[documentId].title}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                {type === 'Design' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="relatedDesigns" className="form-label">Related Designs:</label>
                            <select multiple className="form-select" id="relatedDesigns" value={relatedDesigns} onChange={(e) => handleMultiSelectChange(e, setRelatedDesigns)}>
                                {designs?.ids.map(designId => (
                                    <option key={designId} value={designId}>{designs.entities[designId].name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                {type === 'Product' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="relatedProducts" className="form-label">Related Products:</label>
                            <select multiple className="form-select" id="relatedProducts" value={relatedProducts} onChange={(e) => handleMultiSelectChange(e, setRelatedProducts)}>
                                {products?.ids.map(productId => (
                                    <option key={productId} value={productId}>{products.entities[productId].title}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                <button type="button" className="btn btn-primary" onClick={onSaveChangeRequestClicked} disabled={isLoading}>
                    Save Change Request
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeleteChangeRequestClicked}>
                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </button>
            </form>
        </div>
    );
};

export default EditChangeRequestForm;
