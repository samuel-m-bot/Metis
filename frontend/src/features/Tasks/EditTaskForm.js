import { useState, useEffect } from "react";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetProjectsQuery } from "../projects/projectsApiSlice";
import { useLazyGetDocumentsQuery, useLazyGetDesignsQuery, useLazyGetProductsQuery } from "../entities/entitiesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditTaskForm = ({ task }) => {
    const navigate = useNavigate();
    const [updateTask, { isLoading }] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    const { data: users } = useGetUsersQuery();
    const { data: projects } = useGetProjectsQuery();
    const [triggerGetDocuments, { data: documents }] = useLazyGetDocumentsQuery();
    const [triggerGetDesigns, { data: designs }] = useLazyGetDesignsQuery();
    const [triggerGetProducts, { data: products }] = useLazyGetProductsQuery();

    const [projectId, setProjectId] = useState(task.projectId);
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);
    const [priority, setPriority] = useState(task.priority);
    const [assignedTo, setAssignedTo] = useState(task.assignedTo);
    const [taskType, setTaskType] = useState(task.taskType);
    const [relatedTo, setRelatedTo] = useState(task.relatedTo);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [assignedDesign, setAssignedDesign] = useState(task.assignedDesign);
    const [assignedDocument, setAssignedDocument] = useState(task.assignedDocument);
    const [assignedProduct, setAssignedProduct] = useState(task.assignedProduct);

    useEffect(() => {
        if (relatedTo === 'Document') {
            triggerGetDocuments();
        } else if (relatedTo === 'Design') {
            triggerGetDesigns();
        } else if (relatedTo === 'Product') {
            triggerGetProducts();
        }
    }, [relatedTo, triggerGetDocuments, triggerGetDesigns, triggerGetProducts]);

    const onSaveTaskClicked = async () => {
        if (name && description && status && priority && assignedTo.length && taskType && projectId) {
            const updatedTaskData = {
                id: task.id,
                projectId,
                name,
                description,
                status,
                priority,
                assignedTo,
                taskType,
                dueDate,
                assignedDesign,
                assignedDocument,
                assignedProduct
            };
            try {
                await updateTask(updatedTaskData).unwrap();
                navigate('/admin-dashboard/tasks');
            } catch (error) {
                console.error('Failed to update the task', error);
            }
        }
    };
    const onDeleteTaskClicked = async () => {
        await deleteTask({ id: user.id });
    };
    if (isFetchingUsers || isFetchingProjects) return <p>Loading...</p>;
    if (isUsersError || isProjectsError) return <p>Error loading data.</p>;
    return (
        <div className="container mt-3">
            <h2>Create New Task</h2>
            <form>
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
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status:</label>
                    <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
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
                    <label htmlFor="assignedTo" className="form-label">Assigned To:</label>
                    <select multiple className="form-select" id="assignedTo" value={assignedTo} onChange={(e) => handleMultiSelectChange(e, setAssignedTo)}>
                        {users?.ids.map(userId => (
                            <option key={userId} value={userId}>{users.entities[userId].firstName} {users.entities[userId].surname}</option>
                        ))}
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
                        <option value="Create">Create</option>
                        <option value="Verify">Verify</option>
                        <option value="Revise">Revise</option>
                        <option value="Release">Release</option>
                        <option value="Archive">Archive</option>
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
                <div className="mb-3">
                    <label htmlFor="relatedTo" className="form-label">relatedTo:</label>
                    <select
                        className="form-select"
                        id="relatedTo"
                        value={relatedTo}
                        onChange={e => setRelatedTo(e.target.value)}
                    >
                        <option value="Design">Design</option>
                        <option value="Document">Document</option>
                        <option value="Product">Product</option>
                        <option value="Project">Project</option>
                    </select>
                </div>
                {relatedTo === 'Document' && (
                    <div className="mb-3">
                        <label htmlFor="assignedDocument" className="form-label">Assigned Document:</label>
                        <select
                            className="form-select"
                            id="assignedDocument"
                            value={assignedDocument}
                            onChange={e => setAssignedDocument(e.target.value)}
                        >
                            <option value="">Select a document</option>
                            {documents?.map(doc => (
                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {relatedTo === 'Design' && (
                    <div className="mb-3">
                        <label htmlFor="assignedDesign" className="form-label">Assigned Design:</label>
                        <select
                            className="form-select"
                            id="assignedDesign"
                            value={assignedDesign}
                            onChange={e => setAssignedDesign(e.target.value)}
                        >
                            <option value="">Select a design</option>
                            {designs?.map(design => (
                                <option key={design.id} value={design.id}>{design.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {relatedTo === 'Product' && (
                    <div className="mb-3">
                        <label htmlFor="assignedProduct" className="form-label">Assigned Product:</label>
                        <select
                            className="form-select"
                            id="assignedProduct"
                            value={assignedProduct}
                            onChange={e => setAssignedProduct(e.target.value)}
                        >
                            <option value="">Select a product</option>
                            {products?.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-primary" onClick={onSaveTaskClicked} disabled={updateProject.isLoading}>
                        <FontAwesomeIcon icon={faSave} /> Save Changes
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onDeleteTaskClicked}>
                        <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTaskForm;