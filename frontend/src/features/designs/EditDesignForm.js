import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateDesignMutation, useDeleteDesignMutation } from './designsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import { useGetDesignsQuery } from "../designs/designsApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const EditDesignForm = ({ design }) => {
    const navigate = useNavigate();
    const [updateDesign] = useUpdateDesignMutation();
    const [deleteDocument] = useDeleteDesignMutation();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: products, isFetching: isFetchingProducts, isError: isProductsError } = useGetProductsQuery();
    const { data: designs, isFetching: isFetchingDesigns, isError: isDesignsError } = useGetDesignsQuery();

    const [designId, setDesignId] = useState(design.designId);
    const [productID, setProductID] = useState(design.productID);
    const [name, setName] = useState(design.name);
    const [description, setDescription] = useState(design.description);
    const [type, setType] = useState(design.type);
    const [revisionNumber, setRevisionNumber] = useState(design.revisionNumber);
    const [revisionError, setRevisionError] = useState('');
    const [status, setStatus] = useState(design.status);
    const [designers, setDesigners] = useState(design.designers);
    const [file, setFile] = useState(null);
    const [classification, setClassification] = useState(document.classification);
    

    const handleRevisionChange = (e) => {
        setRevisionNumber(e.target.value);
        if (revisionError) setRevisionError(''); // Clear error if previously set
    };

    const onSaveChanges = async (event) => {
        event.preventDefault();  // This will prevent the default form submission behavior
        const formData = new FormData();
        formData.append('designId', designId);
        formData.append('productID', productID);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('revisionNumber', revisionNumber);
        formData.append('status', status);
        formData.append('designers', designers);
        if (file) {  // Make sure a file is selected
            formData.append('designImage', file);
        }
        formData.append('classification', classification);
    
        try {
            await updateDesign({id: design._id, formData}).unwrap();
            navigate('/admin-dashboard/designs');
        } catch (error) {
            console.error('Failed to update the design:', error);
        }
    };    

    const onDeleteDesignClicked = async () => {
        await deleteDocument({ id: document.id });
        navigate('/admin-dashboard/users')
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
            <h2>Edit Design</h2>
            {console.log(design)}
            <form encType="multipart/form-data" onSubmit={onSaveChanges}>
            <div className="mb-3">
                    <label htmlFor="designId" className="form-label">Design:</label>
                    <select
                        className="form-select"
                        id="designId"
                        value={designId}
                        onChange={e => setDesignId(e.target.value)}
                    >
                        <option value="">Select a design</option>
                        {designs?.ids.map(id => (
                            <option key={id} value={id}>
                                {designs.entities[id].name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    {console.log(design)}
                    <label htmlFor="productId" className="form-label">Product:</label>
                    <select 
                        className="form-select" 
                        id="productId" 
                        value={productID} 
                        onChange={e => setProductID(e.target.value)} 
                        required
                    >
                        <option value="">Select a Product</option>
                        {products?.ids.map((id) => (
                            <option key={id} value={id}>{products.entities[id].name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Design Name:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} />
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
                    <label htmlFor="designers" className="form-label">Designers:</label>
                    <select className="form-select" id="designers" value={designers} onChange={e => setDesigners(e.target.value)}>
                        <option value="">Select a Designers</option>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Design File</label>
                    <input type="file" className="form-control" id="file" onChange={e => setFile(e.target.files[0])} />
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
                <button type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSave} /> Save Changes
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeleteDesignClicked}>
                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                </button>
            </form>
        </div>
    );
};

export default EditDesignForm;
