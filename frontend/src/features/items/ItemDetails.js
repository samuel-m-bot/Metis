import { useLazyDownloadDocumentQuery, useDownloadDocumentQuery } from "../documents/documentsApiSlice";
import { useLazyDownloadDesignQuery } from "../designs/designsApiSlice";
import { useGetUserPermissionsQuery } from "../projects/projectsApiSlice";

const ItemDetails = ({ itemData, itemType, }) => {
    const { data: permissions, isFetching, isError, error } = useGetUserPermissionsQuery(itemData.projectId);
    const [triggerDocumentDownload, { isLoading: isDownloadingDocument }] = useLazyDownloadDocumentQuery();
    const [triggerDesignDownload, { isLoading: isDownloadingDesign }] = useLazyDownloadDesignQuery();
    const { data, error: errorD, isLoading } = useDownloadDocumentQuery(itemData.id, {
        skip: true // This prevents the query from automatically running
    });
    const hasReadPermission = permissions?.permissions.includes("Read")

    // const handleDocumentDownload = async (documentId) => {
    //     console.log(permissions)
    //     try {
    //         const { blob, filename } = await triggerDocumentDownload(documentId).unwrap();
      
    //         console.log('Download Filename:', filename);
    //         console.log('Download Blob:', blob);
    //         console.log('Download Blob Size:', blob?.size);  
    //         console.log('Download Blob Type:', blob?.type);
      
    //         if (!blob || blob.size === 0) {
    //             throw new Error("Blob data is missing or invalid.");
    //         }
      
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', filename);
    //         document.body.appendChild(link);
    //         link.click();
      
    //         window.URL.revokeObjectURL(url);
    //         link.remove();
    //     } catch (error) {
    //         console.error('Failed to download the document:', error);
    //     }
    // };
    const handleDesignDownload = async (designId) => {
        try {
            const result = await triggerDesignDownload(designId).unwrap();
            console.log('Received result from server:', result);
    
            if (!result || !(result instanceof Blob)) {
                console.error('No blob data or incorrect response structure:', result);
                alert('Failed to load the design file. No data received.');
                return;
            }
    
            // Log detailed information about the blob
            console.log(`Blob received - Size: ${result.size}, Type: ${result.type}`);
    
            // Since filename is not part of the blob response, it needs to be extracted from headers or set default
            // This needs to be adjusted based on actual implementation details.
            const filename = `design_${designId}.stp`; // Default filename, ensure to handle dynamically if possible
    
            // Create a URL for the blob
            const url = window.URL.createObjectURL(result);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename; // Set filename
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            window.URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            console.error('Error downloading the design:', error);
            alert('Error downloading the design: ' + error.message);
        }
    };    
    

    const handleDownload = async () => {
        try {
            // Since triggerDocumentDownload is a function that initiates the fetch,
            // you need to use it instead of calling `data()` directly.
            const result = await triggerDocumentDownload(itemData.id).unwrap(); // Using unwrap() to handle the result directly
            if (result?.blob) {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename || 'downloaded-file';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // Clean up by revoking the Blob URL after use
            }
        } catch (error) {
            console.error('Error downloading the document:', error);
        }
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
                    <button onClick={handleDownload} className="btn btn-primary btn-lg" >
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
