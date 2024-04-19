import { useParams } from 'react-router-dom';
import EditDesignForm from './EditDesignForm';
import { useGetDesignsQuery } from './designsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditDesign = () => {
    const { id } = useParams();

    const { design } = useGetDesignsQuery("designList", {
        selectFromResult: ({ data }) => ({
            design: data?.entities[id]
        }),
    })
    const content = design ? <EditDesignForm design={design} /> : <LoadingSpinner/>;

    return content
}

export default EditDesign;