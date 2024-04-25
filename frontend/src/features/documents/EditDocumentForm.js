import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateDocumentMutation, useGetDocumentsByProjectIdQuery, useDeleteDocumentMutation } from './documentsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import { useGetProjectsQuery } from "../projects/projectsApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth';

const EditDocumentForm = ({ projectId: initialProjectId, document, closeModal }) => {
    const navigate = useNavigate();
    const [updateDocument] = useUpdateDocumentMutation();
    const [deleteDocument] = useDeleteDocumentMutation();
    const {isAdmin} = useAuth()
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();
    const { data: products, isFetching: isFetchingProducts, isError: isProductsError } = useGetProductsQuery();
    const {
        data: projectDocuments,
        isLoading,
        isError
    } = useGetDocumentsByProjectIdQuery(document.projectId);

    const [projectId, setProjectId] = useState(document.projectId);
    const [title, setTitle] = useState(document.title);
    const [type, setType] = useState(document.type);
    const [description, setDescription] = useState(document.description);
    const [revisionNumber, setRevisionNumber] = useState(document.revisionNumber);
    const [revisionError, setRevisionError] = useState('');
    const [associatedProductIDs, setAssociatedProductIDs] = useState(document.associatedProductIDs);
    const [authors, setAuthors] = useState(document.authors || []);
    const [status, setStatus] = useState('Checked In');
    const [relatedDocuments, setRelatedDocuments] = useState(document.relatedDocuments || []);
    const [file, setFile] = useState(null);
    const [classification, setClassification] = useState(document.classification);

    useEffect(() => {
        if (initialProjectId) {
            setProjectId(initialProjectId);
        }
    }, [initialProjectId]);

    const handleRevisionChange = (e) => {
        // Allows input changes without immediate validation for flexibility
        setRevisionNumber(e.target.value);
        if (revisionError) setRevisionError(''); // Clear error if previously set
    };

    const handleMultiSelectChange = (event, setState) => {
        const values = Array.from(event.target.selectedOptions, option => option.value);
        setState(values);
    };

    useEffect(() => {
        // Assuming 'document' is the current document you are viewing/editing
        if (projectDocuments && document) {
            setRelatedDocuments(
                projectDocuments.ids
                    .filter(id => id !== document.id) // filter out the current document by id
                    .map(id => projectDocuments.entities[id]) // map ids to document entities
            );
        }
    }, [projectDocuments, document.id]);
    

    const onSaveChanges = async () => {
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('title', title);
        formData.append('type', type);
        formData.append('description', description);
        formData.append('revisionNumber', revisionNumber);
        associatedProductIDs.forEach(id => formData.append('associatedProductIDs', id));
        authors.forEach(author => formData.append('authors', author));
        formData.append('status', status);
        relatedDocuments.forEach(doc => formData.append('relatedDocuments', doc));
        formData.append('documentFile', file);
        formData.append('classification', classification);

        try {
            await updateDocument({id: document._id, formData}).unwrap();
            navigate('/admin-dashboard/documents');
        } catch (error) {
            console.error('Failed to update the document:', error);
        }
    };

    const onDeleteProjectClicked = async () => {
        await deleteDocument({ id: document.id });
        navigate('/admin-dashboard/documents')
    };

    const validateRevisionNumber = () => {
        // Validates when user finishes input (onBlur or onSubmit)
        const regex = /^[A-Z]*\.?\d+(\.\d+)?$/;
        if (!regex.test(revisionNumber)) {
            setRevisionError('Invalid format. Use A.1, 1.1, or similar formats.');
        } else {
            setRevisionError(''); // Clear error message if valid
        }
    };

    if (isFetchingUsers || isFetchingProducts || isLoading) return <p>Loading...</p>;
    if (isUsersError || isError) return <p>Error loading data.</p>;

    return (
        <div classTitle="container mt-3">
            <h2>Edit Document</h2>
            <form onSubmit={onSaveChanges} encType="multipart/form-data">
            {isAdmin && (
                    <div className="mb-3">
                        <label htmlFor="projectId" className="form-label">Project:</label>
                        <select
                            className="form-select"
                            id="projectId"
                            value={projectId}
                            onChange={e => setProjectId(e.target.value)}
                            required={!initialProjectId}
                        >
                            <option value="">Select a project</option>
                            {projects?.ids.map(projectId => (
                                <option key={projectId} value={projectId}>
                                    {projects.entities[projectId]?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {!isAdmin && initialProjectId && (
                    <div className="mb-3">
                        <label htmlFor="projectName" className="form-label">Project:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="projectName"
                            value={projects.entities[projectId]?.name || ''}
                            readOnly
                        />
                    </div>
                )}
                <div classTitle="mb-3">
                    <label htmlFor="title" classTitle="form-label">Title:</label>
                    <input type="text" classTitle="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="type" classTitle="form-label">Type:</label>
                    <select classTitle="form-select" id="type" value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="Requirements">Requirements</option>
                        <option value="Design">Design</option>
                        <option value="Devlopment">Devlopment</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Miantenance">Miantenance</option>
                        <option value="End of Life">End of Life</option>
                    </select>
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="description" classTitle="form-label">Description:</label>
                    <textarea classTitle="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
                {isAdmin && (<div className="mb-3">
                    <label htmlFor="revisionNumber">Revision Number:</label>
                    <input
                        type="text"
                        id="revisionNumber"
                        value={revisionNumber}
                        onChange={handleRevisionChange}
                        onBlur={validateRevisionNumber} 
                        required
                    />
                    {revisionError && <div style={{ color: 'red' }}>{revisionError}</div>}
                </div>
                )}
                <div className="mb-3">
                    <label htmlFor="associatedProductID" className="form-label">Associated Products:</label>
                    {isProductsError ?
                        <p>No available products to select</p> :
                        <select multiple className="form-select" id="associatedProductID" value={associatedProductIDs} onChange={(e) => handleMultiSelectChange(e, setAssociatedProductIDs)}>
                            {products.ids.map(productId => (
                                <option key={productId} value={productId}>{products.entities[productId].name}</option>
                            ))}
                        </select>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="authors" className="form-label">Authors:</label>
                    <select multiple className="form-select" id="authors" value={authors} onChange={(e) => handleMultiSelectChange(e, setAuthors)}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                {isAdmin && (<div classTitle="mb-3">
                    <label htmlFor="status" classTitle="form-label">Status:</label>
                    <select classTitle="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="">Select Status...</option>
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Revised">Revised</option>
                        <option value="Approved">Approved</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                        <option value="Checked Out">Checked Out</option>
                        <option value="Checked In">Checked In</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>
                )}
                <div className="mb-3">
                    <label htmlFor="relatedDocuments" className="form-label">Related Documents:</label>
                    <select multiple className="form-select" id="relatedDocuments" value={relatedDocuments} onChange={(e) => handleMultiSelectChange(e, setRelatedDocuments)}>
                        {projectDocuments?.ids.map(documentId => (
                            <option key={documentId} value={documentId}>{projectDocuments.entities[documentId].title}</option>
                        ))}
                    </select>
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="file" classTitle="form-label">Document File:</label>
                    <input type="file" classTitle="form-control" id="file" onChange={e => setFile(e.target.files[0])} required />
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="classification" classTitle="form-label">Classification:</label>
                    <select classTitle="form-select" id="classification" value={classification} onChange={e => setClassification(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="Confidential">Confidential</option>
                        <option value="Restricted">Restricted</option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" onClick={onSaveChanges}>
                    <FontAwesomeIcon icon={faSave} /> Save Changes
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeleteProjectClicked}>
                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                </button>
            </form>
        </div>
    );
};

export default EditDocumentForm;
