import { useParams } from 'react-router-dom';
import EditTaskForm from './EditTaskForm';
import { useGetTasksQuery } from './tasksApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditTask = () => {
    const { id } = useParams();

    const { task } = useGetTasksQuery("taskList", {
        selectFromResult: ({ data }) => ({
            task: data?.entities[id]
        }),
    })
    const content = task ? <EditTaskForm task={task} /> : <LoadingSpinner/>;

    return content
}

export default EditTask;
