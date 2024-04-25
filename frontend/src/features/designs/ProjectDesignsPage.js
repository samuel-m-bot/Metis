import { useParams } from 'react-router-dom';
import DesignList from './DesignList';
import { useGetDesignsByProjectIdQuery } from './designsApiSlice';

const ProjectDesignsPage = () => {
  const { projectId } = useParams();
  const {
    data: designs,
    isLoading,
    isError,
    error
  } = useGetDesignsByProjectIdQuery(projectId);

  if (isLoading) return <div className="container mt-3"><p>Loading designs...</p></div>;
  if (isError) return <div className="container mt-3"><p>Error: {error.message}</p></div>;

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Project Designs</h1>
      {designs && <DesignList designs={designs.ids.map(id => designs.entities[id])} />}
    </div>
  );
};

export default ProjectDesignsPage;
