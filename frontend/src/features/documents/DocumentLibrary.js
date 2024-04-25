import DocumentList from './DocumentList';
import { useGetDocumentsQuery } from './documentsApiSlice';

const DocumentLibrary = ({ projectId }) => {
    const {
        data: documentData,
        isLoading,
        isError,
        error
    } = useGetDocumentsQuery(projectId, {
        pollingInterval: 120000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const documents = documentData ? documentData.ids.map(id => documentData.entities[id]) : [];

    return (
        <div>
            <div className='row'>
                <h3>All Documents</h3>
                <DocumentList 
                    documents={documents}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                />
            </div>
        </div>
    );
};

export default DocumentLibrary;
