import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewDesignMutation } from './designsApiSlice';
import { useGetProductsQuery } from '../products/productsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';

const NewDesignForm = () => {
    const navigate = useNavigate();
    const [addNewDesign, { isLoading }] = useAddNewDesignMutation();
    const { data: products, isFetching: isFetchingProducts, isError: isProductsError } = useGetProductsQuery();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();

    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [version, setVersion] = useState('');
    const [status, setStatus] = useState('Draft');
    const [designer, setDesigner] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('productID', productId);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('version', version);
        formData.append('status', status);
        formData.append('designer', designer);
        formData.append('designImage', file);

        try {
            await addNewDesign({formData}).unwrap();
            navigate('/admin-dashboard/designs');
        } catch (error) {
            console.error('Failed to create design:', error);
        }
    };

    if (isFetchingUsers || isFetchingProducts) return <p>Loading...</p>;
    if (isUsersError || isProductsError) return <p>Error loading data.</p>;
    return (
        <div className="container mt-3">
            <h1>Create New Design</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="version" className="form-label">Version</label>
                    <input type="text" className="form-control" id="version" value={version} onChange={e => setVersion(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select className="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Draft">Draft</option>
                        <option value="Review">Update</option>
                        <option value="Review">Review</option>
                        <option value="Final">Final</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="designer" className="form-label">Designer:</label>
                    <select multiple className="form-select" id="designer" value={designer}
                            onChange={e => setDesigner([...e.target.selectedOptions].map(o => o.value))}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Design File</label>
                    <input type="file" className="form-control" id="file" onChange={e => setFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>Create Design</button>
            </form>
        </div>
    );
};

export default NewDesignForm;