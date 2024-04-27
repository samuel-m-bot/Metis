import React from 'react';

const RelatedItems = ({ changeRequestData }) => {
    const { relatedDocuments, relatedDesigns, relatedProducts } = changeRequestData;

    return (
        <div className="container mt-3">
            <h3>Related Documents</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Revision Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {relatedDocuments.length > 0 ? 
                        relatedDocuments.map(doc => (
                            <tr key={doc._id}>
                                <td>{doc.title}</td>
                                <td>{doc.type}</td>
                                <td>{doc.revisionNumber}</td>
                                <td>{doc.status}</td>
                            </tr>
                        )) :
                        <tr><td colSpan="4">No related documents for this change request.</td></tr>
                    }
                </tbody>
            </table>

            <h3>Related Designs</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Revision Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {relatedDesigns.length > 0 ? 
                        relatedDesigns.map(design => (
                            <tr key={design._id}>
                                <td>{design.name}</td>
                                <td>{design.type}</td>
                                <td>{design.revisionNumber}</td>
                                <td>{design.status}</td>
                            </tr>
                        )) :
                        <tr><td colSpan="4">No related designs for this change request.</td></tr>
                    }
                </tbody>
            </table>

            <h3>Related Products</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Life Cycle Status</th>
                        <th>Revision Number</th>
                    </tr>
                </thead>
                <tbody>
                    {relatedProducts.length > 0 ? 
                        relatedProducts.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.lifecycleStatus}</td>
                                <td>{product.revisionNumber}</td>
                            </tr>
                        )) :
                        <tr><td colSpan="4">No related products for this change request.</td></tr>
                    }
                </tbody>
            </table>
        </div>
    );
};

export default RelatedItems;
