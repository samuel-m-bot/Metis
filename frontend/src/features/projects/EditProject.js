import { useParams } from 'react-router-dom';
import EditProjectForm from './EditProjectForm';
import { useGetProjectsQuery } from './projectsApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditProject = () => {
    const { id } = useParams();

    const { project } = useGetProjectsQuery("projectList", {
        selectFromResult: ({ data }) => ({
            project: data?.entities[id]
        }),
    })
    const content = project ? <EditProjectForm project={project} /> : <LoadingSpinner/>;

    return content
}

export default EditProject;