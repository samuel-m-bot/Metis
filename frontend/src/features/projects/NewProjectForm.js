import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewProjectMutation } from './projectsApiSlice';
import { useGetUsersQuery } from '../users/usersApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const NewProjectForm = () => {
    const navigate = useNavigate();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const [addNewProject, { isLoading }] = useAddNewProjectMutation();

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [projectManagerID, setProjectManagerID] = useState('');

    useEffect(() => {
        // Automatically select the first project manager available once users are loaded
        if (users && !projectManagerID) {
            const firstManagerId = users.ids.find(userId => users.entities[userId].roles.includes('Project Manager'));
            if (firstManagerId) {
                setProjectManagerID(firstManagerId);
            }
        }
    }, [users, projectManagerID]);

    const projectManagers = users?.ids.filter(userId => users.entities[userId].roles.includes('Project Manager'));

    const onSaveProjectClicked = async () => {
        console.log('Selected Project Manager ID:', projectManagerID);
        if (name && startDate && description && projectManagerID) {
            const projectData = {
                name,
                startDate,
                endDate,
                description,
                projectManagerID
            };
            try {
                await addNewProject(projectData).unwrap();
                navigate('/admin-dashboard/projects');
            } catch (error) {
                console.error('Failed to save the project', error);
            }
        }
    };

    if (isFetchingUsers) return <p>Loading users...</p>;
    if (isUsersError) return <p>Error loading users.</p>;

    return (
        <div className="container mt-3">
            <h2>Create New Project</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Project Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">End Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
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
                    <label htmlFor="projectManagerID" className="form-label">Project Manager:</label>
                    <select
                        className="form-select"
                        id="projectManagerID"
                        value={projectManagerID || ''}
                        onChange={e => setProjectManagerID(e.target.value)}
                    >
                        {projectManagers.length > 0 ? (
                            projectManagers.map(userId => (
                                <option key={userId} value={userId}>
                                    {users.entities[userId].firstName} {users.entities[userId].surname}
                                </option>
                            ))
                        ) : (
                            <option value="">No project manager users</option>
                        )}
                    </select>
                </div>
                <button type="button" className="btn btn-primary" onClick={onSaveProjectClicked} disabled={isLoading}>
                    <FontAwesomeIcon icon={faSave} /> Create Project
                </button>
            </form>
        </div>
    );
};

export default NewProjectForm;