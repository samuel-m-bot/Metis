const RelatedItems = ({ changeRequestData }) => {
    const { relatedDocuments, relatedDesigns, relatedProducts } = changeRequestData;

    return(
        <div className="related-documents-items container mt-3">
            <h3>Related Documents</h3>
            <ul className="list-group mb-3">
                {relatedDocuments.length > 0 ? 
                    relatedDocuments.map(doc => (
                        <li key={doc._id} className="list-group-item">
                            {doc.title} (Document ID: {doc._id})
                        </li>
                    )) :
                    <p>No related documents for this change request.</p>
                }
            </ul>

            <h3>Related Designs</h3>
            <ul className="list-group mb-3">
                {relatedDesigns.length > 0 ? 
                    relatedDesigns.map(design => (
                        <li key={design._id} className="list-group-item">
                            {design.name} (Design ID: {design._id})
                        </li>
                    )) :
                    <p>No related designs for this change request.</p>
                }
            </ul>
            <h3>Related Products</h3>
            <ul className="list-group">
                {relatedProducts.length > 0 ? 
                    relatedProducts.map(product => (
                        <li key={product._id} className="list-group-item">
                            {product.name} (Product ID: {product._id})
                        </li>
                    )) :
                    <p>No related products for this change request.</p>
                }
            </ul>
        </div>
    )
};

export default RelatedItems;
