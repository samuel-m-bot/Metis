import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewDocumentMutation } from './documentsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProjectsQuery } from "../projects/projectsApiSlice";
import { useUpdateTaskMutation, useAddNewTaskMutation } from '../Tasks/tasksApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import useAuth from '../../hooks/useAuth';

const NewDocumentForm = ({ projectId: initialProjectId, task, closeModal }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [addNewDocument, { isLoading }] = useAddNewDocumentMutation();
    const [updateTask, { isLoadingUpdateTask }] = useUpdateTaskMutation();
    const [addNewTask, { isLoadingAddTask }] = useAddNewTaskMutation();
    const { data: users } = useGetUsersQuery();
    const { data: projects } = useGetProjectsQuery();

    const [projectId, setProjectId] = useState(initialProjectId || '');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [revisionNumber, setRevisionNumber] = useState('');
    const [revisionError, setRevisionError] = useState('');
    const [authors, setAuthors] = useState([]);
    const [status, setStatus] = useState('');
    const [file, setFile] = useState(null);
    const [classification, setClassification] = useState('');

    useEffect(() => {
        if (initialProjectId) {
            setProjectId(initialProjectId);
        }
    }, [initialProjectId]);

    const handleRevisionChange = (e) => {
        setRevisionNumber(e.target.value);
        if (revisionError) setRevisionError('');
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
        formData.append('classification', classification);
    
        try {
            const createdDocument = await addNewDocument({ formData }).unwrap();
            console.log('Created Document:', createdDocument);

            console.log('Task data:', task);

            if(task){


                const updatedTaskData = {
                    id: task.id,
                    status: 'Completed',
                    assignedDocument: createdDocument._id
                };
                await updateTask(updatedTaskData).unwrap();
        
                const taskData = {
                    projectId: projectId,
                    name: 'Set up review for newly created document',
                    description: 'Choose from a list of users who will review the document',
                    status: 'In Progress',
                    priority: task.priority,
                    assignedTo: task.assignedTo,
                    taskType: 'Set up Review',
                    relatedTo: task.relatedTo,
                    dueDate: task.dueDate || undefined,
                    assignedDocument: createdDocument._id,
                };
                // Create a new task for document review setup
                await addNewTask(taskData).unwrap();
            }
    

            closeModal(); 

            if(isAdmin) {
                navigate('/admin-dashboard/documents');
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error('Failed to create document or update task:', error);
        }
    };    

    const handleMultiSelectChange = (event) => {
        setAuthors(Array.from(event.target.selectedOptions, option => option.value));
    };

    const validateRevisionNumber = () => {
        const regex = /^[A-Z]*\.?\d+(\.\d+)?$/;
        if (!regex.test(revisionNumber)) {
            setRevisionError('Invalid format. Use A.1, 1.1, or similar formats.');
        } else {
            setRevisionError('');
        }
    };

    if (isLoading || isLoadingAddTask || isLoadingUpdateTask ) return <LoadingSpinner />;
    return (
        <div className="container mt-3">
            <h1>Create New Document</h1>
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
                            {projects?.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
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
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type:</label>
                    <select className="form-select" id="type" value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="Requirements">Requirements</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="End of Life">End of Life</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required rows="3"></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="revisionNumber" className="form-label">Revision Number:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="revisionNumber"
                        value={revisionNumber}
                        onChange={handleRevisionChange}
                        onBlur={validateRevisionNumber}
                        required
                    />
                    {revisionError && <div className="invalid-feedback d-block">{revisionError}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="authors" className="form-label">Authors:</label>
                    <select multiple className="form-select" id="authors" value={authors} onChange={(e) => handleMultiSelectChange(e, setAuthors)}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="">Select Status...</option>
                        <option value="Draft">Draft</option>
                        {isAdmin && ['In Review', 'Revised', 'Approved', 'Published', 'Archived', 'Checked Out', 'On Hold'].map(statusOption => (
                            <option key={statusOption} value={statusOption}>{statusOption}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Document File:</label>
                    <input type="file" className="form-control" id="file" onChange={e => setFile(e.target.files[0])} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="classification" className="form-label">Classification:</label>
                    <select className="form-select" id="classification" value={classification} onChange={e => setClassification(e.target.value)} required>
                        <option value="">Select Classification</option>
                        <option value="Confidential">Confidential</option>
                        <option value="Restricted">Restricted</option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>Create Document</button>
            </form>
        </div>
    );
};

export default NewDocumentForm;