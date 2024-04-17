import { useState, useEffect } from "react";
import { useAddNewTaskMutation } from "./tasksApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetProjectsQuery } from "../projects/projectsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewTaskForm = () => {
    const navigate = useNavigate();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();
    const [addNewTask, { isLoading }] = useAddNewTaskMutation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [status, setStatus] = useState('Ongoing');
    const [priority, setPriority] = useState('Medium');
    const [assignedTo, setAssignedTo] = useState([]);
    const [taskType, setTaskType] = useState('Review');
    const [dueDate, setDueDate] = useState('');

    const onSaveTaskClicked = async () => {
        console.log(projectId)
        if (name && description && status && priority && assignedTo.length && taskType && projectId) {
            const taskData = {
                name,
                description,
                status,
                priority,
                assignedTo,
                taskType,
                projectId,
                dueDate: dueDate || undefined
            };
            try {
                await addNewTask(taskData).unwrap();
                navigate('/admin-dashboard/tasks');
            } catch (error) {
                console.error('Failed to save the task', error);
            }
        }
    };

    if (isFetchingUsers || isFetchingProjects) return <p>Loading...</p>;
    if (isUsersError || isProjectsError) return <p>Error loading data.</p>;
    return (
        <div className="container mt-3">
            <h2>Create New Task</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Task Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="projectId" className="form-label">Project:</label>
                    <select
                        className="form-select"
                        id="projectId"
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                    >
                        <option value="">Select a project</option>
                        {projects?.ids.map(id => (
                            <option key={id} value={id}>
                                {projects.entities[id].name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="assignedTo" className="form-label">Assign To:</label>
                    <select multiple className="form-select" id="assignedTo" value={assignedTo}
                            onChange={e => setAssignedTo([...e.target.selectedOptions].map(o => o.value))}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Upcoming">Upcoming</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Priority:</label>
                    <select
                        className="form-select"
                        id="priority"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="taskType" className="form-label">Task Type:</label>
                    <select
                        className="form-select"
                        id="taskType"
                        value={taskType}
                        onChange={e => setTaskType(e.target.value)}
                    >
                        <option value="Review">Review</option>
                        <option value="Update">Update</option>
                        <option value="Approve">Approve</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="dueDate" className="form-label">Due Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={onSaveTaskClicked} disabled={isLoading}>
                    <FontAwesomeIcon icon={faSave} /> Create Task
                </button>
            </form>
        </div>
    );
};

export default NewTaskForm;
