import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateProjectMutation } from "./projectsApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUsersCog } from "@fortawesome/free-solid-svg-icons";

const EditProjectForm = ({ project }) => {
    const navigate = useNavigate();
    const [updateProject] = useUpdateProjectMutation();

    const [name, setName] = useState(project.name);
    const [startDate, setStartDate] = useState(project.startDate.split("T")[0]); // Format to YYYY-MM-DD
    const [endDate, setEndDate] = useState(project.endDate ? project.endDate.split("T")[0] : '');
    const [description, setDescription] = useState(project.description);
    const [status, setStatus] = useState(project.status);

    const onSaveChanges = async () => {
        console.log("Start of function")
        const updatedProject = {
            id: project.id,
            name,
            startDate,
            endDate,
            description,
            status,
        };

        try {
            console.log("before of function")
            await updateProject(updatedProject).unwrap();
            navigate('/admin-dashboard/projects');
        } catch (error) {
            console.error('Failed to update the project:', error);
        }
    };

    const handleManageTeam = () => {
        navigate(`/admin-dashboard/projects/${project.id}/manage-team`);
    };

    return (
        <div className="container mt-3">
            <h2>Edit Project</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Project Name:</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date:</label>
                    <input type="date" className="form-control" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">End Date:</label>
                    <input type="date" className="form-control" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select className="form-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>
                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-primary" onClick={onSaveChanges} disabled={updateProject.isLoading}>
                        <FontAwesomeIcon icon={faSave} /> Save Changes
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleManageTeam}>
                        <FontAwesomeIcon icon={faUsersCog} /> Manage Team Members
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProjectForm;
