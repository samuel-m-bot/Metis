import { useParams } from 'react-router-dom';
import EditDocumentForm from './EditDocumentForm';
import { useSelector } from 'react-redux';
import { selectDocumentById } from './documentsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditDocument = () => {
    const { id } = useParams();
    const document = useSelector(state => selectDocumentById(state, id));

    const content = document ? <EditDocumentForm document={document} /> : <LoadingSpinner/>;

    return content;
}

export default EditDocument;