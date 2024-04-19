import { useState, useEffect } from "react";
import { useAddNewTaskMutation } from "./tasksApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetProjectsQuery } from "../projects/projectsApiSlice";
import { useLazyGetDocumentsQuery } from "../documents/documentsApiSlice";
import { useLazyGetDesignsQuery } from "../designs/designsApiSlice";
import { useLazyGetProductsQuery } from "../products/productsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewTaskForm = () => {
    const navigate = useNavigate();
    const { data: users, isFetching: isFetchingUsers, isError: isUsersError } = useGetUsersQuery();
    const { data: projects, isFetching: isFetchingProjects, isError: isProjectsError } = useGetProjectsQuery();
    const [addNewTask, { isLoading }] = useAddNewTaskMutation();
    const [triggerGetDocuments, { data: documents }] = useLazyGetDocumentsQuery();
    const [triggerGetDesigns, { data: designs }] = useLazyGetDesignsQuery();
    const [triggerGetProducts, { data: products }] = useLazyGetProductsQuery();

    const [projectId, setProjectId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [assignedTo, setAssignedTo] = useState([]);
    const [taskType, setTaskType] = useState('');
    const [relatedTo, setRelatedTo] = useState('Review');
    const [dueDate, setDueDate] = useState('');

    const [assignedDesign, setAssignedDesign] = useState('');
    const [assignedDocument, setAssignedDocument] = useState('');
    const [assignedProduct, setAssignedProduct] = useState('');


    useEffect(() => {
        if (relatedTo === 'Document') {
            triggerGetDocuments();
        } else if (relatedTo === 'Design') {
            triggerGetDesigns();
        } else if (relatedTo === 'Product') {
            triggerGetProducts();
        }
    }, [relatedTo, triggerGetDocuments, triggerGetDesigns, triggerGetProducts]);
    
    const handleMultiSelectChange = (event, setState) => {
        const values = Array.from(event.target.selectedOptions, option => option.value);
        setState(values);
    };

    const onSaveTaskClicked = async () => {
        console.log(status)
        if (name && description && status && priority && assignedTo.length && taskType && projectId && relatedTo) {
            const taskData = {
                projectId,
                name,
                description,
                status,
                priority,
                assignedTo,
                taskType,
                relatedTo,
                dueDate: dueDate || undefined,
                assignedDesign,
                assignedDocument,
                assignedProduct
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
                        {documents?.ids.map(documentId => (
                            <option key={documentId} value={documentId}>{documents.entities[documentId].title}</option>
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
                        {designs?.ids.map(designId => (
                            <option key={designId} value={designId}>{designs.entities[designId].name}</option>
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
                        {products?.ids.map((id) => (
                            <option key={id} value={id}>{products.entities[id].name}</option>
                        ))}
                        </select>
                    </div>
                )}
                <button type="button" className="btn btn-primary" onClick={onSaveTaskClicked} disabled={isLoading}>
                    <FontAwesomeIcon icon={faSave} /> Create Task
                </button>
            </form>
        </div>
    );
};

export default NewTaskForm;
