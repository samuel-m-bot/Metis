import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewProductMutation } from './productsApiSlice';

const NewProductForm = () => {
    const navigate = useNavigate();
    const [addNewProduct, { isLoading }] = useAddNewProductMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [lifecycleStatus, setLifecycleStatus] = useState('Concept');
    const [version, setVersion] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [type, setType] = useState('Physical');
    const [hasParts, setHasParts] = useState(false);

    const [material, setMaterial] = useState('');
    const [color, setColor] = useState('');
    const [dimensions, setDimensions] = useState('');

    const [softwareType, setSoftwareType] = useState('');
    const [digitalVersion, setDigitalVersion] = useState('');

    const onSaveProductClicked = async () => {
        const productData = {
            name,
            description,
            category,
            lifecycleStatus,
            version,
            type,
            ...(hasParts && { partNumber }),
            ...(type === 'Physical' && { physicalAttributes: { material, color, dimensions } }),
            ...(type === 'Software' && { digitalAttributes: { softwareType, version: digitalVersion } }),
        };

        try {
            await addNewProduct(productData).unwrap();
            navigate('/admin-dashboard/products');
        } catch (error) {
            console.error('Failed to save the product', error);
        }
    };

    return (
        <div className="container mt-3">
            <h2>Create New Product</h2>
            <form>
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
                    <input
                        type="text"
                        className="form-control"
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lifecycleStatus" className="form-label">Lifecycle Status:</label>
                    <select
                        className="form-select"
                        id="lifecycleStatus"
                        value={lifecycleStatus}
                        onChange={e => setLifecycleStatus(e.target.value)}
                    >
                        <option value="Concept">Concept</option>
                        <option value="Development">Development</option>
                        <option value="Market">Market</option>
                        <option value="Retire">Retire</option>
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
                            setHasParts(false);
                        }}
                    >
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
                        <div className="mb-3">
                            <label htmlFor="digitalVersion" className="form-label">Version:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="digitalVersion"
                                value={digitalVersion}
                                onChange={e => setDigitalVersion(e.target.value)}
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
