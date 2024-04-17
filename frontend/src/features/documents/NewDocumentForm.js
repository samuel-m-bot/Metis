import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewDocumentMutation } from './documentsApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProjectsQuery } from "../projects/projectsApiSlice";

const NewDocumentForm = () => {
    const navigate = useNavigate();
    const [addNewDocument, { isLoading }] = useAddNewDocumentMutation();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();

    const [projectId, setProjectId] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [revisionNumber, setRevisionNumber] = useState('');
    const [revisionError, setRevisionError] = useState('');
    const [authors, setAuthors] = useState('');
    const [status, setStatus] = useState('Draft');
    const [file, setFile] = useState(null);

    const handleRevisionChange = (e) => {
        // Allows input changes without immediate validation for flexibility
        setRevisionNumber(e.target.value);
        if (revisionError) setRevisionError(''); // Clear error if previously set
    };

    const handleMultiSelectChange = (event, setState) => {
        const values = Array.from(event.target.selectedOptions, option => option.value);
        setState(values);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('title', title);
        formData.append('type', type);
        formData.append('description', description);
        formData.append('revisionNumber', revisionNumber);
        authors.forEach(author => formData.append('authors', author));
        formData.append('status', status);
        formData.append('documentFile', file);

        try {
            await addNewDocument({formData}).unwrap();
            navigate('/admin-dashboard/documents');
        } catch (error) {
            console.error('Failed to create document:', error);
        }
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
    
    if (isFetchingUsers || isFetchingProjects ) return <p>Loading...</p>;
    if (isUsersError || isProjectsError) return <p>Error loading data.</p>;
    return (
        <div classTitle="container mt-3">
            <h1>Create New Document</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                <div classTitle="mb-3">
                    <label htmlFor="title" classTitle="form-label">Title:</label>
                    <input type="text" classTitle="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="type" classTitle="form-label">Type:</label>
                    <select classTitle="form-select" id="type" value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="Requiremnts">Requiremnts</option>
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
                <div className="mb-3">
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
                <div className="mb-3">
                    <label htmlFor="authors" className="form-label">Authors:</label>
                    <select multiple className="form-select" id="authors" value={authors} onChange={(e) => handleMultiSelectChange(e, setAuthors)}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="status" classTitle="form-label">Status:</label>
                    <select classTitle="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Revised">Revised</option>
                        <option value="Approved">Approved</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                        <option value="Checked Out">Checked Out</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>
                <div classTitle="mb-3">
                    <label htmlFor="file" classTitle="form-label">Document File:</label>
                    <input type="file" classTitle="form-control" id="file" onChange={e => setFile(e.target.files[0])} required />
                </div>
                <button type="submit" classTitle="btn btn-primary" disabled={isLoading}>Create Document</button>
            </form>
        </div>
    );
};

export default NewDocumentForm;