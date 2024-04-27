import { useParams } from 'react-router-dom';
import EditTaskForm from './EditTaskForm';
import { useGetTaskByIdQuery } from './tasksApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditTask = () => {
    const { id } = useParams(); 
    
    const { data: task, isLoading, isError, error } = useGetTaskByIdQuery(id);

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <p>Error loading the task: {error?.data?.message || "An error occurred"}</p>;

    const content = task ? <EditTaskForm task={task} /> : <p>Task not found.</p>;

    return content;
}

export default EditTask;
