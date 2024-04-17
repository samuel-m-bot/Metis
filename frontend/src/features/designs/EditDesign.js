import { useParams } from 'react-router-dom';
import EditDesignForm from './EditDesignForm';
import { useSelector } from 'react-redux';
import { selectDesignById } from './designsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditDesign = () => {
    const { id } = useParams();
    const design = useSelector(state => selectDesignById(state, id));

    const content = design ? <EditDesignForm design={design} /> : <LoadingSpinner/>;

    return content;
}

export default EditDesign;