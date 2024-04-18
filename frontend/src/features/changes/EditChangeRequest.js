import { useParams } from 'react-router-dom';
import EditChangeRequestForm from './EditChangeRequestForm';
import { useSelector } from 'react-redux';
import { selectChangeRequestById } from './changeRequestsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditChangeRequest = () => {
    const { id } = useParams();
    const changeRequest = useSelector(state => selectChangeRequestById(state, id));

    const content = changeRequest ? <EditChangeRequestForm changeRequest={changeRequest} /> : <LoadingSpinner/>;

    return content;
}

export default EditChangeRequest;
