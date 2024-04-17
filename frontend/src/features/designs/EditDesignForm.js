import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateDesignMutation } from './designsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";

const EditDesignForm = ({ design }) => {
    const navigate = useNavigate();
    const [updateDesign] = useUpdateDesignMutation();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: products, isFetching: isFetchingProducts, isError: isProductsError } = useGetProductsQuery();

    const [productID, setProductID] = useState(design.productID);
    const [name, setName] = useState(design.name);
    const [description, setDescription] = useState(design.description);
    const [version, setVersion] = useState(design.version);
    const [status, setStatus] = useState(design.status);
    const [designer, setDesigner] = useState(design.designer);
    const [file, setFile] = useState(null);

    const onSaveChanges = async () => {
        const formData = new FormData();
        formData.append('productID', productID);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('version', version);
        formData.append('status', status);
        formData.append('designer', designer);
        formData.append('modificationDate', new Date());
        formData.append('designImage', file);

        try {
            await updateDesign({id: design._id, formData}).unwrap();
            navigate('/admin-dashboard/designs');
        } catch (error) {
            console.error('Failed to update the design:', error);
        }
    };

    if (isFetchingUsers || isFetchingProducts) return <p>Loading...</p>;
    if (isUsersError || isProductsError) return <p>Error loading data.</p>;

    return (
        <div className="container mt-3">
            <h2>Edit Design</h2>
            <form encType="multipart/form-data">
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
                    <label htmlFor="version" className="form-label">Version:</label>
                    <input type="number" className="form-control" id="version" value={version} onChange={e => setVersion(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select className="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Draft">Draft</option>
                        <option value="Review">Review</option>
                        <option value="Update">Update</option>
                        <option value="Final">Final</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="designer" className="form-label">Designer:</label>
                    <select className="form-select" id="designer" value={designer} onChange={e => setDesigner(e.target.value)}>
                        <option value="">Select a Designer</option>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Design File</label>
                    <input type="file" className="form-control" id="file" onChange={e => setFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={onSaveChanges}>
                    <FontAwesomeIcon icon={faSave} /> Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditDesignForm;
