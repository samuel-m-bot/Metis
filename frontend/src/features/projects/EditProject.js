import { useParams } from 'react-router-dom';
import EditProjectForm from './EditProjectForm';
import { useSelector } from 'react-redux';
import { selectProjectById } from './projectsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditProject = () => {
    const { id } = useParams();
    const project = useSelector(state => selectProjectById(state, id));

    const content = project ? <EditProjectForm project={project} /> : <LoadingSpinner/>;

    return content;
}

export default EditProject;