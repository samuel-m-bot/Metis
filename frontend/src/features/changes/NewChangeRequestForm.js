import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewChangeRequestMutation } from './changeRequestsApiSlice';
import { useGetProjectTeamMembersQuery } from "../projects/projectsApiSlice";
import { useGetDocumentsByProjectIdQuery } from '../documents/documentsApiSlice';
import { useGetDesignsByProjectIdQuery } from '../designs/designsApiSlice';
import { useGetProductsByProjectIdQuery } from '../products/productsApiSlice';
import useAuth from '../../hooks/useAuth';

const NewChangeRequestForm = ({ projectId, closeModal, mainItemId, itemType, onSuccess }) => {
    const navigate = useNavigate();
    const [addNewChangeRequest, { isLoading }] = useAddNewChangeRequestMutation();
    const { data: teamMembers } = useGetProjectTeamMembersQuery(projectId);
    const { data: documents, isError: isDocumentsError } = useGetDocumentsByProjectIdQuery(projectId);
    const { data: designs, isError: isDesignsError } = useGetDesignsByProjectIdQuery(projectId);
    const { data: products, isError: isProductsError } = useGetProductsByProjectIdQuery(projectId);
    const { id, isAdmin } = useAuth()

    console.log(teamMembers)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
    const [relatedDocuments, setRelatedDocuments] = useState([]);
    const [relatedDesigns, setRelatedDesigns] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [mainItem, setMainItem] = useState(mainItemId);
    const [onModel, setOnModel] = useState(itemType);
    const [changeType, setChangeType] = useState('');
    const [riskAssessment, setRiskAssessment] = useState('');
    const [impactLevel, setImpactLevel] = useState('');
    const [revisionType, setRevisionType] = useState('');

    useEffect(() => {
        setMainItem(mainItemId);
        setOnModel(itemType);
        console.log(onModel)
    }, [mainItemId, itemType]);

    const handleMultiSelectChange = (event, setState) => {
        setState(Array.from(event.target.selectedOptions, option => option.value));
    };

    const onSaveChangeRequestClicked = async () => {
        const changeRequestData = {
            requestedBy: id,
            projectId,
            title,
            description,
            status,
            priority,
            assignedTo,
            estimatedCompletionDate,
            mainItem,
            onModel,
            relatedDocuments,
            relatedDesigns,
            relatedProducts,
            changeType,
            riskAssessment,
            impactLevel,
            revisionType
        };

        try {
            const createdChangeRequest = await addNewChangeRequest(changeRequestData).unwrap();
            onSuccess(createdChangeRequest);
            if(isAdmin) {
                navigate('/admin-dashboard/designs');
            }
        } catch (error) {
            console.error('Failed to save the change request:', error);
        }
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="container mt-3">
            <h2>Create New Change Request</h2>
            <form>
                {/* Title */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                {/* changeType */}
                <div className="mb-3">
                    <label htmlFor="changeType" className="form-label">Change Type:</label>
                    <select className="form-select" id="changeType" value={changeType} onChange={e => setChangeType(e.target.value)}>
                        <option value="">Select change type...</option>
                        {['Corrective', 'Preventive', 'Enhancement'].map(changeTypeOption => (
                            <option key={changeTypeOption} value={changeTypeOption}>{changeTypeOption}</option>
                        ))}
                    </select>
                </div>
                {/* Description */}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                {/* riskAssessment */}
                <div className="mb-3">
                    <label htmlFor="riskAssessment" className="form-label">Risk Assessment:</label>
                    <textarea className="form-control" id="riskAssessment" value={riskAssessment} onChange={e => setRiskAssessment(e.target.value)} required />
                </div>
                {/* Status */}
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select className="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="">Select Status...</option>
                        <option value="Requested">Requested</option>
                        {isAdmin && ['Approved', 'Rejected'].map(statusOption => (
                            <option key={statusOption} value={statusOption}>{statusOption}</option>
                        ))}
                    </select>
                </div>
                {/* revisionType */}
                <div className="mb-3">
                    <label htmlFor="revisionType" className="form-label">Revision Type:</label>
                    <select className="form-select" id="revisionType" value={revisionType} onChange={e => setRevisionType(e.target.value)}>
                        <option value="">Select Revision Type...</option>
                        {['Major', 'Minor'].map(statusOption => (
                            <option key={statusOption} value={statusOption}>{statusOption}</option>
                        ))}
                    </select>
                </div>
                {/* impactLevel */}
                <div className="mb-3">
                    <label htmlFor="impactLevel" className="form-label">Impact Level:</label>
                    <select className="form-select" id="impactLevel" value={impactLevel} onChange={e => setImpactLevel(e.target.value)}>
                        <option value="">Select impact level...</option>
                        {['High', 'Medium', 'Low'].map(impactLevelOption => (
                            <option key={impactLevelOption} value={impactLevelOption}>{impactLevelOption}</option>
                        ))}
                    </select>
                </div>
                {/* Priority */}
                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Priority:</label>
                    <select className="form-select" id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="">Select Priority...</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                {/* Assigned To */}
                <div className="mb-3">
                    <label htmlFor="assignedTo" className="form-label">Assigned To:</label>
                    <select className="form-select" id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                        <option value="">Select a user</option>
                        {teamMembers?.teamMembers.filter(member => member.userId !== id).map(member => (
                            <option key={member.userId} value={member.userId}>
                                {member.firstName} {member.surname}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Estimated Completion Date */}
                <div className="mb-3">
                    <label htmlFor="estimatedCompletionDate" className="form-label">Estimated Completion Date:</label>
                    <input type="date" className="form-control" id="estimatedCompletionDate" value={estimatedCompletionDate} onChange={e => setEstimatedCompletionDate(e.target.value)} />
                </div>
                {/* Related Documents, Designs, and Products */}
                {/* Exclude main item from the related lists */}
                <div className="mb-3">
                    <label htmlFor="relatedDocuments" className="form-label">Related Documents:</label>
                    {isDocumentsError ? (
                        <p>No available documents to select</p>
                    ) : (
                        <select multiple className="form-select" id="relatedDocuments" value={relatedDocuments} onChange={e => handleMultiSelectChange(e, setRelatedDocuments)}>
                            {documents?.ids.filter(docId => docId !== mainItemId).map(documentId => (
                                <option key={documentId} value={documentId}>{documents.entities[documentId].title}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="relatedDesigns" className="form-label">Related Designs:</label>
                    {isDesignsError ? (
                        <p>No available designs to select</p>
                    ) : (
                        <select multiple className="form-select" id="relatedDesigns" value={relatedDesigns} onChange={(e) => handleMultiSelectChange(e, setRelatedDesigns)}>
                            {designs?.ids.filter(designId => designId !== mainItemId).map(designId => (
                                <option key={designId} value={designId}>{designs.entities[designId].name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="relatedProducts" className="form-label">Related Products:</label>
                    {isProductsError ? (
                        <p>No available products to select</p>
                    ) : (
                        <select multiple className="form-select" id="relatedProducts" value={relatedProducts} onChange={(e) => handleMultiSelectChange(e, setRelatedProducts)}>
                            {products?.ids.filter(productId => productId !== mainItemId).map(productId => (
                                <option key={productId} value={productId}>{products.entities[productId].name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <button type="button" className="btn btn-primary" onClick={onSaveChangeRequestClicked} disabled={isLoading}>
                    Save Change Request
                </button>
            </form>
        </div>
    );
};

export default NewChangeRequestForm;