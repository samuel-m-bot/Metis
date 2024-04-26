import { useHandleUpdateTaskStatusMutation } from './tasksApiSlice';
import CreationModal from '../../components/CreationModal';

const CreateTaskTab = ({ task, handleOpenModal, handleCloseModal, showModal }) => {
    const [handleUpdateTaskStatus, { isLoading: isUpdating }] = useHandleUpdateTaskStatusMutation();

    const onUpdateTaskStatusClick = () => {
        handleUpdateTaskStatus({ taskId: task.id, status: 'In Progress' })
            .unwrap()
            .then(response => {
                alert('Task status updated to In Progress.');
            })
            .catch(error => {
                console.error('Error updating task status:', error);
                alert('Failed to update task status.');
            });
    };

    return (
        <>
            <div className="create-item">
                <h3>Create New Item</h3>
                <p>To create a new item, please follow the instructions below:</p>
                <ol>
                    <li>Click on 'Create Item' to open the creation form.</li>
                    <li>Fill out the form with the necessary details.</li>
                    <li>Submit the form to finalize the creation of the new item.</li>
                </ol>
                <button className="btn btn-primary" onClick={handleOpenModal}>Create Item</button>
                <button 
                    className="btn btn-secondary ml-2" 
                    onClick={onUpdateTaskStatusClick}
                    disabled={isUpdating}
                >
                    Mark Task as In Progress
                </button>
                <CreationModal show={showModal} taskType={task.relatedTo} closeModal={handleCloseModal} projectId={task.projectId._id} task={task}/>
            </div>
        </>
    );
};

export default CreateTaskTab;
