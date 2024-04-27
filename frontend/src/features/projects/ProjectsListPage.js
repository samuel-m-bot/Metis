import { useGetProjectsQuery } from './projectsApiSlice';
import ProjectsList from './ProjectList';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProjectsListPage = () => {
    const {
        data: projectsData,
        isLoading,
        isError,
        error
    } = useGetProjectsQuery('projectList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <p>Error loading projects: {error?.data?.message || "An error occurred"}</p>;


    const projects = projectsData?.ids.map(id => projectsData.entities[id]);

    console.log(projects); 

    return (
        <div>
            <h1>Projects</h1>
            <ProjectsList projects={projects} />
        </div>
    );
}

export default ProjectsListPage;
