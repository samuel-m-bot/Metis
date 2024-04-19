import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewDesignMutation } from './designsApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProjectsQuery } from "../projects/projectsApiSlice";

const NewDesignForm = () => {
    const navigate = useNavigate();
    const [addNewDesign, { isLoading }] = useAddNewDesignMutation();
    const { data: products, isFetching: isFetchingProducts, isError: isProductsError } = useGetProductsQuery();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();

    const [projectId, setProjectId] = useState('');
    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [revisionNumber, setRevisionNumber] = useState('');
    const [revisionError, setRevisionError] = useState('');
    const [version, setVersion] = useState('');
    const [status, setStatus] = useState('Draft');
    const [designer, setDesigner] = useState('');
    const [file, setFile] = useState(null);
    const [classification, setClassification] = useState('');

    const handleRevisionChange = (e) => {
        // Allows input changes without immediate validation for flexibility
        setRevisionNumber(e.target.value);
        if (revisionError) setRevisionError(''); // Clear error if previously set
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('productID', productId);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('revisionNumber', revisionNumber);
        formData.append('version', version);
        formData.append('status', status);
        formData.append('designer', designer);
        formData.append('designImage', file);
        formData.append('classification', classification);

        try {
            await addNewDesign({formData}).unwrap();
            navigate('/admin-dashboard/designs');
        } catch (error) {
            console.error('Failed to create design:', error);
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
    
    if (isFetchingUsers || isFetchingProducts) return <p>Loading...</p>;
    if (isUsersError || isProductsError) return <p>Error loading data.</p>;
    return (
        <div className="container mt-3">
            <h1>Create New Design</h1>
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
                <div className="mb-3">
                    <label htmlFor="productId" className="form-label">Product:</label>
                    <select 
                        className="form-select" 
                        id="productId" 
                        value={productId} 
                        onChange={e => setProductId(e.target.value)} 
                        required
                    >
                        <option value="">Select a Product</option>
                        {products?.ids.map((id) => (
                            <option key={id} value={id}>{products.entities[id].name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type:</label>
                    <select className="form-select" id="type" value={type} onChange={e => setType(e.target.value)} required>
                        <option value="">Select Type</option>
                        <option value="Conceptual">Conceptual</option>
                        <option value="Functional">Functional</option>
                        <option value="Technical">Technical</option>
                        <option value="Prototype">Prototype</option>
                        <option value="Production">Production</option>
                        <option value="Schematic">Schematic</option>
                        <option value="Assembly">Assembly</option>
                        <option value="Detail">Detail</option>
                    </select>
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
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select className="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
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
                <div className="mb-3">
                    <label htmlFor="designer" className="form-label">Designer(s):</label>
                    <select multiple className="form-select" id="designer" value={designer}
                            onChange={e => setDesigner([...e.target.selectedOptions].map(o => o.value))}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Design File:</label>
                    <input type="file" className="form-control" id="file" onChange={e => setFile(e.target.files[0])} required />
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
                <button type="submit" className="btn btn-primary" disabled={isLoading}>Create Design</button>
            </form>
        </div>
    );
};

export default NewDesignForm;