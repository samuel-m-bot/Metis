import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewProductMutation } from './productsApiSlice';
import { PRODUCT_CATEGORIES } from '../../config/categories';
import { useGetProjectsQuery } from '../projects/projectsApiSlice';

const NewProductForm = () => {
    const navigate = useNavigate();
    const [addNewProduct, { isLoading }] = useAddNewProductMutation();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();

    const [projectId, setProjectId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [lifecycleStatus, setLifecycleStatus] = useState('Concept');
    const [revisionNumber, setRevisionNumber] = useState('');
    const [revisionError, setRevisionError] = useState('');
    const [type, setType] = useState('');
    const [classification, setClassification] = useState('');

    const [material, setMaterial] = useState('');
    const [color, setColor] = useState('');
    const [dimensions, setDimensions] = useState('');

    const [softwareType, setSoftwareType] = useState('');

    const handleRevisionChange = (e) => {
        setRevisionNumber(e.target.value);
        if (revisionError) setRevisionError('');
    };

    const onSaveProductClicked = async () => {
        const productData = {
            projectId,
            name,
            description,
            category,
            lifecycleStatus,
            revisionNumber,
            classification,
            type,
            ...(type === 'Physical' && { physicalAttributes: { material, color, dimensions } }),
            ...(type === 'Software' && { digitalAttributes: { softwareType }}),
        };

        try {
            await addNewProduct(productData).unwrap();
            navigate('/admin-dashboard/products');
        } catch (error) {
            console.error('Failed to save the product', error);
        }
    };

    const validateRevisionNumber = () => {
        const regex = /^[A-Z]*\.?\d+(\.\d+)?$/;
        if (!regex.test(revisionNumber)) {
            setRevisionError('Invalid format. Use A.1, 1.1, or similar formats.');
        } else {
            setRevisionError('');
        }
    };

    return (
        <div className="container mt-3">
            <h2>Create New Product</h2>
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
                    <label htmlFor="name" className="form-label">Product Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
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
                    <label htmlFor="category" className="form-label">Category:</label>
                    <select
                        className="form-select"
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        {Object.values(PRODUCT_CATEGORIES).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="lifecycleStatus" className="form-label">Lifecycle Status:</label>
                    <select
                        className="form-select"
                        id="lifecycleStatus"
                        value={lifecycleStatus}
                        onChange={e => setLifecycleStatus(e.target.value)}
                    >
                        <option value="">select</option>
                        <option value="Concept">Concept</option>
                        <option value="Development">Development</option>
                        <option value="Market">Market</option>
                        <option value="Retire">Retire</option>
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
                        <option value="">Select type...</option>
                        <option value="Physical">Physical</option>
                        <option value="Software">Software</option>
                        <option value="Service">Service</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {type === 'Physical' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="material" className="form-label">Material:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="material"
                                value={material}
                                onChange={e => setMaterial(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="color" className="form-label">Color:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="color"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dimensions" className="form-label">Dimensions:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="dimensions"
                                value={dimensions}
                                onChange={e => setDimensions(e.target.value)}
                            />
                        </div>
                    </>
                )}
                {type === 'Software' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="softwareType" className="form-label">Software Type:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="softwareType"
                                value={softwareType}
                                onChange={e => setSoftwareType(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <button type="button" className="btn btn-primary" onClick={onSaveProductClicked} disabled={isLoading}>
                    Save Product
                </button>
            </form>
        </div>
    );
};

export default NewProductForm;
