import { useParams } from 'react-router-dom';
import EditDocumentForm from './EditDocumentForm';
import { useGetDocumentByIdQuery } from './documentsApiSlice'; 
import LoadingSpinner from '../../components/LoadingSpinner';

const EditDocument = () => {
    const { documentId } = useParams();  

    const {
        data: document,
        isFetching,
        isError,
        error
    } = useGetDocumentByIdQuery(documentId); 

    console.log(documentId, document); 
    
    if (isFetching) return <LoadingSpinner />;
    if (isError) return <p>Error: {error?.message || 'Failed to load document'}</p>;

    return document ? <EditDocumentForm document={document} /> : <p>No document found.</p>;
}

export default EditDocument;
