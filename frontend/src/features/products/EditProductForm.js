import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateProductMutation } from './productsApiSlice';

const EditProductForm = ({ product }) => {
    const navigate = useNavigate();
    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [category, setCategory] = useState(product.category);
    const [lifecycleStatus, setLifecycleStatus] = useState(product.lifecycleStatus);
    const [version, setVersion] = useState(product.version);
    const [partNumber, setPartNumber] = useState(product.partNumber);
    const [type, setType] = useState(product.type);
    const [classification, setClassification] = useState('');

    // Attributes based on product type
    const [material, setMaterial] = useState('');
    const [color, setColor] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [softwareType, setSoftwareType] = useState('');

    // Load attributes based on product type
    useEffect(() => {
        if (type === 'Physical' && product.physicalAttributes) {
            setMaterial(product.physicalAttributes.material);
            setColor(product.physicalAttributes.color);
            setDimensions(product.physicalAttributes.dimensions);
        } else if (type === 'Software' && product.digitalAttributes) {
            setSoftwareType(product.digitalAttributes.softwareType);
            setVersion(product.digitalAttributes.version);
        }
    }, [product, type]);

    const onSaveProductClicked = async () => {
        const updatedProduct = {
            id: product.id,
            name,
            description,
            category,
            lifecycleStatus,
            version,
            partNumber,
            classification,
            type,
            physicalAttributes: { material, color, dimensions },
            digitalAttributes: { softwareType, version },
        };

        try {
            await updateProduct(updatedProduct).unwrap();
            navigate('admin-dashboard/products');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <div className="container mt-3">
            <h2>Edit Product</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        className="form-control"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lifecycleStatus">Lifecycle Status</label>
                    <select
                        id="lifecycleStatus"
                        className="form-control"
                        value={lifecycleStatus}
                        onChange={e => setLifecycleStatus(e.target.value)}
                    >
                        <option value="Concept">Concept</option>
                        <option value="Development">Development</option>
                        <option value="Market">Market</option>
                        <option value="Retire">Retire</option>
                    </select>
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
                    <label htmlFor="type">Product Type</label>
                    <select
                        id="type"
                        className="form-control"
                        value={type}
                        onChange={e => setType(e.target.value)}
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
                            <label htmlFor="material">Material</label>
                            <input
                                type="text"
                                id="material"
                                className="form-control"
                                value={material}
                                onChange={e => setMaterial(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="color">Color</label>
                            <input
                                type="text"
                                id="color"
                                className="form-control"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dimensions">Dimensions</label>
                            <input
                                type="text"
                                id="dimensions"
                                className="form-control"
                                value={dimensions}
                                onChange={e => setDimensions(e.target.value)}
                            />
                        </div>
                    </>
                )}
                {type === 'Software' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="softwareType">Software Type</label>
                            <input
                                type="text"
                                id="softwareType"
                                className="form-control"
                                value={softwareType}
                                onChange={e => setSoftwareType(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="version">Version</label>
                            <input
                                type="text"
                                id="version"
                                className="form-control"
                                value={version}
                                onChange={e => setVersion(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <button type="button" className="btn btn-primary" onClick={onSaveProductClicked} disabled={isLoading}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProductForm;
