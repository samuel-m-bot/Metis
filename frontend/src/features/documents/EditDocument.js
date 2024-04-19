import { useParams } from 'react-router-dom';
import EditDocumentForm from './EditDocumentForm';
import { useGetDocumentsQuery } from './documentsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditDocument = () => {
    const { id } = useParams();

    const { document } = useGetDocumentsQuery("documentList", {
        selectFromResult: ({ data }) => ({
            document: data?.entities[id]
        }),
    })
    const content = document ? <EditDocumentForm document={document} /> : <LoadingSpinner/>;

    return content
}

export default EditDocument;