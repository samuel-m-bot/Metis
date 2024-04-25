import { useLazyDownloadDocumentQuery } from "../documents/documentsApiSlice";
import { useLazyDownloadDesignQuery } from "../designs/designsApiSlice";
import { useGetUserPermissionsQuery } from "../projects/projectsApiSlice";

const ItemDetails = ({ itemData, itemType, }) => {
    const { data: permissions, isFetching, isError, error } = useGetUserPermissionsQuery(itemData.projectId);
    const [triggerDocumentDownload, { isLoading: isDownloadingDocument }] = useLazyDownloadDocumentQuery();
    const [triggerDesignDownload, { isLoading: isDownloadingDesign }] = useLazyDownloadDesignQuery();
    const hasReadPermission = permissions?.permissions.includes("Read")

    const handleDocumentDownload = async (documentId) => {
        console.log(permissions)
        try {
            const { blob, filename } = await triggerDocumentDownload(documentId).unwrap();
      
            console.log('Download Filename:', filename);
            console.log('Download Blob:', blob);
            console.log('Download Blob Size:', blob?.size);  
            console.log('Download Blob Type:', blob?.type);
      
            if (!blob || blob.size === 0) {
                throw new Error("Blob data is missing or invalid.");
            }
      
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
      
            window.URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            console.error('Failed to download the document:', error);
        }
      };
      const handleDesignDownload = async (design) => {
        // Extract the file extension from the fileName
        const fileExtension = design.attachment.fileName.split('.').pop();
        
        // Trigger the lazy query
        const result = await triggerDesignDownload(design.id).unwrap();
        
        // Create a blob link to download
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement('a');
        link.href = url;
        
        // Use the file extension for the download attribute
        link.setAttribute('download', `design_${design.id}.${fileExtension}`);
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        link.remove();
      };

    return (
        <div className="detail-section">
            <h2>General Details</h2>
            <div className="detail-row">
                <p className="detail-item"><span className="detail-label">Item Title:</span> {itemData.name || itemData.title}</p>
                <p className="detail-item"><span className="detail-label">Item ID:</span> {itemData.id}</p>
                <p className="detail-item"><span className="detail-label">Version:</span> {itemData.revisionNumber}</p>
                <p className="detail-item"><span className="detail-label">Status:</span> {itemData.status}</p>
                <p className="detail-item">
                    <span className="detail-label">Creation Date:</span>
                    {new Date(itemData.createdAt || itemData.creationDate).toLocaleDateString()}
                </p>
                <p className="detail-item">
                    <span className="detail-label">Last Modified:</span>
                    {new Date(itemData.updatedAt || itemData.lastModifiedDate).toLocaleDateString()}
                </p>
                {itemType === 'Document' && (
                    <button onClick={() => handleDocumentDownload(itemData.id)} className="btn btn-primary btn-lg" disabled={!hasReadPermission}>
                        Download Document
                    </button>
                )}
                {itemType === 'Design' && (
                    <button onClick={() => handleDesignDownload(itemData.id)} className="btn btn-success btn-lg" disabled={!hasReadPermission}>
                        Download Design
                    </button>
                )}
            </div>
            <div className='row'>
                <div className='col'>
                    <div className="detail-section">
                        <h2>Item Description</h2>
                        <div className="detail-row">
                            <p className="detail-item"><span className="detail-label">Description:</span> {itemData.description}</p>
                        </div>
                    </div>
                </div>
                {['Document', 'Design'].includes(itemType) && (
                    <div className='col'>
                        <div className="detail-section">
                            <h2>{itemType === 'Document' ? 'Authors' : 'Designers'}</h2>
                            <div className="detail-row">
                                <p className="detail-item">
                                    <span className="detail-label">{itemType === 'Document' ? 'Author(s):' : 'Designer(s):'}</span>
                                    {itemType === 'Document' ? 
                                        itemData.authors?.map(author => `${author.firstName} ${author.surname}`).join(', ') 
                                        : 
                                        itemData.designers?.map(designer => `${designer.firstName} ${designer.surname}`).join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='row'>
                <div className='col'>
                    <div className="detail-section">
                        <h2>Classification</h2>
                        <div className="detail-row">
                            <p className="detail-item"><span className="detail-label">Type:</span> {itemData.type}</p>
                        </div>
                    </div>
                </div>

                <div className='col'>
                    <div className="detail-section">
                        <h2>Access Control</h2>
                        <div className="detail-row">
                            <ul>
                                {console.log(permissions)}
                                {permissions?.permissions.map((perm, index) => (
                                    <li key={index}>{perm}</li>
                                ))}
                                {isError && (
                                    <li>{error?.data?.message}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ItemDetails;
