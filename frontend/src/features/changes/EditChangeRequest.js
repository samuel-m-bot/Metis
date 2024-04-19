import { useParams } from 'react-router-dom';
import EditChangeRequestForm from './EditChangeRequestForm';
import { useGetChangeRequestsQuery } from './changeRequestsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditChangeRequest = () => {
    const { id } = useParams();

    const { changeRequest } = useGetChangeRequestsQuery("changeRequestList", {
        selectFromResult: ({ data }) => ({
            changeRequest: data?.entities[id]
        }),
    })
    const content = changeRequest ? <EditChangeRequestForm changeRequest={changeRequest} /> : <LoadingSpinner/>;

    return content
}

export default EditChangeRequest;
