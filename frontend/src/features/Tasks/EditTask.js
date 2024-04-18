import { useParams } from 'react-router-dom';
import EditTaskForm from './EditTaskForm';
import { useSelector } from 'react-redux';
import { selectTaskById } from './tasksApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditTask = () => {
    const { id } = useParams();
    const task = useSelector(state => selectTaskById(state, id));

    const content = task ? <EditTaskForm task={task} /> : <LoadingSpinner/>;

    return content;
}

export default EditTask;
